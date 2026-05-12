import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio_compra: "",
    precio_venta: "",
    stock: "",
    categoria: ""
  });

  const navigate = useNavigate();

  const getProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data);
    } catch (err) {
      console.error(err);
      setError("Error cargando productos.");
    } finally {
      setLoading(false);
    }
  };

  const getCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data);

      if (response.data.length > 0) {
        setForm((prev) => ({
          ...prev,
          categoria: response.data[0]._id
        }));
      }
    } catch (err) {
      console.error(err);
      setError("Error cargando categorías.");
    }
  };

  useEffect(() => {
    getCategories();
    getProducts();
  }, []);

  const handleInput = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateProduct = async (event) => {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      await api.post("/products", {
        nombre: form.nombre,
        descripcion: form.descripcion,
        precio_compra: Number(form.precio_compra),
        precio_venta: Number(form.precio_venta),
        stock: Number(form.stock),
        categoria: form.categoria
      });

      setForm((prev) => ({
        ...prev,
        nombre: "",
        descripcion: "",
        precio_compra: "",
        precio_venta: "",
        stock: ""
      }));
      getProducts();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Error creando producto.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const currentUser = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  if (loading) {
    return <div className="page page-center">Cargando productos...</div>;
  }

  return (
    <main className="page page-dashboard">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">ERP Verdulería</p>
          <h1>Productos</h1>
          <p className="subtitle">
            Bienvenido {currentUser?.nombre || "administrador"}. Aquí
            puedes revisar y agregar inventario rápidamente.
          </p>
        </div>

        <button className="button-secondary" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </header>

      <section className="grid-two">
        <article className="card">
          <h2>Nuevo producto</h2>
          <form className="form-grid" onSubmit={handleCreateProduct}>
            <label>
              Nombre
              <input
                name="nombre"
                value={form.nombre}
                onChange={handleInput}
                required
              />
            </label>

            <label>
              Descripción
              <input
                name="descripcion"
                value={form.descripcion}
                onChange={handleInput}
              />
            </label>

            <label>
              Categoría
              <select
                name="categoria"
                value={form.categoria}
                onChange={handleInput}
                required
              >
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.nombre}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Precio compra
              <input
                name="precio_compra"
                type="number"
                value={form.precio_compra}
                onChange={handleInput}
                required
              />
            </label>

            <label>
              Precio venta
              <input
                name="precio_venta"
                type="number"
                value={form.precio_venta}
                onChange={handleInput}
                required
              />
            </label>

            <label>
              Stock
              <input
                name="stock"
                type="number"
                value={form.stock}
                onChange={handleInput}
                required
              />
            </label>

            {error && <p className="form-error">{error}</p>}

            <button className="button-primary" type="submit" disabled={saving}>
              {saving ? "Guardando..." : "Agregar producto"}
            </button>
          </form>
        </article>

        <article className="card card-list">
          <h2>Inventario actual</h2>
          {products.length === 0 ? (
            <p>No hay productos registrados aún.</p>
          ) : (
            <div className="product-grid">
              {products.map((product) => (
                <div key={product._id} className="product-card">
                  <div className="product-card-header">
                    <strong>{product.nombre}</strong>
                    <span>{product.categoria?.nombre || "Sin categoría"}</span>
                  </div>
                  <p>{product.descripcion || "Sin descripción"}</p>
                  <div className="product-meta">
                    <span>Venta: ${product.precio_venta}</span>
                    <span>Compra: ${product.precio_compra}</span>
                    <span>Stock: {product.stock}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>
      </section>
    </main>
  );
};

export default ProductsPage;