const mongoose = require("mongoose");

const movementSchema = new mongoose.Schema(
  {
    producto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    },

    tipo: {
      type: String,
      enum: [
        "ENTRADA",
        "SALIDA",
        "VENTA",
        "COMPRA",
        "AJUSTE"
      ]
    },

    cantidad: Number,

    motivo: String,

    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "InventoryMovement",
  movementSchema
);