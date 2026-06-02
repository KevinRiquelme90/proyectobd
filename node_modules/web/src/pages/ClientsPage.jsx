import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import EditClientModal from "../components/EditClientModal";

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");
  const [editingClient, setEditingClient] = useState(null);
  const { user } = useAuth();
  const isAdmin = user?.role?.nombre === "ADMIN" || user?.role === "ADMIN";
  const { register, handleSubmit, reset } = useForm();

  const loadClients = async (search = "") => {
    try {
      setLoading(true);
      const response = await api.get("/clients", { params: { search } });
      setClients(response.data.clients || response.data);
    } catch (error) {
      console.error(error);
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => loadClients(query), 250);
    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    loadClients();
  }, []);

  const onSubmit = async (values) => {
    setSaving(true);
    setMessage("");
    try {
      await api.post("/clients", values);
      setMessage("Cliente creado correctamente");
      reset();
      await loadClients(query);
    } catch (error) {
      setMessage(error.response?.data?.message || "No se pudo crear el cliente");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (client) => setEditingClient(client);

  const handleSave = async (updated) => {
    try {
      await api.put(`/clients/${updated._id}`, updated);
      setEditingClient(null);
      await loadClients(query);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "No se pudo actualizar el cliente.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este cliente?")) return;
    try {
      await api.delete(`/clients/${id}`);
      await loadClients(query);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "No se pudo eliminar el cliente.");
    }
  };

  return (
    <section className="space-y-8">
      <div className="rounded-4xl border border-slate-800 bg-slate-950/95 p-6">
        <h2 className="text-2xl font-semibold text-white">Clientes</h2>
        <p className="mt-2 text-slate-400">Registra y gestiona tus clientes mayoristas y minoristas.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_0.9fr]">
        <div className="rounded-4xl border border-slate-800 bg-slate-950/95 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white">Clientes registrados</h3>
              <p className="mt-2 text-sm text-slate-400">Busca, edita y elimina clientes desde aquí.</p>
            </div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar cliente..."
              className="w-full max-w-sm rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400"
            />
          </div>
          {loading ? (
            <p className="mt-6 text-slate-400">Cargando clientes...</p>
          ) : (
            <div className="mt-6 space-y-4">
              {clients.length === 0 ? (
                <p className="text-slate-400">No hay clientes registrados.</p>
              ) : (
                clients.map((client) => (
                  <div key={client._id} className="rounded-3xl border border-slate-800 bg-slate-900 p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-lg font-semibold text-white">{client.nombre}</p>
                        <p className="mt-1 text-sm text-slate-400">{client.email || "Sin email"}</p>
                        <p className="mt-1 text-sm text-slate-500">{client.direccion || "Sin dirección"}</p>
                      </div>
                      <div className="flex flex-col gap-3 sm:items-end">
                        <p className="text-sm text-slate-300">{client.telefono || "Sin teléfono"}</p>
                        <div className="flex flex-wrap gap-2">
                          <button onClick={() => handleEdit(client)} className="rounded-full bg-emerald-400 px-3 py-1 text-xs font-semibold text-slate-950 hover:bg-emerald-300">Editar</button>
                          {isAdmin && (
                            <button onClick={() => handleDelete(client._id)} className="rounded-full bg-rose-500 px-3 py-1 text-xs font-semibold text-white hover:bg-rose-400">Eliminar</button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="rounded-4xl border border-slate-800 bg-slate-950/95 p-6">
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
      </div>

      {editingClient && <EditClientModal client={editingClient} onClose={() => setEditingClient(null)} onSave={handleSave} />}
    </section>
  );
}
