import { useEffect, useState } from "react";
import api from "../api/axios";
import { formatCurrency } from "../utils/formatCurrency";
import { useAuth } from "../context/AuthContext";
import EditProductModal from "../components/EditProductModal";

export default function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const { user } = useAuth();
  const isAdmin = user?.role?.nombre === "ADMIN" || user?.role === "ADMIN";
  const [editingProduct, setEditingProduct] = useState(null);
  const [showMermaModal, setShowMermaModal] = useState(false);
  const [mermaData, setMermaData] = useState({
    producto: "",
    cantidad: 1,
    motivo: "",
    fecha: new Date().toISOString().slice(0, 10)
  });
  const [mermaMessage, setMermaMessage] = useState("");

  const loadInventory = async (search = "") => {
    try {
      setLoading(true);
      const response = await api.get("/inventory", { params: { search } });
      const data = response.data;
      const inventoryList = data.inventory || data.products || (Array.isArray(data) ? data : []);
      setInventory(inventoryList);
    } catch (error) {
      console.error("Error cargando inventario:", error.response?.data || error.message);
      setInventory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => loadInventory(query), 250);
    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    // carga inicial
    loadInventory("");
  }, []);

  const safeInventory = Array.isArray(inventory) ? inventory : [];
  const totalStock = safeInventory.reduce((sum, item) => sum + (item.stock || 0), 0);
  const productsLowStock = safeInventory.filter((item) => item.stock <= (item.stock_minimo || 5)).length;

  const handleEditClick = (product) => setEditingProduct(product);

  const handleDelete = async (id) => {
    try {
      if (!confirm("¿Eliminar este producto? Esta acción no lo borrará definitivamente.")) return;
      await api.delete(`/products/${id}`);
      await loadInventory(query);
    } catch (error) {
      console.error("Error eliminando producto:", error.response?.data || error.message);
      alert(error.response?.data?.message || "No se pudo eliminar el producto.");
    }
  };

  const handleSave = async (updated) => {
    try {
      await api.put(`/products/${updated._id}`, updated);
      setEditingProduct(null);
      await loadInventory(query);
    } catch (error) {
      console.error("Error actualizando producto:", error.response?.data || error.message);
      alert(error.response?.data?.message || "No se pudo actualizar el producto.");
    }
  };

  return (
    <section className="space-y-8">
      <div className="rounded-4xl border border-slate-800 bg-slate-950/95 p-6">
        <p className="text-sm uppercase tracking-[0.24em] text-emerald-400">Inventario</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Control de stock</h1>
        <p className="mt-2 text-slate-400">Monitorea los niveles de inventario y los productos cercanos a agotarse.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-4xl border border-slate-800 bg-slate-950/95 p-6">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Total de unidades</p>
          <p className="mt-4 text-4xl font-semibold text-white">{totalStock}</p>
        </div>
        <div className="rounded-4xl border border-slate-800 bg-slate-950/95 p-6">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Productos</p>
          <p className="mt-4 text-4xl font-semibold text-white">{inventory.length}</p>
        </div>
        <div className="rounded-4xl border border-slate-800 bg-slate-950/95 p-6">
          <p className="text-sm uppercase tracking-[0.24em] text-rose-400">Bajo stock</p>
          <p className="mt-4 text-4xl font-semibold text-white">{productsLowStock}</p>
        </div>
      </div>

      <div className="rounded-4xl border border-slate-800 bg-slate-950/95 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Listado de inventario</h2>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setMermaMessage("");
                setMermaData({
                  producto: "",
                  cantidad: 1,
                  motivo: "",
                  fecha: new Date().toISOString().slice(0, 10)
                });
                setShowMermaModal(true);
              }}
              className="rounded-3xl bg-emerald-400 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
            >
              Añadir Mermas
            </button>
            <input
              placeholder="Buscar producto..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-72 rounded-3xl border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-white outline-none focus:border-emerald-400"
            />
          </div>
        </div>

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
                  <th className="px-5 py-4">Mermas</th>
                  <th className="px-5 py-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => (
                  <tr key={item._id} className="border-t border-slate-800 hover:bg-slate-900/80">
                    <td className="px-5 py-4 text-slate-200">{item.nombre || "—"}</td>
                    <td className="px-5 py-4 text-slate-400">{item.categoria?.nombre || "—"}</td>
                    <td className={`px-5 py-4 font-semibold ${item.stock <= (item.stock_minimo || 5) ? "text-rose-400" : "text-emerald-300"}`}>{item.stock}</td>
                    <td className="px-5 py-4 text-slate-400">{formatCurrency(item.precio_compra || item.valor_promedio || 0)}</td>
                  <td className="px-5 py-4 font-semibold text-slate-400">{item.mermas || 0}</td>
                    <td className="px-5 py-4">
                      {isAdmin ? (
                        <div className="flex gap-2">
                          <button onClick={() => handleEditClick(item)} className="rounded-full bg-emerald-400 px-3 py-1 text-xs font-semibold text-slate-950 hover:bg-emerald-300">Editar</button>
                          <button onClick={() => handleDelete(item._id)} className="rounded-full bg-rose-500 px-3 py-1 text-xs font-semibold text-white hover:bg-rose-400">Eliminar</button>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showMermaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
          <div className="w-full max-w-2xl rounded-[32px] border border-slate-800 bg-slate-950/95 p-6 shadow-2xl shadow-slate-950/40">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">Registrar merma</h2>
                <p className="mt-2 text-sm text-slate-400">Descuenta stock y registra la pérdida en inventario.</p>
              </div>
              <button onClick={() => setShowMermaModal(false)} className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800">
                Cerrar
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-medium text-slate-300">
                Producto
                <select
                  value={mermaData.producto}
                  onChange={(e) => setMermaData({ ...mermaData, producto: e.target.value })}
                  className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400"
                >
                  <option value="">Selecciona un producto</option>
                  {safeInventory.map((product) => (
                    <option key={product._id} value={product._id}>{product.nombre}</option>
                  ))}
                </select>
              </label>
              <label className="block text-sm font-medium text-slate-300">
                Cantidad de merma
                <input
                  type="number"
                  min="1"
                  value={mermaData.cantidad}
                  onChange={(e) => setMermaData({ ...mermaData, cantidad: Number(e.target.value) })}
                  className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400"
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-medium text-slate-300">
                Fecha de merma
                <input
                  type="date"
                  value={mermaData.fecha}
                  onChange={(e) => setMermaData({ ...mermaData, fecha: e.target.value })}
                  className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400"
                />
              </label>
              <label className="block text-sm font-medium text-slate-300">
                Motivo / comentario
                <input
                  type="text"
                  value={mermaData.motivo}
                  onChange={(e) => setMermaData({ ...mermaData, motivo: e.target.value })}
                  placeholder="Opcional"
                  className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400"
                />
              </label>
            </div>

            {mermaMessage && <p className="mt-4 text-sm text-emerald-300">{mermaMessage}</p>}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowMermaModal(false)}
                className="rounded-3xl border border-slate-700 bg-slate-900 px-6 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-800"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={async () => {
                  try {
                    setMermaMessage("");
                    await api.post("/inventory/mermas", mermaData);
                    window.dispatchEvent(new Event("dataUpdated"));
                    setShowMermaModal(false);
                    await loadInventory(query);
                  } catch (error) {
                    console.error("Error registrando merma:", error.response?.data || error.message);
                    setMermaMessage(error.response?.data?.message || "No se pudo registrar la merma.");
                  }
                }}
                className="rounded-3xl bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-300"
              >
                Guardar merma
              </button>
            </div>
          </div>
        </div>
      )}

      {editingProduct && (
        <EditProductModal product={editingProduct} onClose={() => setEditingProduct(null)} onSave={handleSave} />
      )}
    </section>
  );
}
