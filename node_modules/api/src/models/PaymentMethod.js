const mongoose = require("mongoose");

const paymentMethodSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    tipo: {
      type: String,
      enum: ["efectivo", "debito", "credito", "transferencia"],
      default: "efectivo"
    },
    activo: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("PaymentMethod", paymentMethodSchema);
