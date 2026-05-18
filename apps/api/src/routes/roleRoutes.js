const express = require("express");
const { listRoles } = require("../controllers/roleController");
const protect = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", protect, listRoles);

module.exports = router;
