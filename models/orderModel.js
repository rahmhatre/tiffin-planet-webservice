const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    userId: {
      required: true,
      type: String,
    },
    orderShipmentDate: {
      required: true,
      type: Date,
    },
    status: {
      required: true,
      type: String, // OrderStatus Enum
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('orders', orderSchema);
