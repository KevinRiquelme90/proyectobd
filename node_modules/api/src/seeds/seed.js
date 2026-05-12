require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Role = require("../models/Role");
const Category = require("../models/Category");
const User = require("../models/User");
const Product = require("../models/Product");

const connectDB = async () => {

  try {

    await mongoose.connect(
      process.env.MONGO_URI,
      {
        family: 4
      }
    );

    console.log("MongoDB conectado");

  } catch (error) {

    console.error("Error MongoDB");

    console.error(error);

    process.exit(1);
  }
};

const seed = async () => {

  try {

    await connectDB();

    console.log("Limpiando colecciones...");

    await Role.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();
    await Product.deleteMany();

    console.log("Insertando roles...");

    await Role.insertMany([
      {
        nombre: "ADMIN",
        permisos: ["ALL"]
      },

      {
        nombre: "CAJERO",
        permisos: ["VENTAS"]
      }
    ]);

    console.log("Insertando categorías...");

    await Category.insertMany([
      {
        nombre: "Verduras"
      },

      {
        nombre: "Frutas"
      },

      {
        nombre: "Bebidas"
      },

      {
        nombre: "Lácteos"
      },

      {
        nombre: "Congelados"
      }
    ]);

    const adminRole = await Role.findOne({ nombre: "ADMIN" });
    const hashedPassword = await bcrypt.hash("Admin123!", 10);
    const defaultUser = {
      nombre: "Administrador",
      email: "admin@erp.com",
      password: hashedPassword,
      role: adminRole ? adminRole._id : null
    };

    const existingUser = await User.findOne({ email: defaultUser.email });

    if (!existingUser) {
      await User.create(defaultUser);
      console.log("Usuario administrador creado: admin@erp.com / Admin123!");
    } else {
      console.log("Usuario administrador ya existe:", existingUser.email);
    }

    console.log("Insertando productos de ejemplo...");

    const categories = await Category.find();
    const categoryMap = categories.reduce((map, category) => {
      map[category.nombre] = category._id;
      return map;
    }, {});

    await Product.insertMany([
      {
        codigo_barra: "0001",
        nombre: "Tomate rojo",
        descripcion: "Tomate fresco por kilo",
        categoria: categoryMap["Verduras"],
        precio_compra: 80,
        precio_venta: 130,
        stock: 120,
        unidad_medida: "kg"
      },
      {
        codigo_barra: "0002",
        nombre: "Manzana roja",
        descripcion: "Manzana fresca por kilo",
        categoria: categoryMap["Frutas"],
        precio_compra: 90,
        precio_venta: 150,
        stock: 80,
        unidad_medida: "kg"
      },
      {
        codigo_barra: "0003",
        nombre: "Leche entera",
        descripcion: "Leche pasteurizada 1L",
        categoria: categoryMap["Lácteos"],
        precio_compra: 70,
        precio_venta: 110,
        stock: 60,
        unidad_medida: "litro"
      },
      {
        codigo_barra: "0004",
        nombre: "Coca Cola",
        descripcion: "Gaseosa 1.5L",
        categoria: categoryMap["Bebidas"],
        precio_compra: 120,
        precio_venta: 190,
        stock: 40,
        unidad_medida: "unidad"
      },
      {
        codigo_barra: "0005",
        nombre: "Arveja congelada",
        descripcion: "Arveja verde congelada 500g",
        categoria: categoryMap["Congelados"],
        precio_compra: 140,
        precio_venta: 220,
        stock: 35,
        unidad_medida: "unidad"
      }
    ]);

    console.log("Seed ejecutado correctamente");

    process.exit();

  } catch (error) {

    console.error("Error ejecutando seed");

    console.error(error);

    process.exit(1);
  }
};

seed();