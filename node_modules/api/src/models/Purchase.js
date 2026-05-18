const mongoose = require("mongoose");

const purchaseItemSchema = new mongoose.Schema(
  {
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
    precio_unitario: {
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
  { _id: false }
);

const purchaseSchema = new mongoose.Schema(
  {
    proveedor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Provider",
      required: true
    },
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    items: [purchaseItemSchema],
    total: {
      type: Number,
      required: true,
      min: 0
    },
    estado: {
      type: String,
      enum: ["recibida", "pendiente", "anulada"],
      default: "recibida"
    },
    nota: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Purchase", purchaseSchema);
