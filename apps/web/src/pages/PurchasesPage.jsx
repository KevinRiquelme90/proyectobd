import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import api from "../api/axios";
import { formatCurrency } from "../utils/formatCurrency";

export default function PurchasesPage() {
  const [products, setProducts] = useState([]);
  const [providers, setProviders] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { register, control, handleSubmit, watch, reset } = useForm({
    defaultValues: {
      proveedor: "",
      items: [{ producto: "", cantidad: 1, precio_compra: 0 }]
    }
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const items = watch("items");

  const getProductById = useCallback(
    (id) => products.find((product) => product._id === id),
    [products]
  );

  const loadData = useCallback(async () => {
    try {
      const [productsRes, providersRes] = await Promise.all([
        api.get("/products"),
        api.get("/providers")
      ]);

      setProducts(productsRes.data.products || productsRes.data);
      setProviders(providersRes.data.providers || providersRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    window.addEventListener("dataUpdated", loadData);
    return () => window.removeEventListener("dataUpdated", loadData);
  }, [loadData]);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.cantidad * item.precio_compra, 0),
    [items]
  );

  const onSubmit = async (values) => {
    if (!values.proveedor) {
      setMessage("Selecciona un proveedor para continuar.");
      return;
    }

    setSaving(true);
    setMessage("");
    try {
      await api.post("/purchases", {
        proveedor: values.proveedor,
        total: subtotal,
        items: values.items.map((item) => ({
          producto: item.producto,
          cantidad: item.cantidad,
          precio_compra: item.precio_compra
        }))
      });

      setMessage("Compra registrada con éxito.");
      window.dispatchEvent(new Event("dataUpdated"));
      reset({ proveedor: "", items: [{ producto: "", cantidad: 1, precio_compra: 0 }] });
      await loadData();
    } catch (error) {
      console.error("Error registrando compra:", error.response?.data || error.message);
      setMessage(error.response?.data?.message || "No se pudo registrar la compra.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="space-y-8">
      <div className="rounded-4xl border border-slate-800 bg-slate-950/95 p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-emerald-400">Compras</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Entrada de inventario</h1>
            <p className="mt-2 text-slate-400">Registra nuevas compras y actualiza el stock de productos automáticamente.</p>
          </div>
          <div className="rounded-3xl bg-slate-900 px-5 py-4 text-sm text-slate-300">
            Total proyectado: {formatCurrency(subtotal)}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_0.6fr]">
        <div className="rounded-4xl border border-slate-800 bg-slate-950/95 p-6">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-medium text-slate-300">
                Proveedor
                <select {...register("proveedor")} className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400">
                  <option value="">Selecciona un proveedor</option>
                  {providers.map((provider) => (
                    <option key={provider._id} value={provider._id}>{provider.nombre_empresa}</option>
                  ))}
                </select>
              </label>
              <div className="rounded-3xl border border-slate-800 bg-slate-900 p-4">
                <p className="text-sm text-slate-400">Items en la compra</p>
                <p className="mt-3 text-2xl font-semibold text-white">{fields.length}</p>
              </div>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => {
                const selectedProduct = getProductById(items?.[index]?.producto);
                return (
                  <div key={field.id} className="rounded-3xl border border-slate-800 bg-slate-900 p-4">
                    <div className="grid gap-4 md:grid-cols-3">
                      <label className="block text-sm font-medium text-slate-300">
                        Producto
                        <select {...register(`items.${index}.producto`)} className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400">
                          <option value="">Elige un producto</option>
                          {products.map((product) => (
                            <option key={product._id} value={product._id}>
                              {product.nombre} (Stock: {product.stock ?? 0})
                            </option>
                          ))}
                        </select>
                      </label>
                      <div className="flex flex-col justify-end">
                        {selectedProduct && (
                          <p className="text-sm text-slate-400">
                            Stock actual: <span className="font-semibold text-white">{selectedProduct.stock ?? 0}</span>
                          </p>
                        )}
                      </div>
                      <label className="block text-sm font-medium text-slate-300">
                        Cantidad
                        <input type="number" min="1" {...register(`items.${index}.cantidad`, { valueAsNumber: true })} className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400" />
                      </label>
                      <label className="block text-sm font-medium text-slate-300">
                        Precio compra
                        <input type="number" step="0.01" min="0" {...register(`items.${index}.precio_compra`, { valueAsNumber: true })} className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400" />
                      </label>
                    </div>
                    <button type="button" onClick={() => remove(index)} className="mt-4 rounded-3xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white hover:bg-rose-400">
                      Eliminar item
                    </button>
                  </div>
                );
              })}
            </div>

            <button type="button" onClick={() => append({ producto: "", cantidad: 1, precio_compra: 0 })} className="rounded-3xl bg-slate-800 px-6 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-700">
              Añadir producto
            </button>

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <p className="text-sm text-slate-400">Total de la compra</p>
              <p className="mt-2 text-3xl font-semibold text-white">{formatCurrency(subtotal)}</p>
            </div>

            <button type="submit" disabled={saving} className="w-full rounded-3xl bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:bg-slate-700">
              {saving ? "Registrando compra..." : "Registrar compra"}
            </button>
            {message && <p className="text-sm text-emerald-300">{message}</p>}
          </form>
        </div>

        <div className="rounded-4xl border border-slate-800 bg-slate-950/95 p-6">
          <h2 className="text-xl font-semibold text-white">Detalles actuales</h2>
          <div className="mt-6 space-y-4">
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-4">
              <p className="text-sm text-slate-400">Productos disponibles</p>
              <p className="mt-2 text-3xl font-semibold text-white">{products.length}</p>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-4">
              <p className="text-sm text-slate-400">Proveedores registrados</p>
              <p className="mt-2 text-3xl font-semibold text-white">{providers.length}</p>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-4">
              <p className="text-sm text-slate-400">Items en esta compra</p>
              <p className="mt-2 text-3xl font-semibold text-white">{fields.length}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
