/**
 * Home Page Component
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import './Home.css';

export const Home = () => {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingProducts = async () => {
      setIsLoading(true);
      try {
        const response = await productAPI.getTrending({ limit: 8 });
        setTrendingProducts(response.data.data);
      } catch (error) {
        console.error('Failed to fetch trending products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendingProducts();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to EcomStore</h1>
          <p>Discover amazing products with AI-powered recommendations</p>
          <Link to="/products" className="btn btn-primary btn-lg">
            Shop Now
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2>Why Choose Us?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3>AI Recommendations</h3>
              <p>Get personalized product recommendations based on your preferences</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3>24/7 AI Chat Support</h3>
              <p>Chat with our AI assistant anytime for instant support</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3>Fraud Detection</h3>
              <p>Your transactions are protected with advanced fraud detection</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>Fast Shipping</h3>
              <p>Quick and reliable shipping to your doorstep</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Products Section */}
      <section className="trending-section">
        <div className="container">
          <h2>Trending Products</h2>
          {isLoading ? (
            <div className="loading">Loading products...</div>
          ) : (
            <div className="products-grid">
              {trendingProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          <div className="view-all">
            <Link to="/products" className="btn btn-outline">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta">
        <div className="cta-content">
          <h2>Ready to Shop?</h2>
          <p>Explore our amazing collection of products today</p>
          <Link to="/products" className="btn btn-secondary btn-lg">
            Start Shopping
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
