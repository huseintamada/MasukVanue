import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";

function AdminUsers() {
  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("Semua");

  // =========================
  // FETCH USERS
  // =========================
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, name, role, created_at")
        .order("created_at", {
          ascending: false,
        });

      if (error) throw error;

      setUsers(data ?? []);
    } catch (err) {
      console.error("Gagal mengambil pengguna:", err);

      setError(err.message || "Data pengguna gagal dimuat.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // =========================
  // DATE
  // =========================
  const formatDate = (date) => {
    if (!date) return "-";

    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  };

  // =========================
  // FILTER
  // =========================
  const filteredUsers = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return users.filter((item) => {
      const name = item.name?.toLowerCase() || "";

      const username = item.username?.toLowerCase() || "";

      const role = item.role?.toLowerCase() || "";

      const matchesSearch =
        !keyword || name.includes(keyword) || username.includes(keyword);

      const matchesRole =
        roleFilter === "Semua" || role === roleFilter.toLowerCase();

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  // =========================
  // STATISTICS
  // =========================
  const statistics = useMemo(() => {
    const totalAdmin = users.filter(
      (item) => item.role?.toLowerCase() === "admin",
    ).length;

    const totalUser = users.filter(
      (item) => item.role?.toLowerCase() === "user",
    ).length;

    return {
      total: users.length,
      user: totalUser,
      admin: totalAdmin,
    };
  }, [users]);

  // =========================
  // INITIAL
  // =========================
  const getInitial = (item) => {
    const source = item.name || item.username || "U";

    return source.charAt(0).toUpperCase();
  };

  // =========================
  // ROLE STYLE
  // =========================
  const getRoleStyle = (role) => {
    if (role?.toLowerCase() === "admin") {
      return "border-2 border-[#161616] bg-[#D94826] !text-[#FFFDF9] shadow-[2px_2px_0px_#161616]";
    }

    return "border-2 border-[#161616] bg-[#1D4ED8] !text-[#FFFDF9] shadow-[2px_2px_0px_#161616]";
  };

  return (
    <div className="min-w-0 bg-[#F4EFE6] !text-[#161616]">
      {/* HEADER */}
      <div
        className="
          flex
          min-w-0
          flex-col
          gap-5
          border-b-2
          border-dashed
          border-[#161616]
          pb-6
          sm:flex-row
          sm:items-end
          sm:justify-between
        "
      >
        <div className="min-w-0">
          <h1
            style={{ fontFamily: "'Syne', 'Space Grotesk', sans-serif" }}
            className="
              mt-3
              break-words
              text-3xl
              font-extrabold
              uppercase
              tracking-tight
              !text-[#161616]
              sm:text-4xl
            "
          >
            Kelola Pengguna
          </h1>

          <p className="mt-2 max-w-xl font-mono text-xs leading-6 sm:text-sm !text-[#161616]">
            Lihat seluruh akun yang terdaftar di MASUKVENUE.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchUsers}
          disabled={loading}
          className="
            inline-flex
            w-fit
            shrink-0
            items-center
            justify-center
            gap-2
            rounded-none
            border-2
            border-[#161616]
            bg-[#FFFDF9]
            px-4
            py-2.5
            font-mono
            text-xs
            font-bold
            uppercase
            tracking-wider
            !text-[#161616]
            shadow-[5px_5px_0px_#161616]
            transition
            hover:-translate-x-0.5
            hover:-translate-y-0.5
            hover:bg-[#D94826]
            hover:!text-[#FFFDF9]
            hover:shadow-[6px_6px_0px_#161616]
            active:translate-x-0.5
            active:translate-y-0.5
            active:shadow-[2px_2px_0px_#161616]
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <i
            className={`
              ri-refresh-line
              text-base
              ${loading ? "animate-spin" : ""}
            `}
          ></i>
          <span>Refresh</span>
        </button>
      </div>

      {/* STATISTICS */}
      <div className="mt-8 grid min-w-0 gap-5 sm:grid-cols-3">
        <StatCard
          icon="ri-group-line"
          label="Total Akun"
          value={statistics.total}
          accentClass="bg-[#F4EFE6] !text-[#161616]"
        />

        <StatCard
          icon="ri-user-line"
          label="Pengguna"
          value={statistics.user}
          accentClass="bg-[#1D4ED8] !text-[#FFFDF9]"
        />

        <StatCard
          icon="ri-shield-user-line"
          label="Administrator"
          value={statistics.admin}
          accentClass="bg-[#D94826] !text-[#FFFDF9]"
        />
      </div>

      {/* SEARCH */}
      <div
        className="
          mt-8
          grid
          min-w-0
          gap-3
          rounded-none
          border-2
          border-[#161616]
          bg-[#FFFDF9]
          p-4
          shadow-[5px_5px_0px_#161616]
          md:grid-cols-[1fr_200px]
        "
      >
        <div className="relative min-w-0">
          <i
            className="
              ri-search-line
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-base
              !text-[#161616]
            "
          ></i>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama atau username..."
            className="
              w-full
              min-w-0
              rounded-none
              border-2
              border-[#161616]
              bg-[#F4EFE6]
              py-3
              pl-11
              pr-10
              font-mono
              text-xs
              sm:text-sm
              !text-[#161616]
              outline-none
              transition
              placeholder:!text-[#161616]/60
              focus:bg-[#FFFDF9]
              focus:shadow-[3px_3px_0px_#161616]
            "
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Hapus pencarian"
              className="
                absolute
                right-3
                top-1/2
                flex
                h-7
                w-7
                -translate-y-1/2
                items-center
                justify-center
                rounded-none
                border-2
                border-[#161616]
                bg-[#FFFDF9]
                !text-[#161616]
                transition
                hover:bg-[#D94826]
                hover:!text-[#FFFDF9]
              "
            >
              <i className="ri-close-line"></i>
            </button>
          )}
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="
            w-full
            min-w-0
            rounded-none
            border-2
            border-[#161616]
            bg-[#F4EFE6]
            px-4
            py-3
            font-mono
            text-xs
            font-bold
            uppercase
            !text-[#161616]
            outline-none
            transition
            focus:bg-[#FFFDF9]
            focus:shadow-[3px_3px_0px_#161616]
          "
        >
          <option value="Semua">Semua Role</option>

          <option value="user">User</option>

          <option value="admin">Admin</option>
        </select>
      </div>

      {/* RESULT */}
      {!loading && !error && users.length > 0 && (
        <div className="mt-5 flex min-w-0 flex-wrap items-center justify-between gap-4">
          <p className="font-mono text-xs !text-[#161616]">
            Menampilkan{" "}
            <span className="font-bold underline decoration-[#D94826] decoration-2 !text-[#161616]">
              {filteredUsers.length}
            </span>{" "}
            dari{" "}
            <span className="font-bold !text-[#161616]">{users.length}</span>{" "}
            akun
          </p>

          {(search || roleFilter !== "Semua") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setRoleFilter("Semua");
              }}
              className="
                rounded-none
                border-2
                border-[#161616]
                bg-[#FFFDF9]
                px-3
                py-1
                font-mono
                text-xs
                font-bold
                uppercase
                !text-[#D94826]
                shadow-[2px_2px_0px_#161616]
                transition
                hover:bg-[#D94826]
                hover:!text-[#FFFDF9]
              "
            >
              Reset Filter
            </button>
          )}
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div
          className="
            mt-6
            rounded-none
            border-2
            border-[#161616]
            bg-[#FFFDF9]
            px-6
            py-16
            text-center
            shadow-[6px_6px_0px_#161616]
          "
        >
          <i className="ri-loader-4-line inline-block animate-spin text-3xl !text-[#D94826]"></i>

          <p className="mt-4 font-mono text-xs font-bold uppercase tracking-wider !text-[#161616]">
            Memuat data pengguna...
          </p>
        </div>
      )}

      {/* ERROR */}
      {!loading && error && (
        <div
          className="
            mt-6
            rounded-none
            border-2
            border-[#161616]
            bg-[#FFFDF9]
            px-6
            py-14
            text-center
            shadow-[6px_6px_0px_#161616]
          "
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-none border-2 border-[#161616] bg-[#D94826] !text-[#FFFDF9] shadow-[3px_3px_0px_#161616]">
            <i className="ri-error-warning-line text-2xl"></i>
          </div>

          <h2
            style={{ fontFamily: "'Syne', 'Space Grotesk', sans-serif" }}
            className="mt-4 text-lg font-extrabold uppercase !text-[#161616]"
          >
            Data pengguna gagal dimuat
          </h2>

          <p className="mt-2 break-words font-mono text-xs !text-[#161616]">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchUsers}
            className="
              mt-5
              rounded-none
              border-2
              border-[#161616]
              bg-[#D94826]
              px-5
              py-2.5
              font-mono
              text-xs
              font-bold
              uppercase
              tracking-wider
              !text-[#FFFDF9]
              shadow-[4px_4px_0px_#161616]
              transition
              hover:-translate-x-0.5
              hover:-translate-y-0.5
              hover:shadow-[5px_5px_0px_#161616]
            "
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* DESKTOP TABLE */}
      {!loading && !error && filteredUsers.length > 0 && (
        <div
          className="
            mt-6
            hidden
            min-w-0
            overflow-hidden
            rounded-none
            border-2
            border-[#161616]
            bg-[#FFFDF9]
            shadow-[6px_6px_0px_#161616]
            md:block
          "
        >
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="border-b-2 border-[#161616] bg-[#F4EFE6]">
                <tr>
                  <TableHeader>Pengguna</TableHeader>

                  <TableHeader>Username</TableHeader>

                  <TableHeader>Role</TableHeader>

                  <TableHeader>Bergabung</TableHeader>

                  <TableHeader>Status</TableHeader>

                  <TableHeader>Aksi</TableHeader>
                </tr>
              </thead>

              <tbody className="divide-y-2 divide-dashed divide-[#161616]">
                {filteredUsers.map((item) => (
                  <tr
                    key={item.id}
                    className="
                      transition
                      hover:bg-[#F4EFE6]
                    "
                  >
                    {/* USER */}
                    <TableCell>
                      <div className="flex min-w-0 items-center gap-3">
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
                            bg-[#F4EFE6]
                            font-mono
                            text-sm
                            font-bold
                            uppercase
                            !text-[#161616]
                            shadow-[3px_3px_0px_#161616]
                          "
                        >
                          {getInitial(item)}
                        </div>

                        <div className="min-w-0">
                          <p className="max-w-[220px] truncate font-mono text-sm font-bold !text-[#161616]">
                            {item.name || "Tanpa nama"}
                          </p>

                          {item.id === user?.id && (
                            <span className="mt-1 inline-block rounded-none border border-[#161616] bg-[#1D4ED8] px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase !text-[#FFFDF9]">
                              Akun kamu
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    {/* USERNAME */}
                    <TableCell>
                      <span className="font-mono text-xs font-medium !text-[#161616]">
                        @{item.username || "-"}
                      </span>
                    </TableCell>

                    {/* ROLE */}
                    <TableCell>
                      <span
                        className={`
                          inline-flex
                          rounded-none
                          px-3
                          py-1
                          font-mono
                          text-[11px]
                          font-bold
                          uppercase
                          tracking-wider
                          ${getRoleStyle(item.role)}
                        `}
                      >
                        {item.role || "user"}
                      </span>
                    </TableCell>

                    {/* DATE */}
                    <TableCell>
                      <span className="whitespace-nowrap font-mono text-xs !text-[#161616]">
                        {formatDate(item.created_at)}
                      </span>
                    </TableCell>

                    {/* STATUS */}
                    <TableCell>
                      <span
                        className="
                          inline-flex
                          items-center
                          gap-2
                          rounded-none
                          border
                          border-[#161616]
                          bg-[#F4EFE6]
                          px-2.5
                          py-1
                          font-mono
                          text-xs
                          font-bold
                          uppercase
                          !text-[#161616]
                        "
                      >
                        <span className="h-2 w-2 rounded-none bg-[#1D4ED8]"></span>
                        Aktif
                      </span>
                    </TableCell>

                    {/* ACTION */}
                    <TableCell>
                      <Link
                        to={`/admin/users/${item.id}`}
                        title="Lihat detail pengguna"
                        aria-label={`Lihat detail ${item.name || item.username}`}
                        className="
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-none
                          border-2
                          border-[#161616]
                          bg-[#FFFDF9]
                          !text-[#161616]
                          shadow-[3px_3px_0px_#161616]
                          transition
                          hover:bg-[#1D4ED8]
                          hover:!text-[#FFFDF9]
                        "
                      >
                        <i className="ri-eye-line text-base"></i>
                      </Link>
                    </TableCell>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MOBILE */}
      {!loading && !error && filteredUsers.length > 0 && (
        <div className="mt-6 grid min-w-0 gap-4 md:hidden">
          {filteredUsers.map((item) => (
            <article
              key={item.id}
              className="
                min-w-0
                rounded-none
                border-2
                border-[#161616]
                bg-[#FFFDF9]
                p-5
                shadow-[5px_5px_0px_#161616]
              "
            >
              <div className="flex items-start gap-4">
                <div
                  className="
                    flex
                    h-12
                    w-12
                    shrink-0
                    items-center
                    justify-center
                    rounded-none
                    border-2
                    border-[#161616]
                    bg-[#F4EFE6]
                    font-mono
                    text-lg
                    font-bold
                    uppercase
                    !text-[#161616]
                    shadow-[3px_3px_0px_#161616]
                  "
                >
                  {getInitial(item)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-mono text-sm font-bold !text-[#161616]">
                        {item.name || "Tanpa nama"}
                      </p>

                      <p className="mt-1 truncate font-mono text-xs !text-[#161616]">
                        @{item.username || "-"}
                      </p>
                    </div>

                    <span
                      className={`
                        shrink-0
                        rounded-none
                        px-2.5
                        py-1
                        font-mono
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-wider
                        ${getRoleStyle(item.role)}
                      `}
                    >
                      {item.role || "user"}
                    </span>
                  </div>

                  {item.id === user?.id && (
                    <span className="mt-2 inline-block rounded-none border border-[#161616] bg-[#1D4ED8] px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase !text-[#FFFDF9]">
                      Akun kamu
                    </span>
                  )}
                </div>
              </div>

              <div
                className="
                  mt-5
                  grid
                  grid-cols-2
                  gap-4
                  border-t-2
                  border-dashed
                  border-[#161616]
                  pt-4
                "
              >
                <div className="min-w-0">
                  <p className="font-mono text-[11px] font-bold uppercase !text-[#161616]">
                    Bergabung
                  </p>

                  <p className="mt-1 truncate font-mono text-xs font-bold !text-[#161616]">
                    {formatDate(item.created_at)}
                  </p>
                </div>

                <div className="min-w-0">
                  <p className="font-mono text-[11px] font-bold uppercase !text-[#161616]">
                    Status
                  </p>

                  <p className="mt-1 flex items-center gap-2 font-mono text-xs font-bold uppercase !text-[#161616]">
                    <span className="h-2 w-2 shrink-0 rounded-none bg-[#1D4ED8]"></span>
                    Aktif
                  </p>
                </div>
              </div>

              <Link
                to={`/admin/users/${item.id}`}
                className="
                  mt-5
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-none
                  border-2
                  border-[#161616]
                  bg-[#F4EFE6]
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
                "
              >
                <i className="ri-eye-line text-base"></i>
                <span>Lihat Detail</span>
              </Link>
            </article>
          ))}
        </div>
      )}

      {/* EMPTY */}
      {!loading && !error && filteredUsers.length === 0 && (
        <div
          className="
            mt-6
            flex
            min-h-[300px]
            flex-col
            items-center
            justify-center
            rounded-none
            border-2
            border-[#161616]
            bg-[#FFFDF9]
            px-6
            py-12
            text-center
            shadow-[6px_6px_0px_#161616]
          "
        >
          <div
            className="
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-none
              border-2
              border-[#161616]
              bg-[#F4EFE6]
              !text-[#161616]
              shadow-[4px_4px_0px_#161616]
            "
          >
            <i
              className={`
                ${users.length === 0 ? "ri-user-line" : "ri-search-line"}
                text-2xl
              `}
            ></i>
          </div>

          <h2
            style={{ fontFamily: "'Syne', 'Space Grotesk', sans-serif" }}
            className="mt-5 text-lg font-extrabold uppercase !text-[#161616]"
          >
            {users.length === 0
              ? "Belum Ada Pengguna"
              : "Pengguna Tidak Ditemukan"}
          </h2>

          <p className="mt-2 max-w-sm font-mono text-xs leading-6 !text-[#161616]">
            {users.length === 0
              ? "Akun pengguna yang terdaftar akan muncul di halaman ini."
              : "Tidak ada pengguna yang sesuai dengan pencarian atau filter."}
          </p>

          {users.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setRoleFilter("Semua");
              }}
              className="
                mt-5
                rounded-none
                border-2
                border-[#161616]
                bg-[#D94826]
                px-5
                py-2.5
                font-mono
                text-xs
                font-bold
                uppercase
                tracking-wider
                !text-[#FFFDF9]
                shadow-[4px_4px_0px_#161616]
                transition
                hover:-translate-x-0.5
                hover:-translate-y-0.5
                hover:shadow-[5px_5px_0px_#161616]
              "
            >
              Reset Filter
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// =========================
// STAT CARD
// =========================
function StatCard({ icon, label, value, accentClass = "bg-[#F4EFE6] !text-[#161616]" }) {
  return (
    <div
      className="
        min-w-0
        rounded-none
        border-2
        border-[#161616]
        bg-[#FFFDF9]
        p-5
        shadow-[5px_5px_0px_#161616]
        transition
        hover:-translate-x-0.5
        hover:-translate-y-0.5
        hover:shadow-[6px_6px_0px_#161616]
      "
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-xs font-bold uppercase tracking-wider !text-[#161616]">
            {label}
          </p>

          <p
            style={{ fontFamily: "'Syne', 'Space Grotesk', sans-serif" }}
            className="mt-2 truncate text-2xl font-extrabold !text-[#161616]"
          >
            {value}
          </p>
        </div>

        <div
          className={`
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-none
            border-2
            border-[#161616]
            shadow-[3px_3px_0px_#161616]
            ${accentClass}
          `}
        >
          <i className={`${icon} text-xl`}></i>
        </div>
      </div>
    </div>
  );
}

function TableHeader({ children }) {
  return (
    <th
      className="
        whitespace-nowrap
        px-5
        py-4
        text-left
        font-mono
        text-xs
        font-bold
        uppercase
        tracking-wider
        !text-[#161616]
      "
    >
      {children}
    </th>
  );
}

function TableCell({ children }) {
  return <td className="min-w-0 px-5 py-4 align-middle">{children}</td>;
}

export default AdminUsers;