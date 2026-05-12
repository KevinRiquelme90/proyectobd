const mongoose = require("mongoose");

const providerSchema = new mongoose.Schema(
  {
    nombre_empresa: {
      type: String,
      required: true
    },

    contacto: String,

    telefono: String,

    email: String,

    direccion: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Provider",
  providerSchema
);