import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto grid min-h-screen max-w-[1600px] gap-8 px-4 py-6 lg:grid-cols-[300px_1fr] lg:px-8">
        <Sidebar />
        <main className="flex flex-col gap-8">
          <Topbar />
          <div className="rounded-[32px] bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20 backdrop-blur-xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
