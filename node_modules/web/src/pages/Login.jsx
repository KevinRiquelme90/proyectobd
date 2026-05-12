import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/products", { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const response = await api.post("/auth/login", {
        email,
        password
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/products");
    } catch (err) {
      setError(
        err.response?.data?.message || "Error al iniciar sesión"
      );
    }
  };

  return (
    <main className="page page-center">
      <section className="card card-auth">
        <h1>Ingreso ERP</h1>
        <p>Accede a tus productos y administra el inventario.</p>

        <form onSubmit={handleLogin} className="form-grid">
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ingresa tu correo electrónico"
              required
            />
          </label>

          <label>
            Contraseña
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              required
            />
          </label>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="button-primary">
            Iniciar sesión
          </button>
        </form>
      </section>
    </main>
  );
}