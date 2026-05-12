require("dotenv").config();

const app = require("./app");
const connectDB = require("./database/mongo");

connectDB();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});