import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import api from "../api/axios";
import { formatCurrency } from "../utils/formatCurrency";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      nombre: "",
      descripcion: "",
      categoria: "",
      proveedor: "",
      precio_compra: "",
      precio_venta: "",
      stock: "",
      unidad_medida: "kg"
    }
  });

  const watchPrice = watch("precio_venta", 0);
  const watchCost = watch("precio_compra", 0);

  useEffect(() => {
    const load = async () => {
      try {
        const [productRes, categoryRes, providerRes] = await Promise.all([
          api.get("/products"),
          api.get("/categories"),
          api.get("/providers")
        ]);

        setProducts(productRes.data.products || productRes.data);
        setCategories(categoryRes.data);
        setProviders(providerRes.data.providers || providerRes.data);
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
      await api.post("/products", values);
      setMessage("Producto agregado con éxito");
      reset({
        nombre: "",
        descripcion: "",
        categoria: categories[0]?._id || "",
        proveedor: providers[0]?._id || "",
        precio_compra: "",
        precio_venta: "",
        stock: "",
        unidad_medida: "kg"
      });
      const response = await api.get("/products");
      setProducts(response.data.products || response.data);
    } catch (error) {
      setMessage(error.response?.data?.message || "No se pudo crear el producto");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="space-y-8">
      <div className="rounded-[32px] border border-slate-800 bg-slate-950/95 p-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-emerald-400">Productos</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Gestión de inventario</h1>
            <p className="mt-2 max-w-2xl text-slate-400">Administra productos, stock, categorías y proveedores desde una interfaz profesional.</p>
          </div>
          <div className="rounded-3xl bg-slate-900 px-5 py-4 text-sm text-slate-300">
            Margen estimado: {formatCurrency(Number(watchPrice) - Number(watchCost))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[32px] border border-slate-800 bg-slate-950/95 p-6">
          <h2 className="text-xl font-semibold text-white">Nuevo producto</h2>
          <form className="mt-6 grid gap-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-medium text-slate-300">
                Nombre
                <input {...register("nombre", { required: true })} className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400" />
              </label>
              <label className="block text-sm font-medium text-slate-300">
                Código de barras
                <input {...register("codigo_barra")} className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400" />
              </label>
            </div>
            <label className="block text-sm font-medium text-slate-300">
              Descripción
              <textarea {...register("descripcion")} className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400" rows="3" />
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-medium text-slate-300">
                Categoría
                <select {...register("categoria")} className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400">
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>{category.nombre}</option>
                  ))}
                </select>
              </label>
              <label className="block text-sm font-medium text-slate-300">
                Proveedor
                <select {...register("proveedor")} className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400">
                  <option value="">Sin proveedor</option>
                  {providers.map((provider) => (
                    <option key={provider._id} value={provider._id}>{provider.nombre_empresa}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <label className="block text-sm font-medium text-slate-300">
                Precio compra
                <input type="number" {...register("precio_compra", { valueAsNumber: true })} className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400" />
              </label>
              <label className="block text-sm font-medium text-slate-300">
                Precio venta
                <input type="number" {...register("precio_venta", { valueAsNumber: true })} className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400" />
              </label>
              <label className="block text-sm font-medium text-slate-300">
                Stock
                <input type="number" {...register("stock", { valueAsNumber: true })} className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400" />
              </label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-medium text-slate-300">
                Unidad de medida
                <select {...register("unidad_medida")} className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400">
                  <option value="kg">kg</option>
                  <option value="g">g</option>
                  <option value="unidad">unidad</option>
                  <option value="caja">caja</option>
                  <option value="litro">litro</option>
                </select>
              </label>
              <div className="flex items-end">
                <button type="submit" disabled={saving} className="w-full rounded-3xl bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300">
                  {saving ? "Guardando..." : "Agregar producto"}
                </button>
              </div>
            </div>
            {message && <p className="text-sm text-emerald-300">{message}</p>}
          </form>
        </div>

        <div className="rounded-[32px] border border-slate-800 bg-slate-950/95 p-6">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-white">Inventario actual</h2>
              <p className="mt-2 text-sm text-slate-400">Revisa los productos disponibles y su nivel de stock.</p>
            </div>
            <span className="rounded-full bg-slate-800 px-4 py-2 text-sm uppercase tracking-[0.24em] text-slate-300">{products.length} artículos</span>
          </div>
          {loading ? (
            <p className="text-slate-400">Cargando productos...</p>
          ) : (
            <div className="space-y-4">
              {products.length === 0 ? (
                <p className="text-slate-400">No hay productos registrados aún.</p>
              ) : (
                products.map((product) => (
                  <article key={product._id} className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-lg font-semibold text-white">{product.nombre}</p>
                        <p className="mt-1 text-sm text-slate-400">{product.categoria?.nombre || "Sin categoría"}</p>
                      </div>
                      <div className="flex flex-wrap gap-3 text-sm text-slate-300">
                        <span className="rounded-2xl bg-slate-800 px-3 py-2">Venta {formatCurrency(product.precio_venta)}</span>
                        <span className="rounded-2xl bg-slate-800 px-3 py-2">Compra {formatCurrency(product.precio_compra)}</span>
                        <span className="rounded-2xl bg-slate-800 px-3 py-2">Stock {product.stock}</span>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
