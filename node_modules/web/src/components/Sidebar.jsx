import { NavLink } from "react-router-dom";
import {
  Home,
  Package,
  Layers,
  Users,
  ShoppingBag,
  CreditCard,
  BarChart3,
  Settings,
  FileText,
  Archive
} from "lucide-react";

const menuItems = [
  { to: "/dashboard", label: "Inicio", icon: Home },
  { to: "/products", label: "Productos", icon: Package },
  { to: "/categories", label: "Categorías", icon: Layers },
  { to: "/clients", label: "Clientes", icon: Users },
  { to: "/providers", label: "Proveedores", icon: Archive },
  { to: "/sales", label: "Ventas", icon: ShoppingBag },
  { to: "/purchases", label: "Compras", icon: CreditCard },
  { to: "/inventory", label: "Inventario", icon: FileText },
  { to: "/reports", label: "Reportes", icon: BarChart3 },
  { to: "/settings", label: "Ajustes", icon: Settings },
  { to: "/users", label: "Usuarios", icon: Users }
];

export default function Sidebar() {
  return (
    <aside className="w-full max-w-[280px] rounded-[32px] bg-slate-950/90 p-6 text-slate-100 shadow-xl shadow-slate-950/10 lg:min-h-[calc(100vh-2rem)]">
      <div className="mb-10 flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-3xl bg-emerald-400 text-slate-950">
          V
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-emerald-400">ERP POS</p>
          <h2 className="text-xl font-semibold">Verdulería</h2>
        </div>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium transition ${
                  isActive ? "bg-emerald-400 text-slate-950" : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
