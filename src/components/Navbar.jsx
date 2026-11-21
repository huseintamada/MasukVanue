import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const location = useLocation();
  const { user, profile, isAdmin, loading, logout } = useAuth();
  const username =
    profile?.username ||
    user?.user_metadata?.username ||
    user?.email?.split("@")[0] ||
    "User";

  // =========================
  // NAVIGATION
  // =========================
  const navLinks = [
    {
      label: "Beranda",
      path: "/",
    },
    {
      label: "Event",
      path: "/events",
    },
    {
      label: "Tiket Saya",
      path: "/my-tickets",
    },
    {
      label: "Tentang",
      path: "/about",
    },
  ];

  const checkActive = (path) => {
    const currentPath = location.pathname;

    if (path === "/") {
      return currentPath === "/";
    }

    if (path === "/events") {
      return (
        currentPath.startsWith("/events") || currentPath.startsWith("/booking")
      );
    }

    if (path === "/my-tickets") {
      return currentPath.startsWith("/my-tickets");
    }

    if (path === "/about") {
      return currentPath === "/about";
    }

    return false;
  };

  const mobileNavClass = (path) => {
    const active = checkActive(path);

    return `
      rounded-none
      border
      px-4
      py-2.5
      text-xs
      font-bold
      uppercase
      tracking-wider
      transition-all
      duration-150

      ${
        active
          ? "border-[#161616] bg-[#D94826] text-[#FFFDF9] shadow-[3px_3px_0px_#161616]"
          : "border-transparent text-[#161616]/80 hover:border-[#161616] hover:bg-[#FFFDF9] hover:text-[#161616]"
      }
    `;
  };

  // =========================
  // MOBILE MENU
  // =========================
  const closeMenu = () => {
    setIsOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  // =========================
  // LOGOUT
  // =========================
  const openLogoutModal = () => {
    setIsOpen(false);
    setShowLogoutModal(true);
  };

  const closeLogoutModal = () => {
    if (!logoutLoading) {
      setShowLogoutModal(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);

      const success = await logout();

      if (success) {
        setShowLogoutModal(false);
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Logout gagal:", error);
    } finally {
      setLogoutLoading(false);
    }
  };

  return (
    <>
      <header className="absolute left-0 top-0 z-50 w-full border-b-2 border-[#161616] bg-[#F4EFE6]/95 backdrop-blur-sm">
        <div className="container-app min-w-0 animate__animated animate__fadeInDown">
          {/* =========================
              NAVBAR
          ========================== */}
          <div className="flex h-20 items-center justify-between gap-3">
            {/* LOGO */}
            <Link
              to="/"
              onClick={closeMenu}
              className="flex shrink-0 items-center gap-2.5 border-2 border-[#161616] bg-[#FFFDF9] px-3 py-1.5 shadow-[3px_3px_0px_#161616] transition hover:-translate-x-0.5 hover:-translate-y-0.5"
            >
              <span
                style={{ fontFamily: "'Syne', 'Space Grotesk', sans-serif" }}
                className="inline-flex items-center text-base font-extrabold uppercase tracking-tight text-[#161616] sm:text-lg"
              >
                <span>MASUK</span>
                <span className="ml-1.5 border border-[#161616] bg-[#D94826] px-1.5 py-0.5 text-[#FFFDF9]">
                  VENUE
                </span>
              </span>
            </Link>

            {/* =========================
                DESKTOP MENU
            ========================== */}
            <nav className="hidden items-center gap-1.5 md:flex">
              {navLinks.map((item) => {
                const active = checkActive(item.path);

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={`
                      relative
                      rounded-none
                      border
                      px-3.5
                      py-2
                      text-xs
                      font-bold
                      uppercase
                      tracking-wider
                      transition-colors
                      ${
                        active
                          ? "border-[#161616] text-[#FFFDF9]"
                          : "border-transparent text-[#161616]/80 hover:border-[#161616] hover:bg-[#FFFDF9] hover:text-[#161616]"
                      }
                    `}
                  >
                    {active && (
                      <motion.div
                        layoutId="navbar-active"
                        className="absolute inset-0 -z-0 border border-[#161616] bg-[#D94826] shadow-[3px_3px_0px_#161616]"
                        transition={{
                          type: "spring",
                          stiffness: 450,
                          damping: 35,
                        }}
                      />
                    )}
                    <link
                      rel="preconnect"
                      href="https://fonts.googleapis.com"
                    />
                    <link
                      rel="preconnect"
                      href="https://fonts.gstatic.com"
                      crossorigin
                    />
                    <link
                      href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=Syne:wght@700;800&display=swap"
                      rel="stylesheet"
                    />

                    <span className="relative z-10">{item.label}</span>
                  </NavLink>
                );
              })}

            </nav>

            {/* =========================
                DESKTOP AUTH
            ========================== */}
            <div className="hidden items-center gap-2.5 md:flex">
              {!loading &&
                (user ? (
                  <>
                    {/* USER */}
                    <div
                      className="
                        flex
                        items-center
                        gap-2.5
                        rounded-none
                        border-2
                        border-[#161616]
                        bg-[#FFFDF9]
                        px-3
                        py-1.5
                        shadow-[3px_3px_0px_#161616]
                      "
                    >
                      {/* AVATAR */}
                      <div
                        className="
                          flex
                          h-7
                          w-7
                          shrink-0
                          items-center
                          justify-center
                          rounded-none
                          border
                          border-[#161616]
                          bg-[#1D4ED8]
                          font-mono
                          text-xs
                          font-bold
                          text-[#FFFDF9]
                        "
                      >
                        {username.charAt(0).toUpperCase()}
                      </div>

                      <span
                        className="
                          max-w-[120px]
                          truncate
                          font-mono
                          text-xs
                          font-bold
                          text-[#161616]
                        "
                      >
                        {username}
                      </span>
                    </div>

                    {/* LOGOUT */}
                    <button
                      type="button"
                      onClick={openLogoutModal}
                      className="
                        rounded-none
                        border
                        border-[#161616]
                        bg-transparent
                        px-3.5
                        py-2
                        text-xs
                        font-bold
                        uppercase
                        tracking-wider
                        text-[#161616]/80
                        transition
                        hover:bg-[#161616]
                        hover:text-[#FFFDF9]
                      "
                    >
                      Keluar
                    </button>
                  </>
                ) : (
                  <>
                    {/* LOGIN */}
                    <Link
                      to="/login"
                      className={`
                        rounded-none
                        border
                        px-3.5
                        py-2
                        text-xs
                        font-bold
                        uppercase
                        tracking-wider
                        transition

                        ${
                          location.pathname === "/login"
                            ? "border-[#161616] bg-[#161616] text-[#FFFDF9]"
                            : "border-transparent text-[#161616]/80 hover:border-[#161616] hover:bg-[#FFFDF9] hover:text-[#161616]"
                        }
                      `}
                    >
                      Masuk
                    </Link>

                    {/* REGISTER */}
                    <Link
                      to="/register"
                      className={`
                        rounded-none
                        border-2
                        border-[#161616]
                        px-4
                        py-2
                        text-xs
                        font-bold
                        uppercase
                        tracking-wider
                        shadow-[3px_3px_0px_#161616]
                        transition

                        ${
                          location.pathname === "/register"
                            ? "bg-[#D94826] text-[#FFFDF9]"
                            : "bg-[#FFFDF9] text-[#161616] hover:bg-[#1D4ED8] hover:text-[#FFFDF9]"
                        }
                      `}
                    >
                      Daftar
                    </Link>
                  </>
                ))}
            </div>

            {/* =========================
                MOBILE HAMBURGER
            ========================== */}
            <button
              type="button"
              onClick={toggleMenu}
              className="
                relative
                z-[60]
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-none
                border-2
                border-[#161616]
                bg-[#FFFDF9]
                text-[#161616]
                shadow-[3px_3px_0px_#161616]
                transition
                active:translate-x-0.5
                active:translate-y-0.5
                active:shadow-none
                md:hidden
              "
              aria-label={isOpen ? "Tutup menu" : "Buka menu"}
              aria-expanded={isOpen}
            >
              <div className="relative h-4 w-5">
                {/* TOP */}
                <span
                  className={`
                    absolute
                    left-0
                    h-[2px]
                    w-5
                    bg-[#161616]
                    transition-all
                    duration-300

                    ${isOpen ? "top-[7px] rotate-45" : "top-[2px]"}
                  `}
                />

                {/* MIDDLE */}
                <span
                  className={`
                    absolute
                    left-0
                    top-[7px]
                    h-[2px]
                    w-5
                    bg-[#161616]
                    transition-all
                    duration-300

                    ${
                      isOpen ? "scale-x-0 opacity-0" : "scale-x-100 opacity-100"
                    }
                  `}
                />

                {/* BOTTOM */}
                <span
                  className={`
                    absolute
                    left-0
                    h-[2px]
                    w-5
                    bg-[#161616]
                    transition-all
                    duration-300

                    ${isOpen ? "top-[7px] -rotate-45" : "top-[12px]"}
                  `}
                />
              </div>
            </button>
          </div>

          {/* =========================
              MOBILE DROPDOWN
          ========================== */}
          {isOpen && (
            <div
              className="
                relative
                z-50
                mb-4
                overflow-hidden
                rounded-none
                border-2
                border-[#161616]
                bg-[#F4EFE6]
                p-4
                shadow-[5px_5px_0px_#161616]
                md:hidden
              "
            >
              {/* MENU */}
              <nav className="flex flex-col gap-1.5">
                {navLinks.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={closeMenu}
                    className={() => mobileNavClass(item.path)}
                  >
                    {item.label}
                  </NavLink>
                ))}

                {!loading && isAdmin && (
                  <Link
                    to="/admin"
                    onClick={closeMenu}
                    className="mt-1 rounded-none border-2 border-[#161616] bg-[#1D4ED8] px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-[#FFFDF9] shadow-[3px_3px_0px_#161616]"
                  >
                    Panel Admin →
                  </Link>
                )}
              </nav>

              {/* =========================
                  MOBILE AUTH
              ========================== */}
              {!loading && (
                <div className="mt-4 border-t-2 border-dashed border-[#161616]/30 pt-4">
                  {user ? (
                    <div>
                      {/* USER INFO */}
                      <div
                        className="
                          mb-3
                          flex
                          items-center
                          gap-3
                          rounded-none
                          border
                          border-[#161616]
                          bg-[#FFFDF9]
                          p-3
                        "
                      >
                        <div
                          className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-none
                            border
                            border-[#161616]
                            bg-[#1D4ED8]
                            font-mono
                            text-sm
                            font-bold
                            text-[#FFFDF9]
                          "
                        >
                          {username.charAt(0).toUpperCase()}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-mono text-sm font-bold text-[#161616]">
                            {username}
                          </p>

                          <p className="truncate text-xs text-[#161616]/65">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      {/* MOBILE LOGOUT */}
                      <button
                        type="button"
                        onClick={openLogoutModal}
                        className="
                          w-full
                          rounded-none
                          border-2
                          border-[#161616]
                          bg-[#FFFDF9]
                          py-2.5
                          text-xs
                          font-bold
                          uppercase
                          tracking-wider
                          text-[#161616]
                          transition
                          hover:bg-[#D94826]
                          hover:text-[#FFFDF9]
                        "
                      >
                        Keluar
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <Link
                        to="/login"
                        onClick={closeMenu}
                        className="
                          rounded-none
                          border-2
                          border-[#161616]
                          bg-[#FFFDF9]
                          py-2.5
                          text-center
                          text-xs
                          font-bold
                          uppercase
                          tracking-wider
                          text-[#161616]
                          transition
                          hover:bg-[#161616]
                          hover:text-[#FFFDF9]
                        "
                      >
                        Masuk
                      </Link>

                      <Link
                        to="/register"
                        onClick={closeMenu}
                        className="
                          rounded-none
                          border-2
                          border-[#161616]
                          bg-[#D94826]
                          py-2.5
                          text-center
                          text-xs
                          font-bold
                          uppercase
                          tracking-wider
                          text-[#FFFDF9]
                          shadow-[3px_3px_0px_#161616]
                          transition
                          hover:bg-[#161616]
                        "
                      >
                        Daftar
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* =========================
          LOGOUT CONFIRMATION MODAL
      ========================== */}
      {showLogoutModal && (
        <div
          className="
            fixed
            inset-0
            z-[999]
            flex
            items-center
            justify-center
            px-4
          "
        >
          {/* BACKDROP */}
          <button
            type="button"
            aria-label="Tutup konfirmasi logout"
            onClick={closeLogoutModal}
            className="
              absolute
              inset-0
              cursor-default
              bg-[#161616]/70
            "
          />

          {/* MODAL */}
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-title"
            className="
              relative
              z-10
              w-full
              max-w-md
              overflow-hidden
              rounded-none
              border-2
              border-[#161616]
              bg-[#FFFDF9]
              p-6
              text-[#161616]
              shadow-[8px_8px_0px_#161616]
              sm:p-7
            "
          >
            {/* ICON */}
            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-none
                border-2
                border-[#161616]
                bg-[#D94826]
                text-[#FFFDF9]
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10 17l5-5-5-5" />
                <path d="M15 12H3" />
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              </svg>
            </div>

            {/* CONTENT */}
            <div className="mt-5">
              <h2
                id="logout-title"
                className="text-xl font-extrabold uppercase tracking-tight text-[#161616]"
              >
                Keluar dari akun?
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#161616]/75">
                Kamu yakin ingin keluar dari akun I&apos;m Your Event? Kamu
                perlu masuk kembali untuk mengakses tiket dan melakukan
                pemesanan.
              </p>
            </div>

            {/* USER INFO */}
            {user && (
              <div
                className="
                  mt-5
                  flex
                  items-center
                  gap-3
                  rounded-none
                  border
                  border-[#161616]
                  bg-[#F4EFE6]
                  p-3
                "
              >
                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-none
                    border
                    border-[#161616]
                    bg-[#1D4ED8]
                    font-mono
                    text-sm
                    font-bold
                    text-[#FFFDF9]
                  "
                >
                  {username.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0">
                  <p className="truncate font-mono text-sm font-bold text-[#161616]">
                    {username}
                  </p>

                  <p className="truncate text-xs text-[#161616]/65">
                    {user.email}
                  </p>
                </div>
              </div>
            )}

            {/* ACTIONS */}
            <div className="mt-7 grid grid-cols-2 gap-3">
              {/* CANCEL */}
              <button
                type="button"
                disabled={logoutLoading}
                onClick={closeLogoutModal}
                className="
                  rounded-none
                  border-2
                  border-[#161616]
                  bg-[#F4EFE6]
                  px-4
                  py-3
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  text-[#161616]
                  transition
                  hover:bg-[#FFFDF9]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                Batal
              </button>

              {/* CONFIRM */}
              <button
                type="button"
                disabled={logoutLoading}
                onClick={handleLogout}
                className="
                  rounded-none
                  border-2
                  border-[#161616]
                  bg-[#D94826]
                  px-4
                  py-3
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  text-[#FFFDF9]
                  shadow-[3px_3px_0px_#161616]
                  transition
                  hover:bg-[#161616]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {logoutLoading ? "Keluar..." : "Ya, Keluar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
