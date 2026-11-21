import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

function AdminDashboard() {
  const { profile } = useAuth();

  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [profiles, setProfiles] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // FETCH DASHBOARD DATA
  // =========================
  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [eventsResponse, bookingsResponse, profilesResponse] =
        await Promise.all([
          supabase.from("events").select("*").order("created_at", {
            ascending: false,
          }),

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
              location
            )
          `,
            )
            .order("created_at", {
              ascending: false,
            }),

          supabase
            .from("profiles")
            .select("id, username, name, role, created_at")
            .order("created_at", {
              ascending: false,
            }),
        ]);

      if (eventsResponse.error) {
        throw eventsResponse.error;
      }

      if (bookingsResponse.error) {
        throw bookingsResponse.error;
      }

      if (profilesResponse.error) {
        throw profilesResponse.error;
      }

      setEvents(eventsResponse.data ?? []);
      setBookings(bookingsResponse.data ?? []);
      setProfiles(profilesResponse.data ?? []);
    } catch (err) {
      console.error("Gagal mengambil data dashboard:", err);

      setError(err.message || "Data dashboard gagal dimuat.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // =========================
  // FORMAT PRICE
  // =========================
  const formatPrice = (price) => {
    const number = Number(price) || 0;

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
    }).format(new Date(`${date}T00:00:00`));
  };

  // =========================
  // FORMAT BOOKING DATE
  // =========================
  const formatBookingDate = (date) => {
    if (!date) return "-";

    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  // =========================
  // DASHBOARD STATISTICS
  // =========================
  const statistics = useMemo(() => {
    // Booking dibatalkan tidak dihitung
    const validBookings = bookings.filter(
      (booking) => booking.status?.toLowerCase() !== "dibatalkan",
    );

    const totalTickets = validBookings.reduce(
      (total, booking) => total + Number(booking.quantity || 0),
      0,
    );

    const revenue = validBookings.reduce(
      (total, booking) => total + Number(booking.total_price || 0),
      0,
    );

    const totalUsers = profiles.filter(
      (item) => item.role?.toLowerCase() === "user",
    ).length;

    return {
      events: events.length,
      tickets: totalTickets,
      users: totalUsers,
      revenue,
    };
  }, [events, bookings, profiles]);

  // =========================
  // LATEST EVENTS
  // =========================
  const latestEvents = events.slice(0, 5);

  // =========================
  // LATEST BOOKINGS
  // =========================
  const latestBookings = bookings.slice(0, 5);

  // =========================
  // STATUS STYLE
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

  const stats = [
    {
      label: "Total Event",
      value: statistics.events,
      description: "Event tersedia",
      icon: "ri-calendar-event-line",
      accentClass: "bg-[#D94826] !text-[#FFFDF9]",
    },
    {
      label: "Total Tiket",
      value: statistics.tickets,
      description: "Tiket terjual",
      icon: "ri-ticket-2-line",
      accentClass: "bg-[#1D4ED8] !text-[#FFFDF9]",
    },
    {
      label: "Pengguna",
      value: statistics.users,
      description: "Akun terdaftar",
      icon: "ri-user-3-line",
      accentClass: "bg-[#F4EFE6] !text-[#161616]",
    },
    {
      label: "Pendapatan",
      value: formatPrice(statistics.revenue),
      description: "Total transaksi",
      icon: "ri-wallet-3-line",
      accentClass: "bg-[#D94826] !text-[#FFFDF9]",
    },
  ];

  return (
    <div className="min-w-0 bg-[#F4EFE6] !text-[#161616]">
      {/* =========================
          HEADER
      ========================== */}
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
          <div className="flex flex-wrap items-center gap-2">

            <span
              className="
                rounded-none
                border-2
                border-[#161616]
                bg-[#FFFDF9]
                px-2.5
                py-1
                font-mono
                text-xs
                font-bold
                uppercase
                mb-5
                !text-[#161616]
              "
            >
              Dashboard
            </span>
          </div>

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
            Selamat datang
            {profile?.name ? `, ${profile.name}` : ""}
          </h1>

          <p className="mt-2 font-mono text-xs sm:text-sm !text-[#161616]">
            Pantau event, tiket, pengguna, dan transaksi MASUKVENUE.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchDashboard}
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

      {/* =========================
          ERROR
      ========================== */}
      {error && (
        <div
          className="
            mt-6
            flex
            min-w-0
            items-start
            gap-3
            rounded-none
            border-2
            border-[#161616]
            bg-[#D94826]
            p-4
            !text-[#FFFDF9]
            shadow-[5px_5px_0px_#161616]
          "
        >
          <i className="ri-error-warning-line mt-0.5 shrink-0 text-xl !text-[#FFFDF9]"></i>

          <div className="min-w-0">
            <p
              style={{ fontFamily: "'Syne', 'Space Grotesk', sans-serif" }}
              className="text-sm font-extrabold uppercase !text-[#FFFDF9]"
            >
              Dashboard gagal dimuat
            </p>

            <p className="mt-1 break-words font-mono text-xs !text-[#FFFDF9]">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* =========================
          STATISTICS
      ========================== */}
      <div className="mt-8 grid min-w-0 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.label}
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
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-mono text-xs font-bold uppercase tracking-wider !text-[#161616]">
                  {item.label}
                </p>

                {loading ? (
                  <div className="mt-3 h-9 w-24 animate-pulse rounded-none border-2 border-[#161616] bg-[#F4EFE6]" />
                ) : (
                  <p
                    style={{ fontFamily: "'Syne', 'Space Grotesk', sans-serif" }}
                    className={`
                      mt-2
                      truncate
                      font-extrabold
                      !text-[#161616]
                      ${item.label === "Pendapatan" ? "text-xl sm:text-2xl" : "text-3xl"}
                    `}
                  >
                    {item.value}
                  </p>
                )}

                <p className="mt-2 border-t border-dashed border-[#161616] pt-2 font-mono text-xs !text-[#161616]">
                  {item.description}
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
                  ${item.accentClass}
                `}
              >
                <i className={`${item.icon} text-xl`}></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* =========================
          CONTENT
      ========================== */}
      <div className="mt-8 grid min-w-0 gap-6 xl:grid-cols-5">
        {/* =========================
            EVENT TERBARU
        ========================== */}
        <section
          className="
            min-w-0
            overflow-hidden
            rounded-none
            border-2
            border-[#161616]
            bg-[#FFFDF9]
            shadow-[6px_6px_0px_#161616]
            xl:col-span-3
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
                Event Terbaru
              </h2>

              <p className="mt-0.5 font-mono text-xs !text-[#161616]">
                Event yang baru ditambahkan
              </p>
            </div>

            <Link
              to="/admin/events"
              className="
                inline-flex
                shrink-0
                items-center
                gap-1
                rounded-none
                border-2
                border-[#161616]
                bg-[#FFFDF9]
                px-3
                py-1.5
                font-mono
                text-xs
                font-bold
                uppercase
                !text-[#161616]
                shadow-[3px_3px_0px_#161616]
                transition
                hover:bg-[#1D4ED8]
                hover:!text-[#FFFDF9]
              "
            >
              <span>Lihat Semua</span>
              <i className="ri-arrow-right-line"></i>
            </Link>
          </div>

          {/* Loading */}
          {loading && (
            <div className="space-y-3 p-5 sm:p-6">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="
                    h-16
                    animate-pulse
                    rounded-none
                    border-2
                    border-[#161616]
                    bg-[#F4EFE6]
                  "
                />
              ))}
            </div>
          )}

          {/* Events */}
          {!loading && latestEvents.length > 0 && (
            <div className="divide-y-2 divide-dashed divide-[#161616]">
              {latestEvents.map((event) => (
                <div
                  key={event.id}
                  className="
                    flex
                    min-w-0
                    items-center
                    gap-4
                    px-5
                    py-4
                    transition
                    hover:bg-[#F4EFE6]
                    sm:px-6
                  "
                >
                  {/* Image */}
                  {event.image ? (
                    <img
                      src={event.image}
                      alt={event.title}
                      className="
                        h-12
                        w-12
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
                        h-12
                        w-12
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
                      <i className="ri-image-line text-lg"></i>
                    </div>
                  )}

                  {/* Information */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-mono text-sm font-bold !text-[#161616]">
                      {event.title}
                    </p>

                    <div
                      className="
                        mt-1
                        flex
                        flex-wrap
                        items-center
                        gap-x-3
                        gap-y-1
                        font-mono
                        text-xs
                        !text-[#161616]
                      "
                    >
                      <span className="flex items-center gap-1">
                        <i className="ri-calendar-line text-[#D94826]"></i>
                        {formatDate(event.date)}
                      </span>

                      {event.location && (
                        <span className="hidden min-w-0 items-center gap-1 sm:flex">
                          <i className="ri-map-pin-line shrink-0 text-[#1D4ED8]"></i>
                          <span className="max-w-[180px] truncate">
                            {event.location}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Edit */}
                  <Link
                    to={`/admin/events/${event.id}/edit`}
                    title="Edit event"
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
                      !text-[#161616]
                      shadow-[3px_3px_0px_#161616]
                      transition
                      hover:bg-[#D94826]
                      hover:!text-[#FFFDF9]
                    "
                  >
                    <i className="ri-edit-line"></i>
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* Empty */}
          {!loading && latestEvents.length === 0 && (
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
                <i className="ri-calendar-event-line text-2xl"></i>
              </div>

              <p
                style={{ fontFamily: "'Syne', 'Space Grotesk', sans-serif" }}
                className="mt-4 text-base font-extrabold uppercase !text-[#161616]"
              >
                Belum Ada Event
              </p>

              <p className="mt-2 font-mono text-xs !text-[#161616]">
                Tambahkan event pertama untuk mulai menerima pesanan.
              </p>

              <Link
                to="/admin/events/create"
                className="
                  mt-5
                  inline-block
                  rounded-none
                  border-2
                  border-[#161616]
                  bg-[#D94826]
                  px-4
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
                Tambah Event
              </Link>
            </div>
          )}
        </section>

        {/* =========================
            PESANAN TERBARU
        ========================== */}
        <section
          className="
            min-w-0
            overflow-hidden
            rounded-none
            border-2
            border-[#161616]
            bg-[#FFFDF9]
            shadow-[6px_6px_0px_#161616]
            xl:col-span-2
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
            "
          >
            <div className="min-w-0">
              <h2
                style={{ fontFamily: "'Syne', 'Space Grotesk', sans-serif" }}
                className="text-lg font-extrabold uppercase tracking-tight !text-[#161616]"
              >
                Pesanan Terbaru
              </h2>

              <p className="mt-0.5 font-mono text-xs !text-[#161616]">
                Transaksi terbaru pengguna
              </p>
            </div>

            <Link
              to="/admin/bookings"
              className="
                inline-flex
                shrink-0
                items-center
                gap-1
                rounded-none
                border-2
                border-[#161616]
                bg-[#FFFDF9]
                px-3
                py-1.5
                font-mono
                text-xs
                font-bold
                uppercase
                !text-[#161616]
                shadow-[3px_3px_0px_#161616]
                transition
                hover:bg-[#1D4ED8]
                hover:!text-[#FFFDF9]
              "
            >
              <span>Lihat Semua</span>
              <i className="ri-arrow-right-line"></i>
            </Link>
          </div>

          {/* Loading */}
          {loading && (
            <div className="space-y-3 p-5">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="
                    h-20
                    animate-pulse
                    rounded-none
                    border-2
                    border-[#161616]
                    bg-[#F4EFE6]
                  "
                />
              ))}
            </div>
          )}

          {/* Booking */}
          {!loading && latestBookings.length > 0 && (
            <div className="divide-y-2 divide-dashed divide-[#161616]">
              {latestBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="
                    min-w-0
                    px-5
                    py-4
                    transition
                    hover:bg-[#F4EFE6]
                  "
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-mono text-sm font-bold !text-[#161616]">
                        {booking.event?.title || "Event tidak tersedia"}
                      </p>

                      <p className="mt-1 truncate font-mono text-xs !text-[#161616]">
                        {booking.ticket_code || "-"}
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
                        ${getStatusStyle(booking.status)}
                      `}
                    >
                      {booking.status || "Aktif"}
                    </span>
                  </div>

                  <div
                    className="
                      mt-3
                      flex
                      items-center
                      justify-between
                      gap-3
                      border-t
                      border-dashed
                      border-[#161616]
                      pt-2.5
                    "
                  >
                    <span className="font-mono text-xs !text-[#161616]">
                      {formatBookingDate(booking.created_at)}
                    </span>

                    <span className="font-mono text-sm font-bold !text-[#D94826]">
                      {formatPrice(booking.total_price)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty */}
          {!loading && latestBookings.length === 0 && (
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

              <p
                style={{ fontFamily: "'Syne', 'Space Grotesk', sans-serif" }}
                className="mt-4 text-base font-extrabold uppercase !text-[#161616]"
              >
                Belum Ada Pesanan
              </p>

              <p className="mt-2 max-w-xs font-mono text-xs leading-6 !text-[#161616]">
                Pesanan pengguna akan muncul di sini.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default AdminDashboard;