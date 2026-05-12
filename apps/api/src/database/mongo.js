const mongoose = require("mongoose");

const connectDB = async () => {
  try {

    const conn = await mongoose.connect(
      process.env.MONGO_URI,
      {
        family: 4
      }
    );

    console.log(
      `MongoDB conectado: ${conn.connection.host}`
    );

  } catch (error) {

    console.error(error);

    process.exit(1);
  }
};

module.exports = connectDB;