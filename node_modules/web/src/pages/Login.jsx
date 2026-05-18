import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { signIn, isAuthenticated } = useAuth();
  const location = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      const destination = location.state?.from?.pathname || "/dashboard";
      navigate(destination, { replace: true });
    }
  }, [isAuthenticated, location.state, navigate]);

  const onSubmit = async (data) => {
    setServerError("");
    const destination = location.state?.from?.pathname || "/dashboard";

    try {
      const response = await api.post("/auth/login", data);
      signIn(response.data.token, response.data.user);
      navigate(destination, { replace: true });
    } catch (error) {
      setServerError(error.response?.data?.message || "Error al iniciar sesión");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-4 py-10">
        <div className="w-full rounded-[32px] border border-slate-800/90 bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/50 backdrop-blur-xl sm:p-10">
          <div className="mb-10 max-w-2xl space-y-4 text-center">
            <span className="inline-flex rounded-full bg-emerald-400 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-slate-950">
              ERP POS
            </span>
            <h1 className="text-4xl font-semibold text-white sm:text-5xl">Accede a tu panel administrativo</h1>
            <p className="mx-auto max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
              Inicia sesión para controlar tu inventario, ventas y clientes desde una interfaz moderna y segura.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-200">Correo electrónico</label>
              <input
                type="email"
                autoComplete="email"
                {...register("email", { required: "Email requerido" })}
                className="w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-5 py-4 text-sm text-white shadow-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/15"
              />
              {errors.email && <p className="text-sm text-rose-300">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-200">Contraseña</label>
              <input
                type="password"
                autoComplete="current-password"
                {...register("password", { required: "Contraseña requerida" })}
                className="w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-5 py-4 text-sm text-white shadow-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/15"
              />
              {errors.password && <p className="text-sm text-rose-300">{errors.password.message}</p>}
            </div>

            {serverError && (
              <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 px-5 py-4 text-sm text-rose-100">
                {serverError}
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-3xl bg-emerald-400 px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-950 transition hover:bg-emerald-300"
            >
              Iniciar sesión
            </button>
          </form>

          <div className="mt-8 rounded-3xl border border-slate-700/70 bg-slate-950/70 px-6 py-5 text-sm text-slate-400 shadow-sm">
            <p className="font-semibold text-slate-100">Usuario de demo</p>
            <p className="mt-2">admin@erp.com</p>
            <p>Admin123!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
