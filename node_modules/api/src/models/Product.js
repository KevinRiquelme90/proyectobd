const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    codigo_barra: {
      type: String,
      unique: true
    },

    nombre: {
      type: String,
      required: true,
      trim: true
    },

    descripcion: String,

    categoria: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },

    proveedor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Provider"
    },

    precio_compra: {
      type: Number,
      required: true
    },

    precio_venta: {
      type: Number,
      required: true
    },

    stock: {
      type: Number,
      default: 0
    },

    stock_minimo: {
      type: Number,
      default: 5
    },

    unidad_medida: {
      type: String,
      enum: [
        "kg",
        "g",
        "unidad",
        "caja",
        "litro"
      ]
    },

    pesa: {
      type: Boolean,
      default: false
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

productSchema.index({ stock: 1 });
productSchema.index({ categoria: 1 });
productSchema.index({ proveedor: 1 });

module.exports = mongoose.model(
  "Product",
  productSchema
);