# Backend API - ProyectoBD

Notas importantes para `apps/api`.

## Transacciones y MongoDB
- Las operaciones de venta y compra usan transacciones de MongoDB.
- MongoDB debe estar en modo `replica set` para que las transacciones funcionen.
- Para desarrollo local, si usas una instancia de Mongo externa, asegúrate de habilitar `retryWrites=false` en la URI si el servidor no admite retryable writes.

## Índices sugeridos
- `Sale.createdAt` para consultas de reportes y dashboard por fecha.
- `Sale.usuario` para filtrar ventas por vendedor/usuario.
- `SaleDetail.producto` para reportes de ventas por producto.
- `Product.stock` para búsquedas y alertas de bajo stock.

## Scripts útiles
- `npm run dev` — arranca el servidor de desarrollo.
- `npm run seed` — ejecuta la semilla inicial.
- `npm test` — ejecuta las pruebas de integración.
- `node createIndexes.js` — crea los índices definidos en los modelos.

## Pruebas de integración añadidas
- `test/integration/salePurchase.test.js`
- Valida:
  - creación de compra y aumento de stock,
  - creación de venta y reducción de stock,
  - prevención de ventas con stock insuficiente.

## Cómo ejecutar en pruebas
1. Ir a `apps/api`.
2. Ejecutar:
```bash
npm install
npm test
```

Si necesitas que te explique cómo levantar MongoDB en replica set local, lo agrego con gusto aquí también.
