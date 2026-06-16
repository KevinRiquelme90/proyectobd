import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import api from "../api/axios";
import { formatCurrency } from "../utils/formatCurrency";
import { useAuth } from "../context/AuthContext";
import EditProductModal from "../components/EditProductModal";

export default function ProductsPage() {
  const location = useLocation();
  const initialSearch = new URLSearchParams(location.search).get("search") || "";
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState(initialSearch);
  const [editingProduct, setEditingProduct] = useState(null);
  const { user } = useAuth();
  const isAdmin = user?.role?.nombre === "ADMIN" || user?.role === "ADMIN";
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

  const loadProducts = async (search = "") => {
    try {
      setLoading(true);
      const [productRes, categoryRes, providerRes] = await Promise.all([
        api.get("/products", { params: { search } }),
        api.get("/categories"),
        api.get("/providers")
      ]);

      setProducts(productRes.data.products || productRes.data);
      setCategories(categoryRes.data);
      setProviders(providerRes.data.providers || providerRes.data);
    } catch (error) {
      console.error(error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  /*
    Comentarios:
    - Página de gestión de productos: carga, creación, edición y eliminación.
    - `handleEdit` abre `EditProductModal` pasándole el producto a modificar.
    - `handleSave` guarda en el backend y recarga la lista para mantener la
      vista sincronizada.
    - Buen lugar para añadir validaciones adicionales sobre stock/ precios.
  */

  useEffect(() => {
    const timeout = setTimeout(() => loadProducts(query), 250);
    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    loadProducts(initialSearch);
  }, [initialSearch]);

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

  const handleEdit = (product) => setEditingProduct(product);

  const handleSave = async (updated) => {
    try {
      await api.put(`/products/${updated._id}`, updated);
      setEditingProduct(null);
      await loadProducts(query);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "No se pudo actualizar el producto.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este producto?")) return;
    try {
      await api.delete(`/products/${id}`);
      await loadProducts(query);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "No se pudo eliminar el producto.");
    }
  };

  return (
    <section className="space-y-8">
      <div className="rounded-4xl border border-slate-800 bg-slate-950/95 p-6">
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
        <div className="rounded-4xl border border-slate-800 bg-slate-950/95 p-6">
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

        <div className="rounded-4xl border border-slate-800 bg-slate-950/95 p-6">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Inventario actual</h2>
              <p className="mt-2 text-sm text-slate-400">Revisa los productos disponibles y su nivel de stock.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar producto..."
                className="w-full max-w-sm rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400"
              />
              <span className="rounded-full bg-slate-800 px-4 py-2 text-sm uppercase tracking-[0.24em] text-slate-300">{products.length} artículos</span>
            </div>
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
                      <div className="flex flex-col gap-3 md:items-end">
                        <div className="flex flex-wrap gap-3 text-sm text-slate-300">
                          <span className="rounded-2xl bg-slate-800 px-3 py-2">Venta {formatCurrency(product.precio_venta)}</span>
                          <span className="rounded-2xl bg-slate-800 px-3 py-2">Compra {formatCurrency(product.precio_compra)}</span>
                          <span className="rounded-2xl bg-slate-800 px-3 py-2">Stock {product.stock}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button onClick={() => handleEdit(product)} className="rounded-full bg-emerald-400 px-3 py-1 text-xs font-semibold text-slate-950 hover:bg-emerald-300">Editar</button>
                          {isAdmin && (
                            <button onClick={() => handleDelete(product._id)} className="rounded-full bg-rose-500 px-3 py-1 text-xs font-semibold text-white hover:bg-rose-400">Eliminar</button>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          )}
        </div>
        {editingProduct && <EditProductModal product={editingProduct} onClose={() => setEditingProduct(null)} onSave={handleSave} />}
      </div>
    </section>
  );
}
