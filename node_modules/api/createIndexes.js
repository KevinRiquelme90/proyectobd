const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });

const connectDB = require('./src/database/mongo');
const Product = require('./src/models/Product');
const Sale = require('./src/models/Sale');
const SaleDetail = require('./src/models/SaleDetail');

const createIndexes = async () => {
  await connectDB();

  await Product.syncIndexes();
  await Sale.syncIndexes();
  await SaleDetail.syncIndexes();

  console.log('Índices creados en Product, Sale y SaleDetail.');
  await mongoose.disconnect();
};

createIndexes().catch((error) => {
  console.error('Error creando índices:', error);
  process.exit(1);
});
