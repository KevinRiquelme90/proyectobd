require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Role = require("../models/Role");
const Category = require("../models/Category");
const User = require("../models/User");
const Product = require("../models/Product");
const Provider = require("../models/Provider");
const Client = require("../models/Client");
const Branch = require("../models/Branch");
const PaymentMethod = require("../models/PaymentMethod");
const Configuration = require("../models/Configuration");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      family: 4,
      dbName: process.env.MONGO_DB || "verduleria"
    });
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
    await Promise.all([
      Role.deleteMany(),
      Category.deleteMany(),
      User.deleteMany(),
      Product.deleteMany(),
      Provider.deleteMany(),
      Client.deleteMany(),
      Branch.deleteMany(),
      PaymentMethod.deleteMany(),
      Configuration.deleteMany()
    ]);

    console.log("Insertando roles...");
    const roles = await Role.insertMany([
      { nombre: "ADMIN", permisos: ["ALL"] },
      { nombre: "CAJERO", permisos: ["VENTAS", "CLIENTES"] }
    ]);

    console.log("Insertando categorías...");
    const categories = await Category.insertMany([
      { nombre: "Verduras", descripcion: "Productos frescos de huerta" },
      { nombre: "Frutas", descripcion: "Frutas frescas y jugosas" },
      { nombre: "Bebidas", descripcion: "Bebidas frías y calientes" },
      { nombre: "Lácteos", descripcion: "Productos lácteos refrigerados" },
      { nombre: "Congelados", descripcion: "Productos congelados listos para vender" }
    ]);

    const categoryMap = categories.reduce((map, category) => {
      map[category.nombre] = category._id;
      return map;
    }, {});

    console.log("Insertando usuarios...");
    const adminRole = roles.find((role) => role.nombre === "ADMIN");
    const adminUser = new User({
      nombre: "Administrador",
      email: "admin@erp.com",
      password: "Admin123!",
      role: adminRole._id
    });
    await adminUser.save();

    const cashierUser = new User({
      nombre: "Cajero",
      email: "cajero@erp.com",
      password: "Cajero123!",
      role: roles.find((role) => role.nombre === "CAJERO")._id
    });
    await cashierUser.save();

    console.log("Insertando proveedores demo...");
    const providers = await Provider.insertMany([
      {
        nombre_empresa: "Distribuidora El Campo",
        contacto: "Ana Pérez",
        telefono: "+5491123456789",
        email: "ventas@elcampo.com",
        direccion: "Av. Siempre Viva 123"
      },
      {
        nombre_empresa: "Frutas del Valle",
        contacto: "Luis Gómez",
        telefono: "+5491134567890",
        email: "contacto@frutasdelvalle.com",
        direccion: "Calle 45 890"
      }
    ]);

    console.log("Insertando clientes demo...");
    await Client.insertMany([
      { nombre: "Mercado Central", telefono: "+5491166677788", email: "mercadocentral@example.com", direccion: "Paseo de la Plaza 50" },
      { nombre: "Restaurant La Huerta", telefono: "+5491177788990", email: "info@lahuerta.com", direccion: "Calle Falsa 789" }
    ]);

    console.log("Insertando sucursales demo...");
    await Branch.insertMany([
      { nombre: "Sucursal Centro", direccion: "Av. Libertador 500", ciudad: "Buenos Aires", telefono: "+541112223334" },
      { nombre: "Sucursal Norte", direccion: "Calle 9 de Julio 1250", ciudad: "Buenos Aires", telefono: "+541133445566" }
    ]);

    console.log("Insertando métodos de pago demo...");
    await PaymentMethod.insertMany([
      { nombre: "Efectivo", tipo: "efectivo" },
      { nombre: "Tarjeta Débito", tipo: "debito" },
      { nombre: "Tarjeta Crédito", tipo: "credito" },
      { nombre: "Transferencia", tipo: "transferencia" }
    ]);

    console.log("Insertando configuración inicial...");
    await Configuration.insertMany([
      { clave: "nombre_negocio", valor: "Verdulería POS" },
      { clave: "moneda", valor: "ARS" },
      { clave: "zona_horaria", valor: "America/Argentina/Buenos_Aires" }
    ]);

    console.log("Insertando productos de ejemplo...");
    await Product.insertMany([
      {
        codigo_barra: "0001",
        nombre: "Tomate rojo",
        descripcion: "Tomate fresco por kilo",
        categoria: categoryMap["Verduras"],
        precio_compra: 80,
        precio_venta: 130,
        stock: 120,
        stock_minimo: 20,
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
        stock_minimo: 20,
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
        stock_minimo: 15,
        unidad_medida: "litro"
      },
      {
        codigo_barra: "0004",
        nombre: "Coca Cola 1.5L",
        descripcion: "Gaseosa refrescante",
        categoria: categoryMap["Bebidas"],
        precio_compra: 120,
        precio_venta: 190,
        stock: 40,
        stock_minimo: 10,
        unidad_medida: "unidad"
      },
      {
        codigo_barra: "0005",
        nombre: "Arveja congelada 500g",
        descripcion: "Arveja verde de alta calidad",
        categoria: categoryMap["Congelados"],
        precio_compra: 140,
        precio_venta: 220,
        stock: 35,
        stock_minimo: 10,
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