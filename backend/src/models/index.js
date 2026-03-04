/**
 * Models index - Exports all models for easy importing
 */

const User = require('./User');
const Product = require('./Product');
const Order = require('./Order');
const Cart = require('./Cart');
const Review = require('./Review');

// Define associations
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(Cart, { foreignKey: 'userId' });
Cart.belongsTo(User, { foreignKey: 'userId' });

Product.hasMany(Review, { foreignKey: 'productId' });
Review.belongsTo(Product, { foreignKey: 'productId' });

User.hasMany(Review, { foreignKey: 'userId' });
Review.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  User,
  Product,
  Order,
  Cart,
  Review
};
