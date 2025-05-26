import React, { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import "./Contact.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log("Form submitted:", formData);
    toast.success("Message sent successfully!");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="contact-container"
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="contact-header"
      >
        <h1>Contact Us</h1>
        <p>We'd love to hear from you</p>
      </motion.div>

      <div className="contact-content">
        <motion.div
          initial={{ x: -50 }}
          animate={{ x: 0 }}
          className="contact-info"
        >
          <h2>Get in Touch</h2>
          <div className="info-item">
            <h3>Email</h3>
            <p>support@ecommerce.com</p>
          </div>
          <div className="info-item">
            <h3>Phone</h3>
            <p>+1 (555) 123-4567</p>
          </div>
          <div className="info-item">
            <h3>Address</h3>
            <p>
              123 E-Commerce Street
              <br />
              New York, NY 10001
            </p>
          </div>
        </motion.div>

        <motion.form
          initial={{ x: 50 }}
          animate={{ x: 0 }}
          className="contact-form"
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="5"
            ></textarea>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="submit-btn"
          >
            Send Message
          </motion.button>
        </motion.form>
      </div>
    </motion.div>
  );
}

export default Contact;
