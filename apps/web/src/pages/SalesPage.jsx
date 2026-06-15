import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import api from "../api/axios";
import { formatCurrency } from "../utils/formatCurrency";

const paymentMethods = [
  { value: "efectivo", label: "Efectivo" },
  { value: "debito", label: "Débito" },
  { value: "credito", label: "Crédito" },
  { value: "transferencia", label: "Transferencia" }
];

export default function SalesPage() {
  const [products, setProducts] = useState([]);
  const [clients, setClients] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const { register, handleSubmit, watch, reset } = useForm({
    defaultValues: {
      cliente: "",
      producto: "",
      cantidad: 1,
      metodo_pago: "efectivo"
    }
  });

  const selectedProduct = watch("producto");
  const selectedQuantity = watch("cantidad", 1);

  const loadData = useCallback(async () => {
    try {
      const [productsRes, clientsRes] = await Promise.all([
        api.get("/products"),
        api.get("/clients")
      ]);

      setProducts(productsRes.data.products || productsRes.data);
      setClients(clientsRes.data.clients || clientsRes.data);
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

  const item = useMemo(
    () => products.find((product) => product._id === selectedProduct),
    [products, selectedProduct]
  );
  const selectedCartEntry = useMemo(
    () => cartItems.find((entry) => entry._id === item?._id),
    [cartItems, item]
  );
  const remainingStock = useMemo(() => {
    if (!item) return 0;
    return Math.max(item.stock - (selectedCartEntry?.cantidad || 0), 0);
  }, [item, selectedCartEntry]);

  const subtotal = useMemo(
    () => cartItems.reduce((total, product) => total + product.precio_venta * product.cantidad, 0),
    [cartItems]
  );

  const onAddItem = () => {
    if (!item || selectedQuantity <= 0) {
      setMessage("Selecciona un producto y una cantidad válida.");
      return;
    }

    if (item.stock <= 0 || remainingStock <= 0) {
      setMessage("El producto no tiene stock disponible.");
      return;
    }

    if (selectedQuantity > remainingStock) {
      setMessage(`Solo quedan ${remainingStock} unidades disponibles.`);
      return;
    }

    setMessage("");
    setCartItems((prev) => {
      const existing = prev.find((entry) => entry._id === item._id);
      if (existing) {
        return prev.map((entry) =>
          entry._id === item._id ? { ...entry, cantidad: entry.cantidad + Number(selectedQuantity) } : entry
        );
      }
      return [...prev, { ...item, cantidad: Number(selectedQuantity) }];
    });
  };

  const onRemoveItem = (itemId) => {
    setCartItems((prev) => prev.filter((entry) => entry._id !== itemId));
  };

  const onSubmit = async (values) => {
    if (cartItems.length === 0) {
      setMessage("Agrega al menos un producto al carrito.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const response = await api.post("/sales", {
        cliente: values.cliente || null,
        metodo_pago: values.metodo_pago,
        total: subtotal,
        items: cartItems.map((item) => ({
          producto: item._id,
          cantidad: item.cantidad,
          precio: item.precio_venta,
          subtotal: item.cantidad * item.precio_venta
        }))
      });

      setMessage("Venta registrada con éxito.");
      setCartItems([]);
      reset({ cliente: "", producto: "", cantidad: 1, metodo_pago: "efectivo" });
      window.dispatchEvent(new Event("dataUpdated"));
      await loadData();
      console.log("Venta creada:", response.data);
    } catch (error) {
      console.error("Error al registrar venta:", error.response?.data);
      setMessage(error.response?.data?.message || "No se pudo registrar la venta.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="space-y-8">
      <div className="rounded-4xl border border-slate-800 bg-slate-950/95 p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-emerald-400">Ventas</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Caja y facturación</h1>
            <p className="mt-2 text-slate-400">Registra ventas, gestiona clientes y controla el flujo de caja en tiempo real.</p>
          </div>
          <div className="rounded-3xl bg-slate-900 px-5 py-4 text-sm text-slate-300">
            Total en carrito: {formatCurrency(subtotal)}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-4xl border border-slate-800 bg-slate-950/95 p-6">
          <h2 className="text-xl font-semibold text-white">Agregar producto</h2>
          <div className="mt-6 grid gap-4">
            <label className="block text-sm font-medium text-slate-300">
              Cliente
              <select {...register("cliente")} className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400">
                <option value="">Consumidor final</option>
                {clients.map((client) => (
                  <option key={client._id} value={client._id}>{client.nombre}</option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-medium text-slate-300">
              Producto
              <select {...register("producto")} className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400">
                <option value="">Selecciona un producto</option>
                {products.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.nombre} (Stock: {product.stock ?? 0}) - {formatCurrency(product.precio_venta)}
                  </option>
                ))}
              </select>
              {item && (
                <p className="mt-2 text-sm text-slate-400">
                  Stock actual: <span className="font-semibold text-white">{item.stock}</span>
                  {selectedCartEntry ? ` | Ya agregado: ${selectedCartEntry.cantidad}.` : ""}
                  {selectedCartEntry ? ` Disponible: ${remainingStock}` : ` Disponible: ${remainingStock}`}
                </p>
              )}
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-medium text-slate-300">
                Cantidad
                <input type="number" min="1" {...register("cantidad", { valueAsNumber: true })} className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400" />
              </label>
              <label className="block text-sm font-medium text-slate-300">
                Método de pago
                <select {...register("metodo_pago")} className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400">
                  {paymentMethods.map((method) => (
                    <option key={method.value} value={method.value}>{method.label}</option>
                  ))}
                </select>
              </label>
            </div>
            <button onClick={onAddItem} disabled={!item || remainingStock <= 0 || selectedQuantity <= 0} className="w-full rounded-3xl bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:bg-slate-700">
              Añadir al carrito
            </button>
            {message && <p className="text-sm text-emerald-300">{message}</p>}
          </div>

          <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="text-lg font-semibold text-white">Resumen rápido</h3>
            <div className="mt-4 space-y-3">
              <p className="text-sm text-slate-400">Productos disponibles: {products.length}</p>
              <p className="text-sm text-slate-400">Clientes registrados: {clients.length}</p>
              <p className="text-sm text-slate-400">Items en carrito: {cartItems.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-4xl border border-slate-800 bg-slate-950/95 p-6">
          <h2 className="text-xl font-semibold text-white">Carrito de venta</h2>
          {cartItems.length === 0 ? (
            <p className="mt-6 text-slate-400">Añade productos para comenzar la venta.</p>
          ) : (
            <div className="mt-6 space-y-4">
              {cartItems.map((cartItem) => (
                <div key={cartItem._id} className="rounded-3xl border border-slate-800 bg-slate-900 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-white">{cartItem.nombre}</p>
                      <p className="text-sm text-slate-400">{cartItem.cantidad} x {formatCurrency(cartItem.precio_venta)}</p>
                    </div>
                    <button onClick={() => onRemoveItem(cartItem._id)} className="rounded-3xl bg-rose-500 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-400">
                      Eliminar
                    </button>
                  </div>
                  <p className="mt-3 text-sm text-slate-300">Subtotal: {formatCurrency(cartItem.cantidad * cartItem.precio_venta)}</p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Total de la venta</p>
            <p className="mt-2 text-3xl font-semibold text-white">{formatCurrency(subtotal)}</p>
            <button onClick={handleSubmit(onSubmit)} disabled={saving || cartItems.length === 0} className="mt-6 w-full rounded-3xl bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:bg-slate-700">
              {saving ? "Registrando venta..." : "Registrar venta"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
