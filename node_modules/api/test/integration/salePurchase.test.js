/* Pruebas de integración para compras y ventas
   - Usa mongodb-memory-server en modo replica set para transacciones
   - Omite autenticación cuando NODE_ENV=test (middleware lo maneja)
*/
const { MongoMemoryReplSet } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const request = require('supertest');
const { expect } = require('chai');

let mongoServer;
let app;

const connectDB = require('../../src/database/mongo');
const Product = require('../../src/models/Product');
const Category = require('../../src/models/Category');
const Provider = require('../../src/models/Provider');

describe('Integración: compras y ventas', function() {
  this.timeout(20000);

  before(async () => {
    // El entorno de test activa el bypass de autenticación en authMiddleware.
    process.env.NODE_ENV = 'test';

    // Arrancar mongodb-memory-server como replica set para soportar transacciones.
    mongoServer = await MongoMemoryReplSet.create({ replSet: { count: 1, storageEngine: 'wiredTiger' } });
    process.env.MONGO_URI = mongoServer.getUri();

    // Conectar DB y arrancar app
    await connectDB();
    app = require('../../src/app');
  });

  after(async () => {
    // Limpiar recursos después de los tests.
    await mongoose.disconnect();
    if (mongoServer) await mongoServer.stop();
  });

  it('Compra: debe aumentar el stock del producto', async () => {
    const category = await Category.create({ nombre: 'CatTest' });
    const provider = await Provider.create({ nombre_empresa: 'ProvTest' });

    // Crear un producto inicial con stock 0 para verificar el aumento.
    const product = await Product.create({
      nombre: 'Producto Test',
      categoria: category._id,
      proveedor: provider._id,
      precio_compra: 2,
      precio_venta: 3,
      stock: 0
    });

    const purchaseBody = {
      proveedor: provider._id.toString(),
      items: [
        { producto: product._id.toString(), cantidad: 10, precio_unitario: 2 }
      ],
      total: 20
    };

    // Llamada a la ruta de compras.
    const res = await request(app)
      .post('/api/purchases')
      .send(purchaseBody)
      .expect(201);

    // Verificar que la compra fue registrada y el stock cambió.
    expect(res.body).to.have.property('_id');

    const updated = await Product.findById(product._id);
    expect(updated.stock).to.equal(10);
  });

  it('Venta: debe reducir stock y prevenir oversell', async () => {
    // Obtener el producto creado en el test anterior con stock 10.
    const product = await Product.findOne({ nombre: 'Producto Test' });
    expect(product).to.exist;

    const saleBody = {
      metodo_pago: 'efectivo',
      items: [
        { producto: product._id.toString(), cantidad: 5, precio: 3, subtotal: 15 }
      ],
      total: 15
    };

    // Venta válida: debe restar 5 unidades del stock actual.
    const resSale = await request(app)
      .post('/api/sales')
      .send(saleBody)
      .expect(201);

    expect(resSale.body).to.have.nested.property('sale._id');

    const afterSale = await Product.findById(product._id);
    expect(afterSale.stock).to.equal(5);

    // Intentar vender más del stock disponible y verificar que la API rechazó la operación.
    const oversellBody = {
      metodo_pago: 'efectivo',
      items: [
        { producto: product._id.toString(), cantidad: 10, precio: 3, subtotal: 30 }
      ],
      total: 30
    };

    const resOver = await request(app)
      .post('/api/sales')
      .send(oversellBody)
      .expect(500);

    expect(resOver.body).to.have.property('message');
    expect(resOver.body.message).to.match(/Stock insuficiente/i);
  });
});
