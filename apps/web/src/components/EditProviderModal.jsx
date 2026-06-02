import { useEffect, useState } from "react";

export default function EditProviderModal({ provider, onClose, onSave }) {
  const [form, setForm] = useState({ nombre_empresa: "", contacto: "", email: "", telefono: "", direccion: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (provider) {
      setForm({
        nombre_empresa: provider.nombre_empresa || "",
        contacto: provider.contacto || "",
        email: provider.email || "",
        telefono: provider.telefono || "",
        direccion: provider.direccion || ""
      });
    }
  }, [provider]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        _id: provider._id,
        nombre_empresa: form.nombre_empresa,
        contacto: form.contacto,
        email: form.email,
        telefono: form.telefono,
        direccion: form.direccion
      });
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div onClick={onClose} className="absolute inset-0 bg-black/60" />
      <div className="relative w-full max-w-xl rounded-2xl bg-slate-950 p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Editar proveedor</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">Cerrar</button>
        </div>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <label className="block text-sm text-slate-300">
            Nombre de la empresa
            <input name="nombre_empresa" value={form.nombre_empresa} onChange={handleChange} className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400" />
          </label>
          <label className="block text-sm text-slate-300">
            Contacto
            <input name="contacto" value={form.contacto} onChange={handleChange} className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400" />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm text-slate-300">
              Email
              <input name="email" value={form.email} onChange={handleChange} className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400" />
            </label>
            <label className="block text-sm text-slate-300">
              Teléfono
              <input name="telefono" value={form.telefono} onChange={handleChange} className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400" />
            </label>
          </div>
          <label className="block text-sm text-slate-300">
            Dirección
            <input name="direccion" value={form.direccion} onChange={handleChange} className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400" />
          </label>
          <div className="mt-2 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="rounded-3xl border border-slate-800 px-6 py-2 text-sm text-slate-300">Cancelar</button>
            <button type="submit" disabled={saving} className="rounded-3xl bg-emerald-400 px-6 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-300 disabled:opacity-60">
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
