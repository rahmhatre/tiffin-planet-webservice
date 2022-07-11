const AuthMode = Object.freeze({
  GOOGLE: 'GOOGLE',
  CLASSIC: 'CLASSIC',
});

const UserType = Object.freeze({
  ADMIN: 'ADMIN',
  USER: 'USER',
  DEVELOPER: 'DEVELOPER',
});

const UserStatus = Object.freeze({
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
});

const OrderStatus = Object.freeze({
  PROCESSING: 'PROCESSING',
  DELIVERED: 'DELIVERED',
  ACTIVE: 'ACTIVE',
  CANCELLED: 'CANCELLED',
  TRANSIT: 'TRANSIT',
  PAYMENTDUE: 'PAYMENTDUE',
  PROBLEM: 'PROBLEM',
});

module.exports = { UserStatus, UserType, AuthMode, OrderStatus };
