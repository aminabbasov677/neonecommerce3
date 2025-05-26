import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import Slider from "react-slick";
import toast from "react-hot-toast";
import "./Home.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Home() {
  const { dispatch } = useCart();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const productsPerPage = 9;

  const {
    data: categories = [],
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: () =>
      fetch("https://fakestoreapi.com/products/categories").then((res) =>
        res.json()
      ),
  });

  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products", selectedCategory],
    queryFn: () =>
      fetch(
        selectedCategory
          ? `https://fakestoreapi.com/products/category/${selectedCategory}`
          : "https://fakestoreapi.com/products"
      ).then((res) => res.json()),
  });

  const addToCart = (product) => {
    dispatch({ type: "ADD_TO_CART", payload: product });
    toast.success("Added to cart!");
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(products.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    arrows: false,
    appendDots: (dots) => (
      <div>
        <ul className="slick-dots-custom"> {dots} </ul>
      </div>
    ),
    customPaging: () => <div className="slick-dot-custom"></div>,
  };

  const banners = [
    "https://www.digiseller.ru/preview/1088750/p1_3690821_b9d2a549.jpg",
    "https://i.ytimg.com/vi/aqTtwGwwOhA/maxresdefault.jpg",
    "https://i.ytimg.com/vi/cTDU-u84x5Q/maxresdefault.jpg",
    "https://i.ytimg.com/vi/D_oPnckCSUI/maxresdefault.jpg?7857057827",
    "https://i.ytimg.com/vi/lKh2pHCbtno/maxresdefault.jpg",
    "https://i.ytimg.com/vi/3WvQvmCEX4w/maxresdefault.jpg",
  ];

  if (isLoading || categoriesLoading) {
    return (
      <div className="loading-container glass-effect">
        <div className="loading-spinner"></div>
        <p className="neon-effect">Loading...</p>
      </div>
    );
  }

  if (error || categoriesError) {
    return (
      <div className="error-container glass-effect">
        <p className="neon-effect">
          Error: {error?.message || categoriesError?.message}
        </p>
      </div>
    );
  }

  return (
    <div className="home-container">
      <motion.h1
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="page-title gradient-text"
      >
        Welcome to YourShop
      </motion.h1>

      <motion.div
        className="slider-container"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Slider {...sliderSettings}>
          {banners.map((banner, index) => (
            <div key={index} className="slider-item">
              <img src={banner} alt={`Banner ${index + 1}`} />
            </div>
          ))}
        </Slider>
      </motion.div>

      <motion.div
        className="category-container"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="category-buttons">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`category-btn ${!selectedCategory ? "active" : ""}`}
            onClick={() => handleCategoryChange(null)}
            aria-pressed={!selectedCategory}
          >
            All Categories
          </motion.button>
          {categories.map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`category-btn ${
                selectedCategory === category ? "active" : ""
              }`}
              onClick={() => handleCategoryChange(category)}
              aria-pressed={selectedCategory === category}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {currentProducts.length === 0 ? (
        <div className="no-results glass-effect">
          <p className="neon-effect">No products found in this category.</p>
        </div>
      ) : (
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
                  <h3 className="product-title neon-effect">{product.title}</h3>
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
      )}

      {totalPages > 1 && (
        <div className="pagination-container">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`pagination-btn ${currentPage === 1 ? "disabled" : ""}`}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            Previous
          </motion.button>
          <span className="pagination-current" aria-live="polite">
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
            aria-label="Next page"
          >
            Next
          </motion.button>
        </div>
      )}
    </div>
  );
}

export default Home;
