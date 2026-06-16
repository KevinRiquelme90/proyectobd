const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema(
  {
    cliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client"
    },

    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    total: {
      type: Number,
      required: true
    },

    metodo_pago: {
      type: String,
      enum: [
        "efectivo",
        "debito",
        "credito",
        "transferencia"
      ]
    },

    estado: {
      type: String,
      enum: [
        "pagada",
        "anulada"
      ],
      default: "pagada"
    }
  },
  {
    timestamps: true
  }
);

saleSchema.index({ createdAt: -1 });
saleSchema.index({ usuario: 1 });

module.exports = mongoose.model(
  "Sale",
  saleSchema
);