/**
 * Main App Component
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuthStore } from './context/authStore';
import { useCartStore } from './context/cartStore';
import Header from './components/Header';
import Chatbot from './components/Chatbot';
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import './styles/globals.css';

function App() {
  const { fetchCart } = useCartStore();
  const [chatbotOpen, setChatbotOpen] = useState(false);

  useEffect(() => {
    // Initialize cart on mount
    fetchCart();
  }, [fetchCart]);

  return (
    <Router>
      <div className="app">
        <Header />
        
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/checkout" element={<Checkout />} />
            {/* Add more routes here */}
          </Routes>
        </main>

        {/* Chatbot Widget */}
        <button
          className="chatbot-toggle"
          onClick={() => setChatbotOpen(!chatbotOpen)}
        >
          💬
        </button>
        <Chatbot isOpen={chatbotOpen} onClose={() => setChatbotOpen(false)} />

        <footer className="app-footer">
          <div className="container">
            <p>&copy; 2024 EcomStore. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
