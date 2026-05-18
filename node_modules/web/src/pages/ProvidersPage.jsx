import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import api from "../api/axios";

export default function ProvidersPage() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get("/providers");
        setProviders(response.data.providers || response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const onSubmit = async (values) => {
    setSaving(true);
    setMessage("");
    try {
      await api.post("/providers", values);
      setMessage("Proveedor creado correctamente");
      reset();
      const response = await api.get("/providers");
      setProviders(response.data.providers || response.data);
    } catch (error) {
      setMessage(error.response?.data?.message || "No se pudo crear el proveedor");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="space-y-8">
      <div className="rounded-[32px] border border-slate-800 bg-slate-950/95 p-6">
        <h2 className="text-2xl font-semibold text-white">Proveedores</h2>
        <p className="mt-2 text-slate-400">Configura tus fuentes de suministro y controla contactos clave.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[32px] border border-slate-800 bg-slate-950/95 p-6">
          <h3 className="text-xl font-semibold text-white">Nuevo proveedor</h3>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <label className="block text-sm font-medium text-slate-300">
              Nombre de la empresa
              <input {...register("nombre_empresa", { required: true })} className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400" />
            </label>
            <label className="block text-sm font-medium text-slate-300">
              Contacto
              <input {...register("contacto")} className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400" />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium text-slate-300">
                Email
                <input {...register("email")} className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400" />
              </label>
              <label className="block text-sm font-medium text-slate-300">
                Teléfono
                <input {...register("telefono")} className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400" />
              </label>
            </div>
            <label className="block text-sm font-medium text-slate-300">
              Dirección
              <input {...register("direccion")} className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400" />
            </label>
            {message && <p className="text-sm text-emerald-300">{message}</p>}
            <button type="submit" disabled={saving} className="rounded-3xl bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300">
              {saving ? "Guardando..." : "Agregar proveedor"}
            </button>
          </form>
        </div>

        <div className="rounded-[32px] border border-slate-800 bg-slate-950/95 p-6">
          <h3 className="text-xl font-semibold text-white">Proveedores registrados</h3>
          {loading ? (
            <p className="mt-4 text-slate-400">Cargando proveedores...</p>
          ) : (
            <div className="mt-6 space-y-4">
              {providers.length === 0 ? (
                <p className="text-slate-400">No hay proveedores registrados.</p>
              ) : (
                providers.map((provider) => (
                  <div key={provider._id} className="rounded-3xl border border-slate-800 bg-slate-900 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-lg font-semibold text-white">{provider.nombre_empresa}</p>
                        <p className="mt-1 text-sm text-slate-400">{provider.contacto || "Contacto sin definir"}</p>
                      </div>
                      <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">Activo</span>
                    </div>
                    <p className="mt-3 text-sm text-slate-500">{provider.telefono || provider.email || "Sin datos de contacto"}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
