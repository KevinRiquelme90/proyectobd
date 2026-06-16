const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoOptions = {
      family: 4,
      dbName: process.env.MONGO_DB || "verduleria"
    };

    if (!process.env.MONGO_URI.includes("retryWrites=")) {
      mongoOptions.retryWrites = false;
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, mongoOptions);

    console.log(`MongoDB conectado: ${conn.connection.host}`);

  } catch (error) {

    console.error(error);

    process.exit(1);
  }
};

module.exports = connectDB;