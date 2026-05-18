const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true
    },
    tipo: {
      type: String,
      required: true
    },
    datos: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    creadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Report", reportSchema);
