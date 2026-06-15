import { useEffect, useState } from "react";

export default function EditProductModal({ product, onClose, onSave }) {
  const [form, setForm] = useState({ nombre: "", precio_compra: "", precio_venta: "", stock: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (product) {
      setForm({
        nombre: product.nombre || "",
        precio_compra: product.precio_compra ?? "",
        precio_venta: product.precio_venta ?? "",
        stock: product.stock ?? ""
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = {
        _id: product._id,
        nombre: form.nombre,
        precio_compra: form.precio_compra === "" ? undefined : parseFloat(form.precio_compra),
        precio_venta: form.precio_venta === "" ? undefined : parseFloat(form.precio_venta),
        stock: form.stock === "" ? undefined : parseInt(form.stock, 10)
      };
      await onSave(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex min-h-screen items-center justify-center overflow-y-auto bg-black/60 p-4">
      <div onClick={onClose} className="absolute inset-0" />
      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-950 p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Editar producto</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">Cerrar</button>
        </div>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <label className="block text-sm text-slate-300">
            Nombre
            <input name="nombre" value={form.nombre} onChange={handleChange} className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400" />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm text-slate-300">
              Precio compra
              <input name="precio_compra" value={form.precio_compra} onChange={handleChange} type="number" step="0.01" className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400" />
            </label>
            <label className="block text-sm text-slate-300">
              Precio venta
              <input name="precio_venta" value={form.precio_venta} onChange={handleChange} type="number" step="0.01" className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400" />
            </label>
          </div>
          <label className="block text-sm text-slate-300">
            Stock
            <input name="stock" value={form.stock} onChange={handleChange} type="number" className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400" />
          </label>

          <div className="mt-2 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="rounded-3xl border border-slate-800 px-6 py-2 text-sm text-slate-300">Cancelar</button>
            <button type="submit" disabled={saving} className="rounded-3xl bg-emerald-400 px-6 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-300 disabled:opacity-60">{saving ? 'Guardando...' : 'Guardar cambios'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
