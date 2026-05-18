import { useEffect, useState } from "react";
import api from "../api/axios";
import { formatCurrency } from "../utils/formatCurrency";

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [reportsRes, dashboardRes] = await Promise.all([
          api.get("/reports"),
          api.get("/reports/dashboard")
        ]);

        setReports(reportsRes.data.reports || reportsRes.data);
        setDashboard(dashboardRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <section className="space-y-8">
      <div className="rounded-[32px] border border-slate-800 bg-slate-950/95 p-6">
        <p className="text-sm uppercase tracking-[0.24em] text-emerald-400">Reportes</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Análisis operativo</h1>
        <p className="mt-2 text-slate-400">Toma decisiones rápidas con las métricas clave de tu negocio.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-[32px] border border-slate-800 bg-slate-950/95 p-6">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Ingresos</p>
          <p className="mt-4 text-4xl font-semibold text-white">{dashboard ? formatCurrency(dashboard.totalVentas || 0) : "..."}</p>
        </div>
        <div className="rounded-[32px] border border-slate-800 bg-slate-950/95 p-6">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Compras</p>
          <p className="mt-4 text-4xl font-semibold text-white">{dashboard ? formatCurrency(dashboard.totalCompras || 0) : "..."}</p>
        </div>
        <div className="rounded-[32px] border border-slate-800 bg-slate-950/95 p-6">
          <p className="text-sm uppercase tracking-[0.24em] text-emerald-400">Clientes</p>
          <p className="mt-4 text-4xl font-semibold text-white">{dashboard ? dashboard.totalClientes || 0 : "..."}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[32px] border border-slate-800 bg-slate-950/95 p-6">
          <h2 className="text-xl font-semibold text-white">Reportes recientes</h2>
          {loading ? (
            <p className="mt-6 text-slate-400">Cargando reportes...</p>
          ) : reports.length === 0 ? (
            <p className="mt-6 text-slate-400">No hay reportes disponibles actualmente.</p>
          ) : (
            <ul className="mt-6 space-y-3">
              {reports.map((report) => (
                <li key={report._id} className="rounded-3xl border border-slate-800 bg-slate-900 p-4">
                  <p className="text-sm text-slate-400">{report.tipo || "Reporte"}</p>
                  <p className="mt-1 text-lg font-semibold text-white">{report.titulo || report.nombre}</p>
                  <p className="mt-2 text-slate-400">{report.descripcion || report.detalle || "Resumen de operación"}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-[32px] border border-slate-800 bg-slate-950/95 p-6">
          <h2 className="text-xl font-semibold text-white">Tendencias recientes</h2>
          <div className="mt-6 space-y-4">
            <div className="rounded-3xl bg-slate-900 p-5 text-slate-300">
              <p className="text-sm text-slate-400">Ventas promedio por día</p>
              <p className="mt-3 text-3xl font-semibold text-white">{dashboard ? formatCurrency(dashboard.promedioVentasDiarias || 0) : "..."}</p>
            </div>
            <div className="rounded-3xl bg-slate-900 p-5 text-slate-300">
              <p className="text-sm text-slate-400">Productos más vendidos</p>
              <p className="mt-3 text-lg font-semibold text-white">{dashboard?.topProducto || "N/A"}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
