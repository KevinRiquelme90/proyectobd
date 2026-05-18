import { LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="flex flex-col gap-4 rounded-[32px] bg-white/80 p-6 shadow-lg shadow-slate-900/5 backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Panel administrativo</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950">Bienvenido {user?.nombre || "Usuario"}</h1>
      </div>
      <button
        type="button"
        onClick={handleLogout}
        className="inline-flex items-center gap-2 rounded-3xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        <LogOut className="h-4 w-4" />
        Cerrar sesión
      </button>
    </div>
  );
}
