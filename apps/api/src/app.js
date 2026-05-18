const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const xssClean = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const hpp = require("hpp");
const swaggerUi = require("swagger-ui-express");

const swaggerSpec = require("./docs/swagger");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const clientRoutes = require("./routes/clientRoutes");
const providerRoutes = require("./routes/providerRoutes");
const saleRoutes = require("./routes/saleRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const cashRegisterRoutes = require("./routes/cashRegisterRoutes");
const reportRoutes = require("./routes/reportRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const userRoutes = require("./routes/userRoutes");
const roleRoutes = require("./routes/roleRoutes");

const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(helmet());
app.use(morgan("tiny"));
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: false, limit: "15mb" }));
app.use(cookieParser());
app.use(xssClean());
app.use(mongoSanitize());
app.use(hpp());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false
});

app.use(limiter);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/cash-register", cashRegisterRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/roles", roleRoutes);

app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

app.get("/", (req, res) => {
  res.json({ message: "ERP API activa" });
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;