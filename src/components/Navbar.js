import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShoppingCartIcon,
  UserIcon,
  Bars3Icon,
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
  const [isMobilePopupOpen, setIsMobilePopupOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const profileDropdownRef = useRef(null);
  const mobilePopupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
      if (mobilePopupRef.current && !mobilePopupRef.current.contains(event.target)) {
        setIsMobilePopupOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMobilePopup = () => {
    setIsMobilePopupOpen(!isMobilePopupOpen);
    setIsProfileDropdownOpen(false);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
    setIsMobilePopupOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsMobilePopupOpen(false);
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
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={`navbar ${theme}`}
    >
      <div className="navbar-container">
        <Link to="/" className="logo">
          <motion.div whileHover={{ scale: 1.1 }} className="logo-text">
            YourSHOP
          </motion.div>
        </Link>

        <div className="nav-links">
          <NavLink to="/" className="nav-link" end>
            Home
          </NavLink>
          <NavLink to="/about" className="nav-link">
            About
          </NavLink>
          <NavLink to="/contact" className="nav-link">
            Contact
          </NavLink>
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

        <div className="nav-icons">
          <div className="profile-icon-container" ref={profileDropdownRef}>
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
                    <button className="dropdown-item" onClick={handleSignOut}>
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
          <Link
            to="/cart"
            className="nav-icon cart-icon"
            onClick={() => setIsMobilePopupOpen(false)}
          >
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
          <button onClick={toggleTheme} className="neon-button theme-toggle">
            {theme === "light" ? "Dark" : "Light"} Mode
          </button>
          <button
            onClick={toggleMobilePopup}
            className="neon-button mobile-menu-toggle"
          >
            <Bars3Icon className="icon" />
          </button>
          {isMobilePopupOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mobile-popup"
              ref={mobilePopupRef}
            >
              <NavLink
                to="/"
                className="popup-item"
                end
                onClick={() => setIsMobilePopupOpen(false)}
              >
                Home
              </NavLink>
              <NavLink
                to="/about"
                className="popup-item"
                onClick={() => setIsMobilePopupOpen(false)}
              >
                About
              </NavLink>
              <NavLink
                to="/contact"
                className="popup-item"
                onClick={() => setIsMobilePopupOpen(false)}
              >
                Contact
              </NavLink>
            </motion.div>
          )}
        </div>
      </div>
    </motion.nav>
  );
}

export default Navbar;
