import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

function MyTickets() {
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const bookingSuccess = location.state?.bookingSuccess;
  const ticketCode = location.state?.ticketCode;

  useEffect(() => {
    if (!bookingSuccess) return;

    // Tampilkan toast
    setShowSuccessToast(true);

    // Scroll ke paling atas
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    // Hilang otomatis setelah 3 detik
    const timer = setTimeout(() => {
      setShowSuccessToast(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [bookingSuccess]);

  // =========================
  // FETCH TICKETS
  // =========================
  useEffect(() => {
    const fetchTickets = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const { data, error } = await supabase
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
              category,
              price,
              status
            )
          `,
          )
          .eq("user_id", user.id)
          .order("created_at", {
            ascending: false,
          });

        if (error) {
          throw error;
        }

        console.log("TICKETS:", data);

        setTickets(data ?? []);
      } catch (err) {
        console.error("Gagal mengambil tiket:", err);

        setError(err.message || "Tiket gagal dimuat. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchTickets();
    }
  }, [user, authLoading]);

  // =========================
  // FORMAT PRICE
  // =========================
  const formatPrice = (price) => {
    const numericPrice = Number(price);

    if (numericPrice === 0) {
      return "Gratis";
    }

    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(numericPrice);
  };

  // =========================
  // FORMAT DATE
  // =========================
  const formatDate = (date) => {
    if (!date) return "-";

    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(`${date}T00:00:00`));
  };

  // =========================
  // STATUS STYLE
  // =========================
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "aktif":
      case "confirmed":
        return "border-[#161616] bg-[#1D4ED8] text-[#FFFDF9]";

      case "pending":
        return "border-[#161616] bg-[#F4EFE6] text-[#161616]";

      case "cancelled":
      case "dibatalkan":
        return "border-[#161616] bg-[#D94826] text-[#FFFDF9]";

      case "selesai":
        return "border-[#161616]/40 bg-[#F4EFE6] text-[#161616]/65";

      default:
        return "border-[#161616] bg-[#1D4ED8] text-[#FFFDF9]";
    }
  };

  // =========================
  // AUTH LOADING
  // =========================
  if (authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F4EFE6] px-4 text-[#161616]">
        <div className="rounded-none border-2 border-[#161616] bg-[#FFFDF9] px-8 py-10 text-center shadow-[5px_5px_0px_#161616]">
          <i className="ri-loader-4-line inline-block animate-spin text-3xl text-[#D94826]"></i>

          <p className="mt-4 font-mono text-xs uppercase tracking-wider text-[#161616]/75">
            Memeriksa akun...
          </p>
        </div>
      </main>
    );
  }

  // =========================
  // NOT LOGIN
  // =========================
  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F4EFE6] px-4 pt-20 text-[#161616]">
        <div className="w-full max-w-md rounded-none border-2 border-[#161616] bg-[#FFFDF9] p-8 text-center shadow-[6px_6px_0px_#161616]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-none border-2 border-[#161616] bg-[#D94826] text-[#FFFDF9]">
            <i className="ri-ticket-2-line text-2xl"></i>
          </div>

          <h1 className="mt-5 text-2xl font-extrabold uppercase tracking-tight !text-[#161616]">
            Login diperlukan
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#161616]/75">
            Masuk ke akun MASUKVENUE kamu untuk melihat tiket event yang sudah
            kamu pesan.
          </p>

          <Link
            to="/login"
            state={{
              from: "/my-tickets",
            }}
            className="
              mt-6
              flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-none
              border-2
              border-[#161616]
              bg-[#161616]
              px-5
              py-3
              font-mono
              text-xs
              font-bold
              uppercase
              tracking-wider
              text-[#FFFDF9]
              shadow-[4px_4px_0px_#D94826]
              transition
              hover:bg-[#D94826]
            "
          >
            <i className="ri-login-box-line"></i>
            <span>Masuk</span>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F4EFE6] pb-20 pt-28 text-[#161616] sm:pt-32">
      <div className="container-app min-w-0">
        {/* =========================
            SUCCESS NOTIFICATION
        ========================== */}
        {showSuccessToast && (
          <div
            className="
              fixed
              right-4
              top-24
              z-[9999]
              w-[calc(100%-2rem)]
              max-w-sm
              rounded-none
              border-2
              border-[#161616]
              bg-[#FFFDF9]
              p-4
              text-[#161616]
              shadow-[6px_6px_0px_#161616]
              sm:right-6
            "
          >
            <div className="flex items-start gap-3">
              {/* Icon */}
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
                  text-[#FFFDF9]
                "
              >
                <i className="ri-checkbox-circle-fill text-xl"></i>
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <p className="font-mono text-xs font-bold uppercase tracking-wider !text-[#161616]">
                  Pemesanan berhasil!
                </p>

                <p className="mt-1 text-xs leading-5 text-[#161616]/75 sm:text-sm">
                  Tiketmu berhasil dibuat dan sudah tersedia.
                </p>

                {ticketCode && (
                  <div className="mt-3 rounded-none border border-dashed border-[#161616] bg-[#F4EFE6] px-3 py-2">
                    <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#161616]/60">
                      Kode Tiket
                    </p>

                    <p className="mt-0.5 break-all font-mono text-xs font-bold text-[#D94826] sm:text-sm">
                      {ticketCode}
                    </p>
                  </div>
                )}
              </div>

              {/* Close */}
              <button
                type="button"
                onClick={() => setShowSuccessToast(false)}
                aria-label="Tutup notifikasi"
                className="
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-none
                  border
                  border-[#161616]
                  bg-[#F4EFE6]
                  text-[#161616]
                  transition
                  hover:bg-[#D94826]
                  hover:text-[#FFFDF9]
                "
              >
                <i className="ri-close-line text-lg"></i>
              </button>
            </div>
          </div>
        )}

        {/* =========================
            HEADER
        ========================== */}
        <div className="min-w-0 max-w-2xl">
          <div className="inline-flex items-center gap-2 border border-[#161616] bg-[#FFFDF9] px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-[#D94826]">
            <i className="ri-ticket-2-line text-sm"></i>
            <span>MASUKVENUE // PASS WALLET</span>
          </div>

          <h1 className="mt-4 text-3xl font-extrabold uppercase leading-[1.02] tracking-tight !text-[#161616] sm:text-4xl lg:text-5xl">
            Event yang Akan{" "}
            <span className="inline-block bg-[#D94826] px-2.5 py-0.5 !text-[#FFFDF9]">
              Kamu Hadiri
            </span>
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-7 text-[#161616]/80 sm:text-base">
            Kelola dan lihat semua tiket event yang sudah kamu pesan.
          </p>
        </div>

        {/* =========================
            TICKET COUNT
        ========================== */}
        <div
          className="
            mt-10
            flex
            flex-col
            gap-4
            border-b-2
            border-[#161616]
            pb-5
            sm:flex-row
            sm:items-end
            sm:justify-between
          "
        >
          <div className="min-w-0">
            <h2 className="text-xl font-extrabold uppercase tracking-tight !text-[#161616]">
              Tiket Saya
            </h2>

            {!loading && !error && (
              <p className="mt-1 font-mono text-xs uppercase tracking-wider text-[#161616]/75">
                <span className="font-bold text-[#1D4ED8]">
                  {tickets.length}
                </span>{" "}
                pemesanan ditemukan
              </p>
            )}
          </div>

          <Link
            to="/events"
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
              text-[#161616]
              shadow-[3px_3px_0px_#161616]
              transition
              hover:-translate-x-0.5
              hover:-translate-y-0.5
              hover:bg-[#1D4ED8]
              hover:text-[#FFFDF9]
            "
          >
            <span>Cari Event Lain</span>
            <i className="ri-arrow-right-line"></i>
          </Link>
        </div>

        {/* =========================
            LOADING
        ========================== */}
        {loading && (
          <div className="mt-7 rounded-none border-2 border-dashed border-[#161616] bg-[#FFFDF9] px-6 py-16 text-center">
            <i className="ri-loader-4-line inline-block animate-spin text-3xl text-[#D94826]"></i>

            <p className="mt-4 font-mono text-xs uppercase tracking-wider text-[#161616]/75">
              Memuat tiketmu...
            </p>
          </div>
        )}

        {/* =========================
            ERROR
        ========================== */}
        {!loading && error && (
          <div className="mt-7 rounded-none border-2 border-[#D94826] bg-[#FFFDF9] px-6 py-16 text-center shadow-[4px_4px_0px_#D94826]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-none border-2 border-[#161616] bg-[#D94826] text-[#FFFDF9]">
              <i className="ri-error-warning-line text-2xl"></i>
            </div>

            <h2 className="mt-4 text-xl font-extrabold uppercase tracking-tight !text-[#161616]">
              Tiket gagal dimuat
            </h2>

            <p className="mt-2 text-sm text-[#161616]/75">{error}</p>
          </div>
        )}

        {/* =========================
            TICKETS
        ========================== */}
        {!loading && !error && tickets.length > 0 && (
          <div className="mt-7 grid grid-cols-1 gap-6">
            {tickets.map((ticket) => {
              const event = ticket.event;

              if (!event) return null;

              return (
                <article
                  key={ticket.id}
                  className="
                    group
                    min-w-0
                    overflow-hidden
                    rounded-none
                    border-2
                    border-[#161616]
                    bg-[#FFFDF9]
                    text-[#161616]
                    shadow-[5px_5px_0px_#161616]
                    transition-all
                    duration-150
                    hover:-translate-x-0.5
                    hover:-translate-y-0.5
                    hover:shadow-[7px_7px_0px_#161616]
                  "
                >
                  <div className="grid grid-cols-1 md:grid-cols-[240px_minmax(0,1fr)_auto]">
                    {/* =====================
                        IMAGE
                    ====================== */}
                    <div className="relative h-52 overflow-hidden border-b-2 border-[#161616] bg-[#EAE3D5] md:h-full md:min-h-[230px] md:border-b-0 md:border-r-2">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="
                          h-full
                          w-full
                          object-cover
                          contrast-105
                          transition-transform
                          duration-300
                          group-hover:scale-105
                        "
                      />

                      <span
                        className="
                          absolute
                          left-3
                          top-3
                          border
                          border-[#161616]
                          bg-[#FFFDF9]
                          px-2.5
                          py-1
                          font-mono
                          text-[11px]
                          font-bold
                          uppercase
                          tracking-wider
                          text-[#1D4ED8]
                        "
                      >
                        {event.category}
                      </span>
                    </div>

                    {/* =====================
                        INFORMATION
                    ====================== */}
                    <div className="min-w-0 p-5 md:p-6">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span
                          className={`
                            inline-flex
                            items-center
                            gap-1.5
                            rounded-none
                            border
                            px-2.5
                            py-1
                            font-mono
                            text-[11px]
                            font-bold
                            uppercase
                            tracking-wider
                            ${getStatusStyle(ticket.status)}
                          `}
                        >
                          <span className="h-1.5 w-1.5 bg-current" />

                          {ticket.status}
                        </span>

                        <span className="inline-flex min-w-0 items-center gap-1.5 border border-[#161616]/25 bg-[#F4EFE6] px-2.5 py-1 font-mono text-xs font-semibold text-[#161616]">
                          <i className="ri-qr-code-line shrink-0 text-[#D94826]"></i>
                          <span className="truncate">{ticket.ticket_code}</span>
                        </span>
                      </div>

                      <h2
                        className="
                          mt-4
                          line-clamp-2
                          text-xl
                          font-extrabold
                          leading-snug
                          tracking-tight
                          !text-[#161616]
                          md:text-2xl
                        "
                      >
                        {event.title}
                      </h2>

                      <div className="mt-3 flex items-start gap-2 text-sm text-[#161616]/75">
                        <i className="ri-map-pin-line mt-0.5 shrink-0 text-base text-[#1D4ED8]"></i>

                        <span className="min-w-0 break-words">
                          {event.location}
                        </span>
                      </div>

                      {/* Information */}
                      <div
                        className="
                          mt-6
                          grid
                          grid-cols-1
                          gap-4
                          border-t-2
                          border-dashed
                          border-[#161616]/25
                          pt-5
                          sm:grid-cols-3
                        "
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-[#161616]/60">
                            <i className="ri-calendar-line"></i>
                            <span>Tanggal Event</span>
                          </div>

                          <p className="mt-1.5 text-sm font-bold text-[#161616]">
                            {formatDate(event.date)}
                          </p>
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-[#161616]/60">
                            <i className="ri-ticket-line"></i>
                            <span>Jumlah</span>
                          </div>

                          <p className="mt-1.5 font-mono text-sm font-bold text-[#161616]">
                            {ticket.quantity} tiket
                          </p>
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-[#161616]/60">
                            <i className="ri-wallet-3-line"></i>
                            <span>Total</span>
                          </div>

                          <p className="mt-1.5 truncate font-mono text-sm font-bold text-[#D94826]">
                            {formatPrice(ticket.total_price)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* =====================
                        ACTION / STUB
                    ====================== */}
                    <div
                      className="
                        flex
                        items-center
                        border-t-2
                        border-dashed
                        border-[#161616]/35
                        bg-[#F4EFE6]/60
                        p-5
                        md:border-l-2
                        md:border-t-0
                        md:p-6
                      "
                    >
                      <Link
                        to={`/my-tickets/${ticket.id}`}
                        className="
                          flex
                          w-full
                          items-center
                          justify-center
                          gap-2
                          whitespace-nowrap
                          rounded-none
                          border-2
                          border-[#161616]
                          bg-[#161616]
                          px-5
                          py-3
                          font-mono
                          text-xs
                          font-bold
                          uppercase
                          tracking-wider
                          text-[#FFFDF9]
                          shadow-[3px_3px_0px_#D94826]
                          transition
                          hover:-translate-x-0.5
                          hover:-translate-y-0.5
                          hover:bg-[#D94826]
                          md:w-auto
                        "
                      >
                        <i className="ri-ticket-2-line"></i>
                        <span>Lihat Tiket</span>
                        <i className="ri-arrow-right-line"></i>
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* =========================
            EMPTY STATE
        ========================== */}
        {!loading && !error && tickets.length === 0 && (
          <div
            className="
              mt-7
              rounded-none
              border-2
              border-dashed
              border-[#161616]
              bg-[#FFFDF9]
              px-6
              py-16
              text-center
            "
          >
            <div
              className="
                mx-auto
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-none
                border-2
                border-[#161616]
                bg-[#1D4ED8]
                text-[#FFFDF9]
              "
            >
              <i className="ri-ticket-2-line text-3xl"></i>
            </div>

            <h2 className="!mt-5 text-xl font-extrabold uppercase tracking-tight !text-[#161616]">
              Belum Ada Tiket
            </h2>

            <p className="!mx-auto !mt-2 !max-w-sm !text-sm leading-6 text-[#161616]/75">
              Kamu belum memiliki tiket event. Temukan event menarik dan pesan
              tiket pertamamu.
            </p>

            <Link
              to="/events"
              className="
                mt-6
                inline-flex
                items-center
                gap-2
                rounded-none
                border-2
                border-[#161616]
                bg-[#D94826]
                px-5
                py-3
                font-mono
                text-xs
                font-bold
                uppercase
                tracking-wider
                text-[#FFFDF9]
                shadow-[4px_4px_0px_#161616]
                transition
                hover:bg-[#161616]
              "
            >
              <i className="ri-compass-3-line"></i>
              <span>Jelajahi Event</span>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

export default MyTickets;