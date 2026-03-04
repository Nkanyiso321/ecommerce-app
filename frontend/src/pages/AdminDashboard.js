/**
 * Admin Dashboard Component
 */

import React, { useState, useEffect } from 'react';
import { FiUsers, FiShoppingBag, FiTrendingUp, FiAlertCircle } from 'react-icons/fi';
import { analyticsAPI } from '../services/api';
import './AdminDashboard.css';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // In production, fetch from actual analytics API endpoints
      // For now, use mock data
      setStats({
        totalRevenue: 45230.50,
        totalOrders: 342,
        totalCustomers: 156,
        fraudRate: 2.3,
        topProducts: [
          { name: 'Wireless Headphones', sales: 124, revenue: 9900 },
          { name: 'USB Cable', sales: 98, revenue: 490 },
          { name: 'Phone Case', sales: 87, revenue: 870 }
        ],
        customerSegments: {
          premium: 23,
          loyal: 45,
          occasional: 65,
          newCustomers: 23
        },
        recentOrders: [
          { id: 'ORD-001', customer: 'John Doe', amount: 150.50, status: 'delivered' },
          { id: 'ORD-002', customer: 'Jane Smith', amount: 275.00, status: 'processing' },
          { id: 'ORD-003', customer: 'Bob Wilson', amount: 89.99, status: 'pending' }
        ],
        fraudDetections: [
          { orderId: 'ORD-100', fraudScore: 0.85, amount: 5000, action: 'blocked' },
          { orderId: 'ORD-101', fraudScore: 0.62, amount: 1200, action: 'flagged' }
        ]
      });
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="admin-loading">Loading dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <button className="btn btn-secondary" onClick={loadDashboardData}>
          Refresh Data
        </button>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon revenue">
            <FiTrendingUp size={24} />
          </div>
          <div className="metric-details">
            <p className="metric-label">Total Revenue</p>
            <p className="metric-value">${stats.totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon orders">
            <FiShoppingBag size={24} />
          </div>
          <div className="metric-details">
            <p className="metric-label">Total Orders</p>
            <p className="metric-value">{stats.totalOrders}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon customers">
            <FiUsers size={24} />
          </div>
          <div className="metric-details">
            <p className="metric-label">Total Customers</p>
            <p className="metric-value">{stats.totalCustomers}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon fraud">
            <FiAlertCircle size={24} />
          </div>
          <div className="metric-details">
            <p className="metric-label">Fraud Rate</p>
            <p className="metric-value">{stats.fraudRate}%</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="dashboard-tabs">
        <button
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Top Products
        </button>
        <button
          className={`tab ${activeTab === 'fraud' ? 'active' : ''}`}
          onClick={() => setActiveTab('fraud')}
        >
          Fraud Detection
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <>
            {/* Customer Segments */}
            <div className="dashboard-section">
              <h2>Customer Segments</h2>
              <div className="segments-grid">
                <div className="segment-card">
                  <h3>Premium</h3>
                  <p className="segment-count">{stats.customerSegments.premium}</p>
                  <p className="segment-desc">High-value customers</p>
                </div>
                <div className="segment-card">
                  <h3>Loyal</h3>
                  <p className="segment-count">{stats.customerSegments.loyal}</p>
                  <p className="segment-desc">Repeat customers</p>
                </div>
                <div className="segment-card">
                  <h3>Occasional</h3>
                  <p className="segment-count">{stats.customerSegments.occasional}</p>
                  <p className="segment-desc">One-time buyers</p>
                </div>
                <div className="segment-card">
                  <h3>New</h3>
                  <p className="segment-count">{stats.customerSegments.newCustomers}</p>
                  <p className="segment-desc">Recent signups</p>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="dashboard-section">
              <h2>Recent Orders</h2>
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map(order => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.customer}</td>
                      <td>${order.amount}</td>
                      <td>
                        <span className={`badge ${order.status}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === 'products' && (
          <div className="dashboard-section">
            <h2>Top Products</h2>
            <table className="products-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Sales</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {stats.topProducts.map((product, idx) => (
                  <tr key={idx}>
                    <td>{product.name}</td>
                    <td>{product.sales}</td>
                    <td>${product.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'fraud' && (
          <div className="dashboard-section">
            <h2>Fraud Detections</h2>
            <table className="fraud-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Fraud Score</th>
                  <th>Amount</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {stats.fraudDetections.map(fraud => (
                  <tr key={fraud.orderId} className={fraud.action}>
                    <td>{fraud.orderId}</td>
                    <td>
                      <div className="score-bar">
                        <div
                          className="score-fill"
                          style={{ width: `${fraud.fraudScore * 100}%` }}
                        />
                        <span>{(fraud.fraudScore * 100).toFixed(0)}%</span>
                      </div>
                    </td>
                    <td>${fraud.amount.toLocaleString()}</td>
                    <td>
                      <span className={`action-badge ${fraud.action}`}>
                        {fraud.action}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
