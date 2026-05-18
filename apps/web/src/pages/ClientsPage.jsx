import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import api from "../api/axios";

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get("/clients");
        setClients(response.data.clients || response.data);
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
      await api.post("/clients", values);
      setMessage("Cliente creado correctamente");
      reset();
      const response = await api.get("/clients");
      setClients(response.data.clients || response.data);
    } catch (error) {
      setMessage(error.response?.data?.message || "No se pudo crear el cliente");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="space-y-8">
      <div className="rounded-[32px] border border-slate-800 bg-slate-950/95 p-6">
        <h2 className="text-2xl font-semibold text-white">Clientes</h2>
        <p className="mt-2 text-slate-400">Registra y gestiona tus clientes mayoristas y minoristas.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[32px] border border-slate-800 bg-slate-950/95 p-6">
          <h3 className="text-xl font-semibold text-white">Agregar cliente</h3>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium text-slate-300">
                Nombre
                <input {...register("nombre", { required: true })} className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400" />
              </label>
              <label className="block text-sm font-medium text-slate-300">
                Teléfono
                <input {...register("telefono")} className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400" />
              </label>
            </div>
            <label className="block text-sm font-medium text-slate-300">
              Email
              <input {...register("email")} className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400" />
            </label>
            <label className="block text-sm font-medium text-slate-300">
              Dirección
              <input {...register("direccion")} className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400" />
            </label>
            {message && <p className="text-sm text-emerald-300">{message}</p>}
            <button type="submit" disabled={saving} className="rounded-3xl bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300">
              {saving ? "Guardando..." : "Crear cliente"}
            </button>
          </form>
        </div>

        <div className="rounded-[32px] border border-slate-800 bg-slate-950/95 p-6">
          <h3 className="text-xl font-semibold text-white">Clientes registrados</h3>
          {loading ? (
            <p className="mt-4 text-slate-400">Cargando clientes...</p>
          ) : (
            <div className="mt-6 space-y-4">
              {clients.length === 0 ? (
                <p className="text-slate-400">No hay clientes registrados.</p>
              ) : (
                clients.map((client) => (
                  <div key={client._id} className="rounded-3xl border border-slate-800 bg-slate-900 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-lg font-semibold text-white">{client.nombre}</p>
                        <p className="mt-1 text-sm text-slate-400">{client.email || "Sin email"}</p>
                      </div>
                      <p className="text-sm text-slate-300">{client.telefono || "Sin teléfono"}</p>
                    </div>
                    <p className="mt-3 text-sm text-slate-500">{client.direccion || "Sin dirección"}</p>
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
