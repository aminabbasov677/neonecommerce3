import React from "react";
import { useParams, useNavigate } from "react-router-dom"; // Added useNavigate
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import "./ProductDetail.css";

function ProductDetail() {
  const { id } = useParams();
  const { dispatch } = useCart();
  const navigate = useNavigate(); // Initialize useNavigate

  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () =>
      fetch(`https://fakestoreapi.com/products/${id}`).then((res) =>
        res.json()
      ),
  });

  const addToCart = () => {
    dispatch({ type: "ADD_TO_CART", payload: product });
    toast.success("Səbətə əlavə olundu!");
  };

  const handleBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Məhsul yüklənmədi. Zəhmət olmasa, yenidən cəhd edin.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="product-detail-container"
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleBack}
        className="back-button"
      >
        Back
      </motion.button>
      <div className="product-detail">
        <motion.div
          initial={{ x: -50 }}
          animate={{ x: 0 }}
          className="product-image-container"
        >
          <img
            src={product.image}
            alt={product.title}
            className="product-image"
          />
        </motion.div>

        <motion.div
          initial={{ x: 50 }}
          animate={{ x: 0 }}
          className="product-info"
        >
          <h1 className="product-title">{product.title}</h1>
          <p className="product-category">{product.category}</p>
          <p className="product-description">{product.description}</p>
          <div className="product-price-container">
            <span className="product-price">${product.price}</span>
            <div className="product-rating">
              <span>Reytinq: {product.rating.rate}</span>
              <span>({product.rating.count} rəy)</span>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            Q
            whileTap={{ scale: 0.95 }}
            onClick={addToCart}
            className="add-to-cart-button"
          >
            Add to Cart
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default ProductDetail;
