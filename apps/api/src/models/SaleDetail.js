const mongoose = require("mongoose");

const saleDetailSchema = new mongoose.Schema(
  {
    venta: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sale"
    },

    producto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    },

    cantidad: Number,

    precio: Number,

    subtotal: Number
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "SaleDetail",
  saleDetailSchema
);