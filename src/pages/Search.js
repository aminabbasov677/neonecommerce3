import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import "./Search.css";

const Search = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    sortOrder: "",
    categories: [],
  });
  const [categories, setCategories] = useState([]);
  const productsPerPage = 9;
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q");
  const { dispatch } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://fakestoreapi.com/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const products = await response.json();

        // Extract unique categories
        const uniqueCategories = [
          ...new Set(products.map((product) => product.category)),
        ];
        setCategories(uniqueCategories);

        if (query) {
          const filteredProducts = products.filter((product) => {
            const searchTerms = query.toLowerCase().split(" ");
            const productText =
              `${product.title} ${product.description} ${product.category}`.toLowerCase();
            return searchTerms.every((term) => productText.includes(term));
          });
          setSearchResults(filteredProducts);
          setFilteredResults(filteredProducts);
        } else {
          setSearchResults([]);
          setFilteredResults([]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    setCurrentPage(1);
  }, [query]);

  const applyFilters = () => {
    let results = [...searchResults];

    // Price filtering
    if (filters.minPrice !== "") {
      results = results.filter(
        (product) => product.price >= parseFloat(filters.minPrice)
      );
    }
    if (filters.maxPrice !== "") {
      results = results.filter(
        (product) => product.price <= parseFloat(filters.maxPrice)
      );
    }

    // Category filtering
    if (filters.categories.length > 0) {
      results = results.filter((product) =>
        filters.categories.includes(product.category)
      );
    }

    // Sorting
    if (filters.sortOrder === "asc") {
      results.sort((a, b) => a.price - b.price);
    } else if (filters.sortOrder === "desc") {
      results.sort((a, b) => b.price - a.price);
    }

    setFilteredResults(results);
    setCurrentPage(1);
    setIsFilterOpen(false);
    toast.success("Filters applied!");
  };

  const handleCategoryChange = (category) => {
    setFilters((prev) => {
      const categories = prev.categories.includes(category)
        ? prev.categories.filter((cat) => cat !== category)
        : [...prev.categories, category];
      return { ...prev, categories };
    });
  };

  const resetFilters = () => {
    setFilters({
      minPrice: "",
      maxPrice: "",
      sortOrder: "",
      categories: [],
    });
    setFilteredResults(searchResults);
    setCurrentPage(1);
    setIsFilterOpen(false);
    toast.success("Filters reset!");
  };

  const addToCart = (product) => {
    dispatch({ type: "ADD_TO_CART", payload: product });
    toast.success("Added to cart!");
  };

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredResults.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredResults.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="loading-container glass-effect">
        <div className="loading-spinner"></div>
        <p className="neon-effect">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container glass-effect">
        <p className="neon-effect">Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="flex justify-between items-center mb-4">
        <motion.h1
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="page-title gradient-text"
        >
          {query ? `Search Results for "${query}"` : "Search Products"}
        </motion.h1>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="filter-btn"
          onClick={() => setIsFilterOpen(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1m-1 4H5m8 4H5m8 4H5"
            />
          </svg>
          Filters
        </motion.button>
      </div>

      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            className="filter-modal glass-effect"
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="filter-content">
              <motion.h2
                className="filter-title neon-effect"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Filter Products
              </motion.h2>

              {/* Price Range */}
              <div className="filter-section">
                <h3 className="filter-subtitle">Price Range</h3>
                <div className="flex gap-4">
                  <input
                    type="number"
                    placeholder="Min Price"
                    value={filters.minPrice}
                    onChange={(e) =>
                      setFilters({ ...filters, minPrice: e.target.value })
                    }
                    className="filter-input"
                    min="0"
                  />
                  <input
                    type="number"
                    placeholder="Max Price"
                    value={filters.maxPrice}
                    onChange={(e) =>
                      setFilters({ ...filters, maxPrice: e.target.value })
                    }
                    className="filter-input"
                    min="0"
                  />
                </div>
              </div>

              {/* Sort Order */}
              <div className="filter-section">
                <h3 className="filter-subtitle">Sort By Price</h3>
                <div className="flex sort-order-container">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="sortOrder"
                      value="asc"
                      checked={filters.sortOrder === "asc"}
                      onChange={(e) =>
                        setFilters({ ...filters, sortOrder: e.target.value })
                      }
                      className="filter-radio"
                    />
                    Ascending
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="sortOrder"
                      value="desc"
                      checked={filters.sortOrder === "desc"}
                      onChange={(e) =>
                        setFilters({ ...filters, sortOrder: e.target.value })
                      }
                      className="filter-radio"
                    />
                    Descending
                  </label>
                </div>
              </div>

              {/* Categories */}
              <div className="filter-section">
                <h3 className="filter-subtitle">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <motion.label
                      key={category}
                      className="filter-checkbox-label"
                      whileHover={{ scale: 1.05 }}
                    >
                      <input
                        type="checkbox"
                        checked={filters.categories.includes(category)}
                        onChange={() => handleCategoryChange(category)}
                        className="filter-checkbox"
                      />
                      {category}
                    </motion.label>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="filter-buttons">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="filter-save-btn"
                  onClick={applyFilters}
                >
                  Save
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="filter-reset-btn"
                  onClick={resetFilters}
                >
                  Reset
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="filter-close-btn"
                  onClick={() => setIsFilterOpen(false)}
                >
                  Close
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {filteredResults.length === 0 ? (
        <div className="no-results glass-effect">
          <p className="neon-effect">
            {query
              ? "No products found matching your search or filters."
              : "Enter a search term to find products."}
          </p>
        </div>
      ) : (
        <>
          <div className="products-grid">
            {currentProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                whileHover={{
                  y: -10,
                  scale: 1.05,
                  boxShadow: "0 0 20px var(--neon-pink)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="product-card"
              >
                <div className="product-image">
                  <Link to={`/product/${product.id}`}>
                    <img src={product.image} alt={product.title} />
                  </Link>
                </div>
                <div className="content">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="product-title neon-effect">
                      {product.title}
                    </h3>
                    <p className="product-price">${product.price.toFixed(2)}</p>
                  </Link>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => addToCart(product)}
                    className="add-to-cart-btn btn-primary"
                  >
                    Add to Cart
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="pagination-container">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`pagination-btn ${
                  currentPage === 1 ? "disabled" : ""
                }`}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </motion.button>
              <span className="pagination-current">
                {currentPage} / {totalPages}
              </span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`pagination-btn ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </motion.button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Search;
