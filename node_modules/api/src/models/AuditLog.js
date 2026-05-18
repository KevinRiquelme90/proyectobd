const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    accion: {
      type: String,
      required: true
    },
    entidad: {
      type: String,
      required: true
    },
    detalle: {
      type: String,
      default: ""
    },
    meta: {
      type: Object,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("AuditLog", auditLogSchema);
