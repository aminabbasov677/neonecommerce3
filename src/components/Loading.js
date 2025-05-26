import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShoppingCartIcon,
  UserIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { state } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsProfileDropdownOpen(false);
    }
  };

  const handleSearchInputClick = (e) => {
    e.stopPropagation();
  };

  const handleSignOut = () => {
    signOut();
    setIsProfileDropdownOpen(false);
    navigate("/");
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`navbar ${theme}`}
    >
      <div className="navbar-container">
        <div className="logo-icons-popup-search-container">
          <Link to="/" className="logo">
            <motion.div whileHover={{ scale: 1.1 }} className="logo-text">
              YourSHOP
            </motion.div>
          </Link>
          <div className="icons-popup-container">
            <div className="nav-icons">
              <div className="profile-icon-container">
                <button
                  onClick={toggleProfileDropdown}
                  className="nav-icon profile-icon"
                >
                  <UserIcon className="icon" />
                </button>
                {isProfileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="profile-dropdown"
                  >
                    {user ? (
                      <>
                        <Link
                          to="/profile"
                          className="dropdown-item"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          My Profile
                        </Link>
                        <Link
                          to="/profile"
                          className="dropdown-item"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          My Orders
                        </Link>
                        <button
                          className="dropdown-item"
                          onClick={handleSignOut}
                        >
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/signup"
                          className="dropdown-item"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          Sign Up
                        </Link>
                        <Link
                          to="/signin"
                          className="dropdown-item"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          Sign In
                        </Link>
                      </>
                    )}
                  </motion.div>
                )}
              </div>
              <Link to="/cart" className="nav-icon cart-icon">
                <ShoppingCartIcon className="icon" />
                {state.items.length > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="cart-badge"
                  >
                    {state.items.reduce((acc, item) => acc + item.quantity, 0)}
                  </motion.span>
                )}
              </Link>
              <button
                onClick={toggleTheme}
                className="neon-button theme-toggle"
              >
                {theme === "light" ? "Dark" : "Light"} Mode
              </button>
            </div>
            <div className="mobile-popup">
              <Link to="/" className="popup-item">
                Home
              </Link>
              <Link to="/about" className="popup-item">
                About
              </Link>
              <Link to="/contact" className="popup-item">
                Contact
              </Link>
            </div>
          </div>
          <form
            onSubmit={handleSearch}
            className="search-form"
            onClick={handleSearchInputClick}
          >
            <div className="search-container">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="search-input"
                onClick={handleSearchInputClick}
              />
              <button
                type="submit"
                className="search-button"
                onClick={handleSearchInputClick}
              >
                <MagnifyingGlassIcon className="search-icon" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.nav>
  );
}

export default Navbar;
