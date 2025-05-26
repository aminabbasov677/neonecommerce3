import React from "react";
import { motion } from "framer-motion";
import "./About.css";

function About() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="about-container"
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="about-header"
      >
        <h1>About Us</h1>
        <p>Your Trusted E-Commerce Platform</p>
      </motion.div>

      <div className="about-content">
        <motion.section
          initial={{ x: -50 }}
          animate={{ x: 0 }}
          className="about-section"
        >
          <h2>Our Vision</h2>
          <p>
            We strive to provide the best shopping experience with cutting-edge
            technology and exceptional customer service. Our platform brings
            together quality products and satisfied customers.
          </p>
        </motion.section>

        <motion.section
          initial={{ x: 50 }}
          animate={{ x: 0 }}
          className="about-section"
        >
          <h2>Why Choose Us</h2>
          <ul>
            <li>Wide selection of products</li>
            <li>Secure payment system</li>
            <li>Fast delivery worldwide</li>
            <li>24/7 customer support</li>
          </ul>
        </motion.section>

        <motion.section
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          className="about-section"
        >
          <h2>Our Technology</h2>
          <p>
            Built with modern web technologies including React, Node.js, and
            MongoDB, our platform ensures a smooth and responsive shopping
            experience.
          </p>
        </motion.section>
      </div>
    </motion.div>
  );
}

export default About;
