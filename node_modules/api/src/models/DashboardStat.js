const mongoose = require("mongoose");

const dashboardStatSchema = new mongoose.Schema(
  {
    fecha: {
      type: Date,
      default: Date.now
    },
    ventasDia: {
      type: Number,
      default: 0
    },
    ventasMes: {
      type: Number,
      default: 0
    },
    productosBajos: {
      type: Number,
      default: 0
    },
    ganancias: {
      type: Number,
      default: 0
    },
    masVendidos: [
      {
        producto: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product"
        },
        ventas: Number
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("DashboardStat", dashboardStatSchema);
