# ProyectoBD

Descripción
- Sistema de gestión de ventas, compras e inventario con backend Node.js (Express + Mongoose) y frontend React (Vite + Tailwind).

Estructura principal
- `apps/api`: Backend (rutas, controladores, servicios, modelos).
- `apps/web`: Frontend (React + Vite).

Requisitos
- Node.js (16+ recomendado).
- MongoDB en modo replica set para soportar transacciones (requisito importante para ventas/compras).

Arrancar localmente
1. Instalar dependencias:
```bash
cd apps/api
npm install
cd ../web
npm install
```
2. Levantar backend (en otra terminal):
```bash
cd apps/api
npm run dev
```
3. Levantar frontend:
```bash
cd apps/web
npm run dev
```
4. Compilar frontend para producción:
```bash
cd apps/web
npm run build
```

Puntos importantes
- Stock en tiempo real: las páginas de Ventas y Compras muestran el stock actual por producto y validan para evitar vender más de lo disponible.
- Transacciones: las operaciones críticas (venta/compra) usan transacciones MongoDB para mantener consistencia y crear movimientos de inventario.
- Auditoría: se generan registros (`AuditLog`) para operaciones críticas.

Recomendaciones
- Asegurar que MongoDB corra como replica set durante pruebas y producción.
- Añadir índices en campos frecuentes de consulta (por ejemplo `createdAt`, `producto`, `stock`).
- Implementar pruebas de integración para validar rollback en fallos de transacción.




