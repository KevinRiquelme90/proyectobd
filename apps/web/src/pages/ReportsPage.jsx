import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import { formatCurrency } from "../utils/formatCurrency";

export default function ReportsPage() {
  const [sales, setSales] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [salesRes, purchasesRes, dashboardRes] = await Promise.all([
          api.get("/sales"),
          api.get("/purchases"),
          api.get("/reports/dashboard")
        ]);

        setSales(salesRes.data.sales || salesRes.data || []);
        setPurchases(purchasesRes.data.purchases || purchasesRes.data || []);
        setDashboard(dashboardRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    const handleRefresh = () => {
      setLoading(true);
      load();
    };
    load();
    window.addEventListener("dataUpdated", handleRefresh);
    return () => window.removeEventListener("dataUpdated", handleRefresh);
  }, []);

  const totalSales = useMemo(() => sales.reduce((sum, item) => sum + (item.total || 0), 0), [sales]);
  const totalPurchases = useMemo(() => purchases.reduce((sum, item) => sum + (item.total || 0), 0), [purchases]);
  const totalMermas = dashboard?.totalMermas || 0;
  const totalVentasValue = dashboard?.totalVentas ?? totalSales;
  const totalComprasValue = dashboard?.totalCompras ?? totalPurchases;
  const gananciaNeta = totalVentasValue - totalComprasValue - totalMermas;

  return (
    <section className="space-y-8">
      <div className="rounded-4xl border border-slate-800 bg-slate-950/95 p-6">
        <p className="text-sm uppercase tracking-[0.24em] text-emerald-400">Reportes</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Análisis operativo</h1>
        <p className="mt-2 text-slate-400">Toma decisiones rápidas con las métricas clave de tu negocio.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="rounded-4xl border border-slate-800 bg-slate-950/95 p-6">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Ingresos</p>
          <p className="mt-4 text-4xl font-semibold text-white">{dashboard ? formatCurrency(dashboard.totalVentas || 0) : "..."}</p>
        </div>
        <div className="rounded-4xl border border-slate-800 bg-slate-950/95 p-6">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Compras</p>
          <p className="mt-4 text-4xl font-semibold text-white">{dashboard ? formatCurrency(dashboard.totalCompras || 0) : "..."}</p>
        </div>
        <div className="rounded-4xl border border-slate-800 bg-slate-950/95 p-6">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Total de mermas</p>
          <p className="mt-4 text-4xl font-semibold text-white">{formatCurrency(dashboard ? dashboard.totalMermas || 0 : 0)}</p>
        </div>
        <div className="rounded-4xl border border-slate-800 bg-slate-950/95 p-6">
          <p className="text-sm uppercase tracking-[0.24em] text-emerald-400">Clientes</p>
          <p className="mt-4 text-4xl font-semibold text-white">{dashboard ? dashboard.totalClientes || 0 : "..."}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-4xl border border-slate-800 bg-slate-950/95 p-6">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Ventas totales</p>
          <p className="mt-4 text-4xl font-semibold text-white">{formatCurrency(totalSales)}</p>
          <p className="mt-2 text-sm text-slate-400">Ventas registradas: {sales.length}</p>
        </div>
        <div className="rounded-4xl border border-slate-800 bg-slate-950/95 p-6">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Compras totales</p>
          <p className="mt-4 text-4xl font-semibold text-white">{formatCurrency(totalPurchases)}</p>
          <p className="mt-2 text-sm text-slate-400">Compras registradas: {purchases.length}</p>
        </div>
        <div className="rounded-4xl border border-slate-800 bg-slate-950/95 p-6">
          <p className="text-sm uppercase tracking-[0.24em] text-emerald-400">Ganancia neta</p>
          <p className="mt-4 text-4xl font-semibold text-white">{formatCurrency(gananciaNeta)}</p>
          <p className="mt-2 text-sm text-slate-400">Ventas - Compras - Mermas</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-4xl border border-slate-800 bg-slate-950/95 p-6">
          <h2 className="text-xl font-semibold text-white">Historial de ventas</h2>
          {loading ? (
            <p className="mt-6 text-slate-400">Cargando ventas...</p>
          ) : sales.length === 0 ? (
            <p className="mt-6 text-slate-400">No hay ventas registradas.</p>
          ) : (
            <div className="mt-6 space-y-3">
              {sales.slice(0, 10).map((sale) => (
                <div key={sale._id} className="rounded-3xl border border-slate-800 bg-slate-900 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-400">{sale.metodo_pago || "Método"}</p>
                      <p className="mt-1 text-lg font-semibold text-white">{sale.cliente?.nombre || "Consumidor final"}</p>
                    </div>
                    <p className="text-lg font-semibold text-emerald-400">{formatCurrency(sale.total)}</p>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">{new Date(sale.createdAt).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-4xl border border-slate-800 bg-slate-950/95 p-6">
          <h2 className="text-xl font-semibold text-white">Historial de compras</h2>
          {loading ? (
            <p className="mt-6 text-slate-400">Cargando compras...</p>
          ) : purchases.length === 0 ? (
            <p className="mt-6 text-slate-400">No hay compras registradas.</p>
          ) : (
            <div className="mt-6 space-y-3">
              {purchases.slice(0, 10).map((purchase) => (
                <div key={purchase._id} className="rounded-3xl border border-slate-800 bg-slate-900 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-400">Proveedor</p>
                      <p className="mt-1 text-lg font-semibold text-white">{purchase.proveedor?.nombre_empresa || "Proveedor desconocido"}</p>
                    </div>
                    <p className="text-lg font-semibold text-cyan-300">{formatCurrency(purchase.total)}</p>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">{new Date(purchase.createdAt).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
