const mongoose = require("mongoose");

const cashRegisterSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    apertura: {
      type: Number,
      default: 0,
      min: 0
    },
    ingresos: {
      type: Number,
      default: 0,
      min: 0
    },
    egresos: {
      type: Number,
      default: 0,
      min: 0
    },
    saldo_final: {
      type: Number,
      default: 0,
      min: 0
    },
    estado: {
      type: String,
      enum: ["abierta", "cerrada"],
      default: "abierta"
    },
    nota: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("CashRegister", cashRegisterSchema);
