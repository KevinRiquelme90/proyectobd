const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true
    },
    direccion: {
      type: String,
      required: true
    },
    ciudad: String,
    telefono: String,
    activo: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Branch", branchSchema);
