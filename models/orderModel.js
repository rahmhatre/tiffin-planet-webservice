const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user_id: {
      required: true,
      type: String,
    },
    delivery_date: {
      required: true,
      type: String,
    },
    cancelled: {
      required: true,
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
