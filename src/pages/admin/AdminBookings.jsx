import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";

function AdminUserDetail() {
  const { id } = useParams();

  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // FETCH USER DETAIL
  // =========================
  const fetchUserDetail = async () => {
    try {
      setLoading(true);
      setError("");

      const [profileResponse, bookingsResponse] = await Promise.all([
        supabase
          .from("profiles")
          .select("id, username, name, role, created_at")
          .eq("id", id)
          .single(),

        supabase
          .from("bookings")
          .select(
            `
              *,
              event:events (
                id,
                title,
                image,
                date,
                location,
                category
              )
            `,
          )
          .eq("user_id", id)
          .order("created_at", {
            ascending: false,
          }),
      ]);

      if (profileResponse.error) {
        throw profileResponse.error;
      }

      if (bookingsResponse.error) {
        throw bookingsResponse.error;
      }

      setProfile(profileResponse.data);
      setBookings(bookingsResponse.data ?? []);
    } catch (err) {
      console.error("Gagal mengambil detail pengguna:", err);

      setError(err.message || "Detail pengguna gagal dimuat.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetail();
  }, [id]);

  // =========================
  // FORMAT PRICE
  // =========================
  const formatPrice = (price) => {
    const number = Number(price) || 0;

    if (number === 0) {
      return "Gratis";
    }

    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(number);
  };

  // =========================
  // FORMAT DATE
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
  // EVENT DATE
  // =========================
  const formatEventDate = (date) => {
    if (!date) return "-";

    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(`${date}T00:00:00`));
  };

  // =========================
  // STATUS
  // =========================
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "aktif":
        return "border-2 border-[#161616] bg-[#FFFDF9] !text-[#161616]";

      case "selesai":
        return "border-2 border-[#161616] bg-[#1D4ED8] !text-[#FFFDF9]";

      case "dibatalkan":
        return "border-2 border-[#161616] bg-[#D94826] !text-[#FFFDF9]";

      default:
        return "border-2 border-[#161616] bg-[#F4EFE6] !text-[#161616]";
    }
  };

  // =========================
  // STATISTICS
  // =========================
  const statistics = useMemo(() => {
    const validBookings = bookings.filter(
      (booking) => booking.status?.toLowerCase() !== "dibatalkan",
    );

    const totalTickets = validBookings.reduce(
      (total, booking) => total + Number(booking.quantity || 0),
      0,
    );

    const totalTransaction = validBookings.reduce(
      (total, booking) => total + Number(booking.total_price || 0),
      0,
    );

    return {
      bookings: bookings.length,
      tickets: totalTickets,
      transaction: totalTransaction,
    };
  }, [bookings]);

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div
        className="
          flex
          min-h-[450px]
          min-w-0
          items-center
          justify-center
          rounded-none
          border-2
          border-[#161616]
          bg-[#FFFDF9]
          shadow-[6px_6px_0px_#161616]
        "
      >
        <div className="text-center">
          <i className="ri-loader-4-line inline-block animate-spin text-3xl !text-[#D94826]"></i>

          <p className="mt-4 font-mono text-xs font-bold uppercase tracking-wider !text-[#161616]">
            Memuat detail pengguna...
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================
  if (error || !profile) {
    return (
      <div className="min-w-0 bg-[#F4EFE6] !text-[#161616]">
        <Link
          to="/admin/users"
          className="
            inline-flex
            w-fit
            items-center
            gap-2
            rounded-none
            border-2
            border-[#161616]
            bg-[#FFFDF9]
            px-4
            py-2
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
          "
        >
          <i className="ri-arrow-left-line"></i>
          <span>Kembali ke Pengguna</span>
        </Link>

        <div
          className="
            mt-6
            flex
            min-h-[350px]
            min-w-0
            flex-col
            items-center
            justify-center
            rounded-none
            border-2
            border-[#161616]
            bg-[#FFFDF9]
            px-6
            text-center
            shadow-[6px_6px_0px_#161616]
          "
        >
          <div
            className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-none
              border-2
              border-[#161616]
              bg-[#D94826]
              !text-[#FFFDF9]
              shadow-[4px_4px_0px_#161616]
            "
          >
            <i className="ri-user-unfollow-line text-2xl"></i>
          </div>

          <h2
            style={{ fontFamily: "'Syne', 'Space Grotesk', sans-serif" }}
            className="!mt-5 text-xl font-extrabold uppercase !text-[#161616]"
          >
            Pengguna Tidak Ditemukan
          </h2>

          <p className="!mt-2 max-w-sm break-words font-mono text-xs !text-[#161616]">
            {error || "Data pengguna yang kamu cari tidak tersedia."}
          </p>
        </div>
      </div>
    );
  }

  const initial = (profile.name || profile.username || "U")
    .charAt(0)
    .toUpperCase();

  return (
    <div className="min-w-0 bg-[#F4EFE6] !text-[#161616]">
      {/* TOP BAR: BACK + BRAND */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/admin/users"
          className="
            inline-flex
            w-fit
            items-center
            gap-2
            rounded-none
            border-2
            border-[#161616]
            bg-[#FFFDF9]
            px-4
            py-2
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
          "
        >
          <i className="ri-arrow-left-line"></i>
          <span>Kembali ke Pengguna</span>
        </Link>

      </div>

      {/* =========================
          PROFILE
      ========================== */}
      <section
        className="
          mt-6
          min-w-0
          rounded-none
          border-2
          border-[#161616]
          bg-[#FFFDF9]
          p-5
          shadow-[6px_6px_0px_#161616]
          sm:p-6
        "
      >
        <div
          className="
            flex
            min-w-0
            flex-col
            gap-5
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div className="flex min-w-0 items-center gap-4">
            {/* Avatar */}
            <div
              className="
                flex
                h-16
                w-16
                shrink-0
                items-center
                justify-center
                rounded-none
                border-2
                border-[#161616]
                bg-[#F4EFE6]
                font-mono
                text-2xl
                font-bold
                uppercase
                !text-[#161616]
                shadow-[4px_4px_0px_#161616]
              "
            >
              {initial}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1
                  style={{ fontFamily: "'Syne', 'Space Grotesk', sans-serif" }}
                  className="truncate text-xl font-extrabold uppercase tracking-tight !text-[#161616] sm:text-2xl"
                >
                  {profile.name || "Tanpa nama"}
                </h1>

                <span
                  className={`
                    rounded-none
                    border-2
                    border-[#161616]
                    px-2.5
                    py-1
                    font-mono
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-wider
                    shadow-[2px_2px_0px_#161616]
                    ${
                      profile.role === "admin"
                        ? "bg-[#D94826] !text-[#FFFDF9]"
                        : "bg-[#1D4ED8] !text-[#FFFDF9]"
                    }
                  `}
                >
                  {profile.role || "user"}
                </span>
              </div>

              <p className="mt-1 truncate font-mono text-xs sm:text-sm !text-[#161616]">
                @{profile.username || "-"}
              </p>
            </div>
          </div>

          {/* Active */}
          <div
            className="
              inline-flex
              w-fit
              shrink-0
              items-center
              gap-2
              rounded-none
              border-2
              border-[#161616]
              bg-[#F4EFE6]
              px-3.5
              py-2
              font-mono
              text-xs
              font-bold
              uppercase
              tracking-wider
              !text-[#161616]
              shadow-[3px_3px_0px_#161616]
            "
          >
            <span className="h-2.5 w-2.5 rounded-none bg-[#1D4ED8]"></span>
            <span>Aktif</span>
          </div>
        </div>

        {/* PROFILE INFO */}
        <div
          className="
            mt-6
            grid
            min-w-0
            gap-5
            border-t-2
            border-dashed
            border-[#161616]
            pt-6
            sm:grid-cols-2
            lg:grid-cols-3
          "
        >
          <div className="min-w-0">
            <p className="font-mono text-[11px] font-bold uppercase tracking-wider !text-[#161616]">
              Username
            </p>

            <p className="mt-1 truncate font-mono text-sm font-bold !text-[#161616]">
              @{profile.username || "-"}
            </p>
          </div>

          <div className="min-w-0">
            <p className="font-mono text-[11px] font-bold uppercase tracking-wider !text-[#161616]">
              Role
            </p>

            <p className="mt-1 truncate font-mono text-sm font-bold uppercase !text-[#161616]">
              {profile.role || "user"}
            </p>
          </div>

          <div className="min-w-0">
            <p className="font-mono text-[11px] font-bold uppercase tracking-wider !text-[#161616]">
              Bergabung
            </p>

            <p className="mt-1 truncate font-mono text-sm font-bold !text-[#161616]">
              {formatDate(profile.created_at)}
            </p>
          </div>
        </div>
      </section>

      {/* =========================
          STATISTICS
      ========================== */}
      <div className="mt-6 grid min-w-0 gap-5 sm:grid-cols-3">
        <StatCard
          icon="ri-file-list-3-line"
          label="Total Pesanan"
          value={statistics.bookings}
          accentClass="bg-[#F4EFE6] !text-[#161616]"
        />

        <StatCard
          icon="ri-ticket-2-line"
          label="Total Tiket"
          value={statistics.tickets}
          accentClass="bg-[#1D4ED8] !text-[#FFFDF9]"
        />

        <StatCard
          icon="ri-wallet-3-line"
          label="Total Transaksi"
          value={formatPrice(statistics.transaction)}
          accentClass="bg-[#D94826] !text-[#FFFDF9]"
        />
      </div>

      {/* =========================
          BOOKING HISTORY
      ========================== */}
      <section
        className="
          mt-6
          min-w-0
          overflow-hidden
          rounded-none
          border-2
          border-[#161616]
          bg-[#FFFDF9]
          shadow-[6px_6px_0px_#161616]
        "
      >
        {/* Header */}
        <div
          className="
            flex
            items-center
            justify-between
            gap-4
            border-b-2
            border-[#161616]
            bg-[#F4EFE6]
            px-5
            py-4
            sm:px-6
          "
        >
          <div className="min-w-0">
            <h2
              style={{ fontFamily: "'Syne', 'Space Grotesk', sans-serif" }}
              className="text-lg font-extrabold uppercase tracking-tight !text-[#161616]"
            >
              Riwayat Pesanan
            </h2>

            <p className="mt-0.5 font-mono text-xs !text-[#161616]">
              Semua pemesanan milik pengguna ini
            </p>
          </div>

          <span
            className="
              shrink-0
              rounded-none
              border-2
              border-[#161616]
              bg-[#D94826]
              px-3
              py-1
              font-mono
              text-xs
              font-bold
              uppercase
              tracking-wider
              !text-[#FFFDF9]
              shadow-[3px_3px_0px_#161616]
            "
          >
            {bookings.length} Pesanan
          </span>
        </div>

        {/* BOOKINGS */}
        {bookings.length > 0 ? (
          <>
            {/* DESKTOP */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full border-collapse">
                <thead className="border-b-2 border-[#161616] bg-[#F4EFE6]">
                  <tr>
                    <TableHeader>Tiket</TableHeader>

                    <TableHeader>Event</TableHeader>

                    <TableHeader>Jumlah</TableHeader>

                    <TableHeader>Total</TableHeader>

                    <TableHeader>Status</TableHeader>

                    <TableHeader>Dipesan</TableHeader>
                  </tr>
                </thead>

                <tbody className="divide-y-2 divide-dashed divide-[#161616]">
                  {bookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="transition hover:bg-[#F4EFE6]"
                    >
                      <TableCell>
                        <span className="whitespace-nowrap rounded-none border border-[#161616] bg-[#F4EFE6] px-2 py-1 font-mono text-xs font-bold !text-[#1D4ED8]">
                          {booking.ticket_code || "-"}
                        </span>
                      </TableCell>

                      <TableCell>
                        <div className="flex min-w-0 max-w-[260px] items-center gap-3">
                          {booking.event?.image ? (
                            <img
                              src={booking.event.image}
                              alt={booking.event.title}
                              className="
                                h-10
                                w-10
                                shrink-0
                                rounded-none
                                border-2
                                border-[#161616]
                                object-cover
                              "
                            />
                          ) : (
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
                                !text-[#161616]
                              "
                            >
                              <i className="ri-calendar-event-line"></i>
                            </div>
                          )}

                          <div className="min-w-0">
                            <p className="truncate font-mono text-sm font-bold !text-[#161616]">
                              {booking.event?.title || "Event tidak tersedia"}
                            </p>

                            {booking.event?.date && (
                              <p className="mt-0.5 font-mono text-xs !text-[#161616]">
                                {formatEventDate(booking.event.date)}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <span className="whitespace-nowrap font-mono text-xs font-bold !text-[#161616]">
                          {booking.quantity || 0} tiket
                        </span>
                      </TableCell>

                      <TableCell>
                        <span className="whitespace-nowrap font-mono text-sm font-bold !text-[#D94826]">
                          {formatPrice(booking.total_price)}
                        </span>
                      </TableCell>

                      <TableCell>
                        <span
                          className={`
                            inline-flex
                            rounded-none
                            px-2.5
                            py-1
                            font-mono
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-wider
                            ${getStatusStyle(booking.status)}
                          `}
                        >
                          {booking.status || "Aktif"}
                        </span>
                      </TableCell>

                      <TableCell>
                        <span className="whitespace-nowrap font-mono text-xs !text-[#161616]">
                          {formatDate(booking.created_at)}
                        </span>
                      </TableCell>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE */}
            <div className="divide-y-2 divide-dashed divide-[#161616] md:hidden">
              {bookings.map((booking) => (
                <article key={booking.id} className="min-w-0 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-mono text-xs font-bold !text-[#1D4ED8]">
                        {booking.ticket_code || "-"}
                      </p>

                      <h3
                        style={{ fontFamily: "'Syne', 'Space Grotesk', sans-serif" }}
                        className="mt-1.5 break-words text-base font-extrabold uppercase !text-[#161616]"
                      >
                        {booking.event?.title || "Event tidak tersedia"}
                      </h3>
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
                        ${getStatusStyle(booking.status)}
                      `}
                    >
                      {booking.status || "Aktif"}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4 border-t border-dashed border-[#161616] pt-4">
                    <div className="min-w-0">
                      <p className="font-mono text-[11px] font-bold uppercase !text-[#161616]">
                        Jumlah
                      </p>

                      <p className="mt-1 font-mono text-xs font-bold !text-[#161616]">
                        {booking.quantity || 0} tiket
                      </p>
                    </div>

                    <div className="min-w-0">
                      <p className="font-mono text-[11px] font-bold uppercase !text-[#161616]">
                        Total
                      </p>

                      <p className="mt-1 truncate font-mono text-xs font-bold !text-[#D94826]">
                        {formatPrice(booking.total_price)}
                      </p>
                    </div>

                    <div className="min-w-0">
                      <p className="font-mono text-[11px] font-bold uppercase !text-[#161616]">
                        Tanggal Event
                      </p>

                      <p className="mt-1 font-mono text-xs !text-[#161616]">
                        {formatEventDate(booking.event?.date)}
                      </p>
                    </div>

                    <div className="min-w-0">
                      <p className="font-mono text-[11px] font-bold uppercase !text-[#161616]">
                        Dipesan
                      </p>

                      <p className="mt-1 font-mono text-xs !text-[#161616]">
                        {formatDate(booking.created_at)}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : (
          /* EMPTY BOOKING */
          <div
            className="
              flex
              min-h-[260px]
              flex-col
              items-center
              justify-center
              px-6
              py-10
              text-center
            "
          >
            <div
              className="
                flex
                h-14
                w-14
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
              <i className="ri-ticket-2-line text-2xl"></i>
            </div>

            <h3
              style={{ fontFamily: "'Syne', 'Space Grotesk', sans-serif" }}
              className="mt-4 text-base font-extrabold uppercase !text-[#161616]"
            >
              Belum Ada Pesanan
            </h3>

            <p className="mt-2 max-w-sm font-mono text-xs leading-6 !text-[#161616]">
              Pengguna ini belum pernah melakukan pemesanan tiket.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

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

export default AdminUserDetail;