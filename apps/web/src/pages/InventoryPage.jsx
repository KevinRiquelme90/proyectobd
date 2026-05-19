import { useEffect, useState } from "react";
import api from "../api/axios";
import { formatCurrency } from "../utils/formatCurrency";

export default function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInventory = async () => {
      try {
        const response = await api.get("/inventory");
        const data = response.data;
        
        // El servidor devuelve { inventory: [...], total, page, pages }
        const inventoryList = data.inventory || data.products || (Array.isArray(data) ? data : []);

        setInventory(inventoryList);
      } catch (error) {
        console.error("Error cargando inventario:", error.response?.data || error.message);
        setInventory([]);
      } finally {
        setLoading(false);
      }
    };
    loadInventory();
  }, []);

  const safeInventory = Array.isArray(inventory) ? inventory : [];
  const totalStock = safeInventory.reduce((sum, item) => sum + (item.stock || 0), 0);
  const productsLowStock = safeInventory.filter((item) => item.stock <= (item.stock_minimo || 5)).length;

  return (
    <section className="space-y-8">
      <div className="rounded-[32px] border border-slate-800 bg-slate-950/95 p-6">
        <p className="text-sm uppercase tracking-[0.24em] text-emerald-400">Inventario</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Control de stock</h1>
        <p className="mt-2 text-slate-400">Monitorea los niveles de inventario y los productos cercanos a agotarse.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-[32px] border border-slate-800 bg-slate-950/95 p-6">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Total de unidades</p>
          <p className="mt-4 text-4xl font-semibold text-white">{totalStock}</p>
        </div>
        <div className="rounded-[32px] border border-slate-800 bg-slate-950/95 p-6">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Productos</p>
          <p className="mt-4 text-4xl font-semibold text-white">{inventory.length}</p>
        </div>
        <div className="rounded-[32px] border border-slate-800 bg-slate-950/95 p-6">
          <p className="text-sm uppercase tracking-[0.24em] text-rose-400">Bajo stock</p>
          <p className="mt-4 text-4xl font-semibold text-white">{productsLowStock}</p>
        </div>
      </div>

      <div className="rounded-[32px] border border-slate-800 bg-slate-950/95 p-6">
        <h2 className="text-xl font-semibold text-white">Listado de inventario</h2>
        {loading ? (
          <p className="mt-6 text-slate-400">Cargando inventario...</p>
        ) : inventory.length === 0 ? (
          <p className="mt-6 text-slate-400">No hay registros de inventario disponibles.</p>
        ) : (
          <div className="mt-6 overflow-hidden rounded-3xl border border-slate-800 text-sm">
            <table className="w-full border-separate border-spacing-0 text-left">
              <thead className="bg-slate-900 text-slate-400">
                <tr>
                  <th className="px-5 py-4">Producto</th>
                  <th className="px-5 py-4">Categoría</th>
                  <th className="px-5 py-4">Stock</th>
                  <th className="px-5 py-4">Valor promedio</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => (
                  <tr key={item._id} className="border-t border-slate-800 hover:bg-slate-900/80">
                    <td className="px-5 py-4 text-slate-200">{item.nombre || "—"}</td>
                    <td className="px-5 py-4 text-slate-400">{item.categoria?.nombre || "—"}</td>
                    <td className={`px-5 py-4 font-semibold ${item.stock <= (item.stock_minimo || 5) ? "text-rose-400" : "text-emerald-300"}`}>{item.stock}</td>
                    <td className="px-5 py-4 text-slate-400">{formatCurrency(item.precio_compra || item.valor_promedio || 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
