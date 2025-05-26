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
                    <Link
                      to="/tracking"
                      className="dropdown-item"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      Track Delivery
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
                      to="/login"
                      className="dropdown-item"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="dropdown-item"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </motion.div>
            )}
          </div>

          <Link to="/cart" className="nav-icon cart-icon">
            <ShoppingCartIcon className="icon" />
            {state.items.length > 0 && (
              <span className="cart-count">{state.items.length}</span>
            )}
          </Link>

          <button
            className="nav-icon menu-icon"
            onClick={toggleMobilePopup}
          >
            <Bars3Icon className="icon" />
          </button>
        </div>
      </div>

      {isMobilePopupOpen && (
        <motion.div
          ref={mobilePopupRef}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mobile-popup"
        >
          <div className="mobile-links">
            <NavLink
              to="/"
              className="mobile-link"
              onClick={() => setIsMobilePopupOpen(false)}
              end
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className="mobile-link"
              onClick={() => setIsMobilePopupOpen(false)}
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              className="mobile-link"
              onClick={() => setIsMobilePopupOpen(false)}
            >
              Contact
            </NavLink>
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="mobile-link"
                  onClick={() => setIsMobilePopupOpen(false)}
                >
                  My Profile
                </Link>
                <Link
                  to="/tracking"
                  className="mobile-link"
                  onClick={() => setIsMobilePopupOpen(false)}
                >
                  Track Delivery
                </Link>
                <button
                  className="mobile-link"
                  onClick={() => {
                    handleSignOut();
                    setIsMobilePopupOpen(false);
                  }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="mobile-link"
                  onClick={() => setIsMobilePopupOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="mobile-link"
                  onClick={() => setIsMobilePopupOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}

export default Navbar;
