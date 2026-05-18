import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import api from "../api/axios";

const defaultSettings = {
  moneda: "ARS",
  impuesto_venta: "21",
  tasa_descuento_maxima: "0",
  observaciones_default: ""
};

export default function SettingsPage() {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const { register, handleSubmit, reset } = useForm({ defaultValues: defaultSettings });

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get("/settings");
        const settingsObject = response.data.reduce((acc, setting) => {
          acc[setting.clave] = setting.valor;
          return acc;
        }, {});
        setSettings(settingsObject);
        reset({ ...defaultSettings, ...settingsObject });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [reset]);

  const onSubmit = async (values) => {
    setSaving(true);
    setMessage("");
    try {
      const updatePromises = Object.entries(values).map(([clave, valor]) =>
        api.put(`/settings/${clave}`, { valor })
      );
      await Promise.all(updatePromises);
      setMessage("Ajustes actualizados correctamente.");
    } catch (error) {
      setMessage(error.response?.data?.message || "No se pudieron actualizar los ajustes.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="space-y-8">
      <div className="rounded-[32px] border border-slate-800 bg-slate-950/95 p-6">
        <p className="text-sm uppercase tracking-[0.24em] text-emerald-400">Ajustes</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Configuración del sistema</h1>
        <p className="mt-2 text-slate-400">Define las reglas y valores principales para tu ERP/POS.</p>
      </div>

      <div className="rounded-[32px] border border-slate-800 bg-slate-950/95 p-6">
        {loading ? (
          <p className="text-slate-400">Cargando configuración...</p>
        ) : (
          <form className="grid gap-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-medium text-slate-300">
                Moneda
                <input {...register("moneda")} className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400" />
              </label>
              <label className="block text-sm font-medium text-slate-300">
                Impuesto de venta (%)
                <input type="number" step="0.01" {...register("impuesto_venta")} className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400" />
              </label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-medium text-slate-300">
                Tasa de descuento máxima (%)
                <input type="number" step="0.01" {...register("tasa_descuento_maxima")} className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400" />
              </label>
              <label className="block text-sm font-medium text-slate-300">
                Observaciones por defecto
                <input {...register("observaciones_default")} className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400" />
              </label>
            </div>
            <button type="submit" disabled={saving} className="w-full rounded-3xl bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:bg-slate-700">
              {saving ? "Guardando..." : "Guardar ajustes"}
            </button>
            {message && <p className="text-sm text-emerald-300">{message}</p>}
          </form>
        )}
      </div>
    </section>
  );
}
