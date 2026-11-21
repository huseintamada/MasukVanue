import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { useAuth } from "../../context/AuthContext";

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { profile } = useAuth();

  return (
    <div className="min-h-screen min-w-0 bg-[#F4EFE6] !text-[#161616]">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Mobile Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b-2 border-[#161616] bg-[#FFFDF9] px-4 shadow-[0_4px_0px_#161616] lg:hidden">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-none
            border-2
            border-[#161616]
            bg-[#F4EFE6]
            !text-[#161616]
            shadow-[3px_3px_0px_#161616]
            transition
            hover:bg-[#D94826]
            hover:!text-[#FFFDF9]
            active:translate-x-0.5
            active:translate-y-0.5
            active:shadow-none
          "
          aria-label="Buka menu admin"
        >
          <div className="flex w-5 flex-col gap-[4px]">
            <span className="h-[2px] w-full bg-current" />
            <span className="h-[2px] w-full bg-current" />
            <span className="h-[2px] w-full bg-current" />
          </div>
        </button>

        <div className="flex min-w-0 items-center gap-2">
          <span
            style={{ fontFamily: "'Syne', 'Space Grotesk', sans-serif" }}
            className="truncate text-sm font-extrabold uppercase tracking-tight !text-[#161616]"
          >
            MASUKVENUE
          </span>
          <span className="hidden rounded-none border-2 border-[#161616] bg-[#1D4ED8] px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase !text-[#FFFDF9] sm:inline-block">
            Admin
          </span>
        </div>

        <div
          title={profile?.name || profile?.username || "Admin"}
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-none
            border-2
            border-[#161616]
            bg-[#D94826]
            font-mono
            text-xs
            font-bold
            uppercase
            !text-[#FFFDF9]
            shadow-[3px_3px_0px_#161616]
          "
        >
          {profile?.username?.charAt(0).toUpperCase() || "A"}
        </div>
      </header>

      {/* Admin Content */}
      <main className="min-h-screen min-w-0 lg:ml-64">
        <div className="min-w-0 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;