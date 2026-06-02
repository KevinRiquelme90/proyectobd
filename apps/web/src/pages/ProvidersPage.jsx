import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import EditProviderModal from "../components/EditProviderModal";

export default function ProvidersPage() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");
  const [editingProvider, setEditingProvider] = useState(null);
  const { user } = useAuth();
  const isAdmin = user?.role?.nombre === "ADMIN" || user?.role === "ADMIN";
  const { register, handleSubmit, reset } = useForm();

  const loadProviders = async (search = "") => {
    try {
      setLoading(true);
      const response = await api.get("/providers", { params: { search } });
      setProviders(response.data.providers || response.data);
    } catch (error) {
      console.error(error);
      setProviders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => loadProviders(query), 250);
    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    loadProviders();
  }, []);

  const onSubmit = async (values) => {
    setSaving(true);
    setMessage("");
    try {
      await api.post("/providers", values);
      setMessage("Proveedor creado correctamente");
      reset();
      await loadProviders(query);
    } catch (error) {
      setMessage(error.response?.data?.message || "No se pudo crear el proveedor");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (provider) => setEditingProvider(provider);

  const handleSave = async (updated) => {
    try {
      await api.put(`/providers/${updated._id}`, updated);
      setEditingProvider(null);
      await loadProviders(query);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "No se pudo actualizar el proveedor.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este proveedor?")) return;
    try {
      await api.delete(`/providers/${id}`);
      await loadProviders(query);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "No se pudo eliminar el proveedor.");
    }
  };

  return (
    <section className="space-y-8">
      <div className="rounded-4xl border border-slate-800 bg-slate-950/95 p-6">
        <h2 className="text-2xl font-semibold text-white">Proveedores</h2>
        <p className="mt-2 text-slate-400">Configura tus fuentes de suministro y controla contactos clave.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_0.9fr]">
        <div className="rounded-4xl border border-slate-800 bg-slate-950/95 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white">Proveedores registrados</h3>
              <p className="mt-2 text-sm text-slate-400">Busca, edita y elimina proveedores de forma rápida.</p>
            </div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar proveedor..."
              className="w-full max-w-sm rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400"
            />
          </div>
          {loading ? (
            <p className="mt-6 text-slate-400">Cargando proveedores...</p>
          ) : (
            <div className="mt-6 space-y-4">
              {providers.length === 0 ? (
                <p className="text-slate-400">No hay proveedores registrados.</p>
              ) : (
                providers.map((provider) => (
                  <div key={provider._id} className="rounded-3xl border border-slate-800 bg-slate-900 p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-lg font-semibold text-white">{provider.nombre_empresa}</p>
                        <p className="mt-1 text-sm text-slate-400">{provider.contacto || "Contacto sin definir"}</p>
                        <p className="mt-1 text-sm text-slate-500">{provider.telefono || provider.email || "Sin datos de contacto"}</p>
                      </div>
                      <div className="flex flex-col gap-3 sm:items-end">
                        <button onClick={() => handleEdit(provider)} className="rounded-full bg-emerald-400 px-3 py-1 text-xs font-semibold text-slate-950 hover:bg-emerald-300">Editar</button>
                        {isAdmin && (
                          <button onClick={() => handleDelete(provider._id)} className="rounded-full bg-rose-500 px-3 py-1 text-xs font-semibold text-white hover:bg-rose-400">Eliminar</button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="rounded-4xl border border-slate-800 bg-slate-950/95 p-6">
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
      </div>

      {editingProvider && <EditProviderModal provider={editingProvider} onClose={() => setEditingProvider(null)} onSave={handleSave} />}
    </section>
  );
}
