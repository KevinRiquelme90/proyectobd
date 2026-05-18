const mongoose = require("mongoose");

const configurationSchema = new mongoose.Schema(
  {
    clave: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    valor: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    descripcion: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Configuration", configurationSchema);
