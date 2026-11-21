import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function AdminSidebar({ isOpen, onClose }) {
  const { profile } = useAuth();

  const menu = [
    {
      label: "Dashboard",
      path: "/admin",
      icon: "ri-dashboard-line",
      end: true,
    },
    {
      label: "Kelola Event",
      path: "/admin/events",
      icon: "ri-calendar-event-line",
    },
    {
      label: "Pesanan",
      path: "/admin/bookings",
      icon: "ri-ticket-2-line",
    },
    {
      label: "Pengguna",
      path: "/admin/users",
      icon: "ri-user-3-line",
    },
  ];

  const menuClass = ({ isActive }) =>
    `flex items-center rounded-none border-2 px-4 py-3 font-mono text-xs font-bold uppercase tracking-wider transition ${
      isActive
        ? "border-[#161616] bg-[#D94826] !text-[#FFFDF9] shadow-[4px_4px_0px_#161616] -translate-x-0.5 -translate-y-0.5"
        : "border-transparent bg-transparent !text-[#161616] hover:border-[#161616] hover:bg-[#F4EFE6] hover:shadow-[3px_3px_0px_#161616]"
    }`;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup menu admin"
          className="fixed inset-0 z-40 bg-[#161616]/60 backdrop-blur-[1px] lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-50
          h-screen w-72
          border-r-2 border-[#161616]
          bg-[#FFFDF9]
          !text-[#161616]
          transition-transform duration-300
          lg:w-64
          lg:translate-x-0
          ${isOpen ? "translate-x-0 shadow-[6px_0px_0px_#161616]" : "-translate-x-full"}
        `}
      >
        <div className="flex h-full min-w-0 flex-col">
          {/* Logo */}
          <div className="flex h-20 items-center justify-between gap-2 border-b-2 border-[#161616] bg-[#F4EFE6] px-5">
            <Link
              to="/admin"
              onClick={onClose}
              className="flex min-w-0 flex-col"
            >
              <span
                style={{ fontFamily: "'Syne', 'Space Grotesk', sans-serif" }}
                className="truncate text-xl font-extrabold uppercase tracking-tight !text-[#161616]"
              >
                MASUKVENUE
              </span>
            </Link>

            {/* Close Mobile */}
            <button
              type="button"
              onClick={onClose}
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
                bg-[#FFFDF9]
                font-mono
                text-lg
                font-bold
                !text-[#161616]
                shadow-[3px_3px_0px_#161616]
                transition
                hover:bg-[#D94826]
                hover:!text-[#FFFDF9]
                active:translate-x-0.5
                active:translate-y-0.5
                active:shadow-none
                lg:hidden
              "
              aria-label="Tutup menu"
            >
              ×
            </button>
          </div>

          {/* Admin Profile */}
          <div className="border-b-2 border-dashed border-[#161616] bg-[#FFFDF9] p-5">
            <span
              className="
                inline-block
                rounded-none
                border-2
                border-[#161616]
                bg-[#1D4ED8]
                px-2
                py-0.5
                font-mono
                text-[10px]
                font-bold
                uppercase
                tracking-wider
                !text-[#FFFDF9]
                shadow-[2px_2px_0px_#161616]
              "
            >
              Admin Panel
            </span>

            <div className="mt-3 flex min-w-0 items-center gap-3">
              <div
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
                  bg-[#D94826]
                  font-mono
                  text-sm
                  font-bold
                  uppercase
                  !text-[#FFFDF9]
                  shadow-[3px_3px_0px_#161616]
                "
              >
                {profile?.username?.charAt(0).toUpperCase() || "A"}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-mono text-sm font-bold !text-[#161616]">
                  @{profile?.username || "admin"}
                </p>

                <p className="font-mono text-xs !text-[#161616]">
                  Administrator
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2.5 overflow-y-auto p-4">
            {menu.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={onClose}
                className={menuClass}
              >
                <i className={`${item.icon} mr-3 shrink-0 text-base`}></i>
                <span className="truncate">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Back */}
          <div className="border-t-2 border-[#161616] bg-[#F4EFE6] p-4">
            <Link
              to="/"
              onClick={onClose}
              className="
                flex
                items-center
                justify-center
                gap-2
                rounded-none
                border-2
                border-[#161616]
                bg-[#FFFDF9]
                px-4
                py-3
                font-mono
                text-xs
                font-bold
                uppercase
                tracking-wider
                !text-[#161616]
                shadow-[4px_4px_0px_#161616]
                transition
                hover:-translate-x-0.5
                hover:-translate-y-0.5
                hover:bg-[#1D4ED8]
                hover:!text-[#FFFDF9]
                hover:shadow-[5px_5px_0px_#161616]
                active:translate-x-0.5
                active:translate-y-0.5
                active:shadow-[2px_2px_0px_#161616]
              "
            >
              <i className="ri-arrow-left-line shrink-0 text-base"></i>
              <span className="truncate">Kembali ke Website</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;