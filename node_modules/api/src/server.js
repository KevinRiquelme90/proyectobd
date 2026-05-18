require("dotenv").config();

const app = require("./app");
const connectDB = require("./database/mongo");

connectDB();

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log(`Documentación: http://localhost:${PORT}/api/docs`);
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Error: el puerto ${PORT} ya está en uso. Cierra la otra instancia o cambia PORT en .env.`);
  } else {
    console.error(error);
  }
  process.exit(1);
});