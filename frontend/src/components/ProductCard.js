/**
 * Product Card Component
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiStar, FiHeart } from 'react-icons/fi';
import { useCartStore } from '../context/authStore';
import './ProductCard.css';

export const ProductCard = ({ product }) => {
  const { addToCart } = useCartStore();
  const [isWishlisted, setIsWishlisted] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      await addToCart(product.id, 1);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const discountedPrice = product.price - (product.price * product.discount / 100);

  return (
    <div className="product-card">
      <div className="product-image-container">
        <Link to={`/products/${product.id}`}>
          <img
            src={product.images?.[0] || 'https://via.placeholder.com/250x250'}
            alt={product.name}
            className="product-image"
          />
        </Link>
        {product.discount > 0 && (
          <span className="discount-badge">-{product.discount}%</span>
        )}
        <button
          className={`wishlist-btn ${isWishlisted ? 'wishlisted' : ''}`}
          onClick={() => setIsWishlisted(!isWishlisted)}
        >
          <FiHeart size={18} />
        </button>
      </div>

      <div className="product-info">
        <h3 className="product-name">
          <Link to={`/products/${product.id}`}>{product.name}</Link>
        </h3>

        <p className="product-category">{product.category}</p>

        <div className="product-rating">
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <FiStar
                key={i}
                size={14}
                fill={i < Math.round(product.rating) ? '#fbbf24' : 'none'}
                color={i < Math.round(product.rating) ? '#fbbf24' : '#d1d5db'}
              />
            ))}
          </div>
          <span className="review-count">({product.reviews})</span>
        </div>

        <div className="product-price">
          <span className="current-price">${discountedPrice.toFixed(2)}</span>
          {product.discount > 0 && (
            <span className="original-price">${product.price.toFixed(2)}</span>
          )}
        </div>

        <button
          className="btn btn-primary add-to-cart-btn"
          onClick={handleAddToCart}
          disabled={isLoading || product.stock === 0}
        >
          <FiShoppingCart size={16} />
          {isLoading ? 'Adding...' : 'Add to Cart'}
        </button>

        {product.stock === 0 && (
          <p className="out-of-stock">Out of Stock</p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
