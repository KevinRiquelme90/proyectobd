const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true
    },

    rut: String,

    telefono: String,

    email: String,

    direccion: String,

    puntos: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Client",
  clientSchema
);