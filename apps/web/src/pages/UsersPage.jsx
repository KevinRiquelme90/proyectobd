import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import api from "../api/axios";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      nombre: "",
      email: "",
      password: "",
      role: ""
    }
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [usersRes, rolesRes] = await Promise.all([
          api.get("/users"),
          api.get("/roles")
        ]);
        setUsers(usersRes.data.users || usersRes.data);
        setRoles(rolesRes.data);
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
      await api.post("/users", values);
      setMessage("Usuario creado correctamente.");
      reset({ nombre: "", email: "", password: "", role: "" });
      const response = await api.get("/users");
      setUsers(response.data.users || response.data);
    } catch (error) {
      setMessage(error.response?.data?.message || "No se pudo crear el usuario.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="space-y-8">
      <div className="rounded-[32px] border border-slate-800 bg-slate-950/95 p-6">
        <p className="text-sm uppercase tracking-[0.24em] text-emerald-400">Usuarios</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Administración de usuarios</h1>
        <p className="mt-2 text-slate-400">Crea cuentas de acceso y asigna permisos con roles definidos.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[32px] border border-slate-800 bg-slate-950/95 p-6">
          <h2 className="text-xl font-semibold text-white">Nuevo usuario</h2>
          <form className="mt-6 grid gap-4" onSubmit={handleSubmit(onSubmit)}>
            <label className="block text-sm font-medium text-slate-300">
              Nombre completo
              <input {...register("nombre", { required: true })} className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400" />
            </label>
            <label className="block text-sm font-medium text-slate-300">
              Email
              <input type="email" {...register("email", { required: true })} className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400" />
            </label>
            <label className="block text-sm font-medium text-slate-300">
              Contraseña
              <input type="password" {...register("password", { required: true })} className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400" />
            </label>
            <label className="block text-sm font-medium text-slate-300">
              Rol
              <select {...register("role", { required: true })} className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400">
                <option value="">Selecciona un rol</option>
                {roles.map((role) => (
                  <option key={role._id} value={role._id}>{role.nombre}</option>
                ))}
              </select>
            </label>
            <button type="submit" disabled={saving} className="w-full rounded-3xl bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:bg-slate-700">
              {saving ? "Creando usuario..." : "Crear usuario"}
            </button>
            {message && <p className="text-sm text-emerald-300">{message}</p>}
          </form>
        </div>

        <div className="rounded-[32px] border border-slate-800 bg-slate-950/95 p-6">
          <h2 className="text-xl font-semibold text-white">Usuarios activos</h2>
          {loading ? (
            <p className="mt-6 text-slate-400">Cargando usuarios...</p>
          ) : users.length === 0 ? (
            <p className="mt-6 text-slate-400">No hay usuarios registrados.</p>
          ) : (
            <div className="mt-6 space-y-4">
              {users.map((user) => (
                <div key={user._id} className="rounded-3xl border border-slate-800 bg-slate-900 p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-white">{user.nombre}</p>
                      <p className="text-sm text-slate-400">{user.email}</p>
                    </div>
                    <span className="rounded-full bg-slate-800 px-4 py-2 text-xs uppercase tracking-[0.24em] text-slate-300">{user.role?.nombre || user.role}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
