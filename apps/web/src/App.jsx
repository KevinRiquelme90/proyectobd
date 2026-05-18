import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import DashboardLayout from "./layouts/DashboardLayout";
import Login from "./pages/Login";
import DashboardPage from "./pages/DashboardPage";
import ProductsPage from "./pages/ProductsPage";
import CategoriesPage from "./pages/CategoriesPage";
import ClientsPage from "./pages/ClientsPage";
import ProvidersPage from "./pages/ProvidersPage";
import SalesPage from "./pages/SalesPage";
import PurchasesPage from "./pages/PurchasesPage";
import InventoryPage from "./pages/InventoryPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import UsersPage from "./pages/UsersPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="categories" element={<CategoriesPage />} />
              <Route path="clients" element={<ClientsPage />} />
              <Route path="providers" element={<ProvidersPage />} />
              <Route path="sales" element={<SalesPage />} />
              <Route path="purchases" element={<PurchasesPage />} />
              <Route path="inventory" element={<InventoryPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;