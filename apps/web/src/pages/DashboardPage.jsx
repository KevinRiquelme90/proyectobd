import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, ResponsiveContainer, Tooltip, PieChart, Pie, Cell, XAxis } from "recharts";
import api from "../api/axios";
import { formatCurrency } from "../utils/formatCurrency";

const colors = ["#34d399", "#60a5fa", "#fbbf24", "#f472b6", "#a855f7"];

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLowStockModal, setShowLowStockModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await api.get("/reports/dashboard");
        setStats(response.data);
      } catch (error) {
        console.error(error);
        setError(error.response?.data?.message || "No se pudieron cargar las estadísticas.");
      } finally {
        setLoading(false);
      }
    };
    const handleRefresh = () => {
      setLoading(true);
      loadStats();
    };
    loadStats();
    window.addEventListener("dataUpdated", handleRefresh);
    return () => window.removeEventListener("dataUpdated", handleRefresh);
  }, []);

  if (loading) {
    return <div className="min-h-[420px] text-slate-300">Cargando estadísticas...</div>;
  }

  if (error) {
    return (
      <div className="min-h-[420px] rounded-[32px] border border-rose-500 bg-rose-500/10 p-8 text-rose-100">
        <h2 className="text-2xl font-semibold">Error cargando el tablero</h2>
        <p className="mt-3 text-slate-200">{error}</p>
        <p className="mt-4 text-sm text-slate-400">Intenta iniciar sesión de nuevo.</p>
      </div>
    );
  }

  const safeStats = stats || {};

  return (
    <section className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
        <article className="rounded-[32px] border border-slate-800 bg-slate-950/95 p-6">
          <span className="text-sm uppercase tracking-[0.24em] text-emerald-400">Ventas hoy</span>
          <p className="mt-4 text-4xl font-semibold text-white">{formatCurrency(safeStats.ventasDia || 0)}</p>
        </article>
        <article className="rounded-[32px] border border-slate-800 bg-slate-950/95 p-6">
          <span className="text-sm uppercase tracking-[0.24em] text-sky-400">Ventas mes</span>
          <p className="mt-4 text-4xl font-semibold text-white">{formatCurrency(safeStats.ventasMes || 0)}</p>
        </article>
        <button
          type="button"
          onClick={() => setShowLowStockModal(true)}
          className="rounded-[32px] border border-slate-800 bg-slate-950/95 p-6 text-left text-white hover:bg-slate-900"
        >
          <span className="text-sm uppercase tracking-[0.24em] text-amber-400">Productos bajos</span>
          <p className="mt-4 text-4xl font-semibold">{safeStats.productosBajos || 0}</p>
          <p className="mt-2 text-sm text-slate-400">Haz click para ver detalle</p>
        </button>
        <article className="rounded-[32px] border border-slate-800 bg-slate-950/95 p-6">
          <span className="text-sm uppercase tracking-[0.24em] text-cyan-400">Total de mermas</span>
          <p className="mt-4 text-4xl font-semibold text-white">{formatCurrency(safeStats.totalMermas || 0)}</p>
        </article>
        <article className="rounded-[32px] border border-slate-800 bg-slate-950/95 p-6">
          <span className="text-sm uppercase tracking-[0.24em] text-fuchsia-400">Ganancias</span>
          <p className="mt-4 text-4xl font-semibold text-white">{formatCurrency(safeStats.ganancias || 0)}</p>
        </article>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <section className="rounded-[32px] border border-slate-800 bg-slate-950/95 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Top productos</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Lo más vendido</h2>
            </div>
          </div>
          <div className="h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.topProducts} margin={{ left: -20, right: 10, top: 20, bottom: 20 }}>
                <XAxis dataKey="nombre" tick={{ angle: -35, textAnchor: "end", fontSize: 12 }} interval={0} height={70} />
                <Tooltip formatter={(value) => [value, "Unidades"]} cursor={{ fill: "rgba(15, 23, 42, 0.7)" }} />
                <Bar dataKey="ventas" radius={[16, 16, 0, 0]} fill="#34d399" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-[32px] border border-slate-800 bg-slate-950/95 p-6">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Distribución</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Productos más críticos</h2>
          <div className="mt-8 flex flex-col gap-8">
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={stats.topProducts} dataKey="ventas" nameKey="nombre" outerRadius={120} innerRadius={64} paddingAngle={3}>
                    {stats.topProducts.map((entry, index) => (
                      <Cell key={entry.nombre} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, "Unidades"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid gap-4">
              {stats.topProducts.map((product, index) => (
                <div key={product.nombre} className="rounded-3xl bg-slate-900 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-400">{product.nombre}</p>
                      <p className="mt-2 text-xl font-semibold text-white">{product.ventas} ventas</p>
                    </div>
                    <span className="rounded-3xl bg-slate-800 px-4 py-2 text-sm text-slate-200">Stock {product.stock}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {showLowStockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
          <div className="w-full max-w-3xl overflow-hidden rounded-[32px] border border-slate-800 bg-slate-950/95 p-6 shadow-2xl shadow-slate-950/40">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-white">Productos con stock bajo</h2>
                <p className="mt-2 text-sm text-slate-400">Revisa los productos que necesitan reposición urgente.</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowLowStockModal(false)} className="rounded-3xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800">Cerrar</button>
              </div>
            </div>
            <div className="space-y-4">
              {safeStats.lowStockProducts && safeStats.lowStockProducts.length > 0 ? (
                safeStats.lowStockProducts.map((product) => (
                  <div key={product._id} className="rounded-3xl border border-slate-800 bg-slate-900 p-4 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-slate-400">{product.categoria}</p>
                      <p className="mt-1 text-lg font-semibold text-white">{product.nombre}</p>
                      <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-400">
                        <span>Stock actual: {product.stock}</span>
                        <span>Stock mínimo: {product.stock_minimo}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate(`/products?search=${encodeURIComponent(product.nombre)}`)}
                      className="mt-4 rounded-3xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-300 sm:mt-0"
                    >
                      Ver producto
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-slate-400">No hay productos con stock bajo en este momento.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
