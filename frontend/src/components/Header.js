/**
 * Header Component - Navigation bar
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiHome, FiLogOut, FiUser, FiSearch, FiMenu, FiX } from 'react-icons/fi';
import { useAuthStore } from '../context/authStore';
import { useCartStore } from '../context/cartStore';
import './Header.css';

export const Header = () => {
  const { user, logout } = useAuthStore();
  const { getCartItemCount } = useCartStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="header-logo">
          <FiHome size={24} />
          <span>EcomStore</span>
        </Link>

        {/* Search Bar */}
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">
            <FiSearch size={20} />
          </button>
        </form>

        {/* Desktop Navigation */}
        <nav className="header-nav">
          <Link to="/products">Products</Link>
          <Link to="/ai/recommendations">Recommendations</Link>
          <Link to="/ai/chat">Support Chat</Link>

          {user ? (
            <>
              <div className="nav-user">
                <Link to="/profile">
                  <FiUser size={20} />
                </Link>
              </div>
              <Link to="/cart" className="nav-cart">
                <FiShoppingCart size={20} />
                {getCartItemCount() > 0 && (
                  <span className="cart-badge">{getCartItemCount()}</span>
                )}
              </Link>
              <button onClick={handleLogout} className="btn-logout">
                <FiLogOut size={20} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-primary">
                Login
              </Link>
              <Link to="/register" className="btn btn-secondary">
                Sign Up
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="mobile-nav">
          <Link to="/products" onClick={() => setMobileMenuOpen(false)}>
            Products
          </Link>
          <Link to="/ai/recommendations" onClick={() => setMobileMenuOpen(false)}>
            Recommendations
          </Link>
          <Link to="/ai/chat" onClick={() => setMobileMenuOpen(false)}>
            Support Chat
          </Link>

          {user ? (
            <>
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                Profile
              </Link>
              <Link to="/orders" onClick={() => setMobileMenuOpen(false)}>
                Orders
              </Link>
              <Link to="/cart" onClick={() => setMobileMenuOpen(false)}>
                Cart ({getCartItemCount()})
              </Link>
              <button onClick={handleLogout} className="btn-mobile-logout">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                Sign Up
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
};

export default Header;
