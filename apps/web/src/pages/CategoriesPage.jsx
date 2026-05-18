import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import api from "../api/axios";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get("/categories");
        setCategories(response.data);
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
      await api.post("/categories", { nombre: values.nombre, descripcion: values.descripcion });
      setMessage("Categoría creada correctamente");
      reset();
      const response = await api.get("/categories");
      setCategories(response.data);
    } catch (error) {
      setMessage(error.response?.data?.message || "No se pudo crear la categoría");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="space-y-8">
      <div className="rounded-[32px] border border-slate-800 bg-slate-950/95 p-6">
        <h2 className="text-2xl font-semibold text-white">Categorías</h2>
        <p className="mt-2 text-slate-400">Administra las categorías para tu catálogo de productos.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[32px] border border-slate-800 bg-slate-950/95 p-6">
          <h3 className="text-xl font-semibold text-white">Crear nueva categoría</h3>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <label className="block text-sm font-medium text-slate-300">
              Nombre
              <input
                {...register("nombre", { required: true })}
                className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400"
                placeholder="Verduras"
              />
            </label>
            <label className="block text-sm font-medium text-slate-300">
              Descripción
              <textarea
                {...register("descripcion")}
                className="mt-2 h-28 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400"
                placeholder="Descripción opcional"
              />
            </label>
            {message && <p className="text-sm text-emerald-300">{message}</p>}
            <button type="submit" disabled={saving} className="rounded-3xl bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300">
              {saving ? "Guardando..." : "Crear categoría"}
            </button>
          </form>
        </div>

        <div className="rounded-[32px] border border-slate-800 bg-slate-950/95 p-6">
          <h3 className="text-xl font-semibold text-white">Listado</h3>
          {loading ? (
            <p className="mt-4 text-slate-400">Cargando categorías...</p>
          ) : (
            <div className="mt-6 space-y-4">
              {categories.length === 0 ? (
                <p className="text-slate-400">No hay categorías registradas.</p>
              ) : (
                categories.map((category) => (
                  <div key={category._id} className="rounded-3xl border border-slate-800 bg-slate-900 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-lg font-semibold text-white">{category.nombre}</p>
                        <p className="mt-1 text-sm text-slate-400">{category.descripcion || "Sin descripción"}</p>
                      </div>
                      <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">Activa</span>
                    </div>
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
