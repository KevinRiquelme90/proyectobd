const mongoose = require("mongoose");

const saleDetailSchema = new mongoose.Schema(
  {
    venta: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sale",
      required: true
    },

    producto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },

    cantidad: {
      type: Number,
      required: true,
      min: 1
    },

    precio: {
      type: Number,
      required: true,
      min: 0
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "SaleDetail",
  saleDetailSchema
);