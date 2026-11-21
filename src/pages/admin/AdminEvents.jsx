import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

function AdminEvents() {
  const location = useLocation();
  const navigate = useNavigate();

  // =========================
  // STATES
  // =========================
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  // =========================
  // FETCH EVENTS
  // =========================
  useEffect(() => {
    fetchEvents();
  }, []);

  // Ambil notification dari Create / Edit
  useEffect(() => {
    if (location.state?.success) {
      setSuccessMessage(location.state.success);

      navigate(location.pathname, {
        replace: true,
        state: {},
      });
    }
  }, [location, navigate]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: true });

      if (error) {
        throw error;
      }

      setEvents(data ?? []);
    } catch (err) {
      console.error("Gagal mengambil event:", err);

      setError("Data event gagal dimuat.");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FORMAT PRICE
  // =========================
  const formatPrice = (price) => {
    if (Number(price) === 0) {
      return "Gratis";
    }

    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(price);
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
  // GET STORAGE PATH
  // =========================
  const getStoragePathFromUrl = (url) => {
    if (!url) return null;

    const marker = "/event-images/";
    const markerIndex = url.indexOf(marker);

    if (markerIndex === -1) {
      return null;
    }

    return decodeURIComponent(url.substring(markerIndex + marker.length));
  };

  // =========================
  // OPEN DELETE MODAL
  // =========================
  const openDeleteModal = (event) => {
    setDeleteTarget(event);
    setDeleteError("");
  };

  // =========================
  // CLOSE DELETE MODAL
  // =========================
  const closeDeleteModal = () => {
    if (deleteLoading) return;

    setDeleteTarget(null);
    setDeleteError("");
  };

  // =========================
  // DELETE EVENT
  // =========================
  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleteLoading(true);
      setDeleteError("");

      const eventToDelete = deleteTarget;

      // Hapus event dari database
      const { error: deleteEventError } = await supabase
        .from("events")
        .delete()
        .eq("id", eventToDelete.id);

      if (deleteEventError) {
        throw deleteEventError;
      }

      // Hilangkan event dari state
      setEvents((prev) =>
        prev.filter((event) => event.id !== eventToDelete.id),
      );

      // Hapus gambar dari Supabase Storage
      const imagePath = getStoragePathFromUrl(eventToDelete.image);

      if (imagePath) {
        const { error: imageDeleteError } = await supabase.storage
          .from("event-images")
          .remove([imagePath]);

        if (imageDeleteError) {
          console.error(
            "Event berhasil dihapus, tetapi gambar gagal dihapus:",
            imageDeleteError,
          );
        }
      }

      // Tutup modal
      setDeleteTarget(null);

      // Notification
      setSuccessMessage(`Event "${eventToDelete.title}" berhasil dihapus.`);
    } catch (err) {
      console.error("Gagal menghapus event:", err);

      setDeleteError(err.message || "Event gagal dihapus. Silakan coba lagi.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="min-w-0 bg-[#F4EFE6] !text-[#161616]">
      {/* =========================
          HEADER
      ========================== */}
      <div className="flex min-w-0 flex-col gap-5 border-b-2 border-dashed border-[#161616] pb-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1
            style={{ fontFamily: "'Syne', 'Space Grotesk', sans-serif" }}
            className="mt-3 break-words text-3xl font-extrabold uppercase tracking-tight !text-[#161616] sm:text-4xl"
          >
            Kelola Event
          </h1>

          <p className="!mt-2 font-mono text-xs sm:text-sm !text-[#161616]">
            Tambah, edit, dan kelola event yang tersedia di MASUKVENUE.
          </p>
        </div>

        <Link
          to="/admin/events/create"
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
            bg-[#D94826]
            px-5
            py-3
            font-mono
            text-xs
            font-bold
            uppercase
            tracking-wider
            !text-[#FFFDF9]
            shadow-[5px_5px_0px_#161616]
            transition
            hover:-translate-x-0.5
            hover:-translate-y-0.5
            hover:shadow-[6px_6px_0px_#161616]
            active:translate-x-0.5
            active:translate-y-0.5
            active:shadow-[2px_2px_0px_#161616]
          "
        >
          <i className="ri-add-line text-base"></i>
          <span>Tambah Event</span>
        </Link>
      </div>

      {/* =========================
          SUCCESS NOTIFICATION
      ========================== */}
      {successMessage && (
        <div
          className="
            mt-6
            flex
            min-w-0
            items-center
            justify-between
            gap-4
            rounded-none
            border-2
            border-[#161616]
            bg-[#FFFDF9]
            px-4
            py-3.5
            shadow-[5px_5px_0px_#161616]
          "
        >
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-none border-2 border-[#161616] bg-[#1D4ED8] !text-[#FFFDF9]">
              <i className="ri-checkbox-circle-line text-base"></i>
            </span>

            <p className="break-words font-mono text-xs font-bold sm:text-sm !text-[#161616]">
              {successMessage}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setSuccessMessage("")}
            aria-label="Tutup notifikasi"
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-none
              border-2
              border-[#161616]
              bg-[#F4EFE6]
              !text-[#161616]
              transition
              hover:bg-[#D94826]
              hover:!text-[#FFFDF9]
            "
          >
            <i className="ri-close-line text-lg"></i>
          </button>
        </div>
      )}

      {/* =========================
          SUMMARY
      ========================== */}
      <div className="mt-8 min-w-0 rounded-none border-2 border-[#161616] bg-[#FFFDF9] p-5 shadow-[5px_5px_0px_#161616]">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="font-mono text-xs font-bold uppercase tracking-wider !text-[#161616]">
              Total Event
            </p>

            <p
              style={{ fontFamily: "'Syne', 'Space Grotesk', sans-serif" }}
              className="mt-2 text-3xl font-extrabold !text-[#161616]"
            >
              {events.length}
            </p>
          </div>

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
              bg-[#D94826]
              !text-[#FFFDF9]
              shadow-[3px_3px_0px_#161616]
            "
          >
            <i className="ri-calendar-event-line text-2xl"></i>
          </div>
        </div>
      </div>

      {/* =========================
          ERROR
      ========================== */}
      {error && (
        <div className="mt-6 min-w-0 rounded-none border-2 border-[#161616] bg-[#FFFDF9] p-4 shadow-[5px_5px_0px_#161616]">
          <div className="flex items-start gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-none border-2 border-[#161616] bg-[#D94826] !text-[#FFFDF9]">
              <i className="ri-error-warning-line text-base"></i>
            </span>

            <div className="min-w-0">
              <p className="font-mono text-xs font-bold sm:text-sm !text-[#D94826]">
                {error}
              </p>

              <button
                type="button"
                onClick={fetchEvents}
                className="
                  mt-3
                  inline-block
                  rounded-none
                  border-2
                  border-[#161616]
                  bg-[#F4EFE6]
                  px-3.5
                  py-1.5
                  font-mono
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  !text-[#161616]
                  shadow-[3px_3px_0px_#161616]
                  transition
                  hover:bg-[#1D4ED8]
                  hover:!text-[#FFFDF9]
                "
              >
                Coba Lagi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================
          LOADING
      ========================== */}
      {loading && (
        <div className="mt-8 rounded-none border-2 border-[#161616] bg-[#FFFDF9] px-6 py-16 text-center shadow-[6px_6px_0px_#161616]">
          <i className="ri-loader-4-line inline-block animate-spin text-3xl !text-[#D94826]"></i>

          <p className="mt-4 font-mono text-xs font-bold uppercase tracking-wider !text-[#161616]">
            Memuat data event...
          </p>
        </div>
      )}

      {/* =========================
          EMPTY STATE
      ========================== */}
      {!loading && !error && events.length === 0 && (
        <div className="mt-8 rounded-none border-2 border-[#161616] bg-[#FFFDF9] px-6 py-16 text-center shadow-[6px_6px_0px_#161616]">
          <div
            className="
              mx-auto
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
            className="mt-4 text-lg font-extrabold uppercase !text-[#161616]"
          >
            Belum ada event
          </p>

          <p className="mt-2 font-mono text-xs !text-[#161616]">
            Tambahkan event pertama untuk mulai mengelola event.
          </p>

          <Link
            to="/admin/events/create"
            className="
              mt-5
              inline-flex
              items-center
              gap-2
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
            <i className="ri-add-line text-base"></i>
            <span>Tambah Event</span>
          </Link>
        </div>
      )}

      {/* =========================
          DESKTOP TABLE
      ========================== */}
      {!loading && !error && events.length > 0 && (
        <div className="mt-8 hidden min-w-0 overflow-hidden rounded-none border-2 border-[#161616] bg-[#FFFDF9] shadow-[6px_6px_0px_#161616] md:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] border-collapse">
              <thead className="border-b-2 border-[#161616] bg-[#F4EFE6]">
                <tr>
                  <th className="px-5 py-4 text-left font-mono text-xs font-bold uppercase tracking-wider !text-[#161616]">
                    Event
                  </th>

                  <th className="px-5 py-4 text-left font-mono text-xs font-bold uppercase tracking-wider !text-[#161616]">
                    Kategori
                  </th>

                  <th className="px-5 py-4 text-left font-mono text-xs font-bold uppercase tracking-wider !text-[#161616]">
                    Tanggal
                  </th>

                  <th className="px-5 py-4 text-left font-mono text-xs font-bold uppercase tracking-wider !text-[#161616]">
                    Lokasi
                  </th>

                  <th className="px-5 py-4 text-left font-mono text-xs font-bold uppercase tracking-wider !text-[#161616]">
                    Harga
                  </th>

                  <th className="px-5 py-4 text-right font-mono text-xs font-bold uppercase tracking-wider !text-[#161616]">
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y-2 divide-dashed divide-[#161616]">
                {events.map((event) => (
                  <tr
                    key={event.id}
                    className="transition hover:bg-[#F4EFE6]"
                  >
                    {/* Event */}
                    <td className="px-5 py-4">
                      <div className="flex min-w-0 items-center gap-3">
                        {event.image ? (
                          <img
                            src={event.image}
                            alt={event.title}
                            className="h-12 w-16 shrink-0 rounded-none border-2 border-[#161616] object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-16 shrink-0 items-center justify-center rounded-none border-2 border-[#161616] bg-[#F4EFE6] !text-[#161616]">
                            <i className="ri-image-line text-lg"></i>
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="max-w-[220px] truncate font-mono text-sm font-bold !text-[#161616]">
                            {event.title}
                          </p>

                          {event.featured && (
                            <span className="mt-1 inline-flex items-center gap-1 rounded-none border border-[#161616] bg-[#1D4ED8] px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider !text-[#FFFDF9]">
                              <i className="ri-star-fill"></i>
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4 font-mono text-xs font-bold uppercase !text-[#161616]">
                      <span className="inline-block rounded-none border border-[#161616] bg-[#F4EFE6] px-2.5 py-1">
                        {event.category}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="whitespace-nowrap px-5 py-4 font-mono text-xs !text-[#161616]">
                      {formatDate(event.date)}
                    </td>

                    {/* Location */}
                    <td className="max-w-[200px] truncate px-5 py-4 font-mono text-xs !text-[#161616]">
                      {event.location}
                    </td>

                    {/* Price */}
                    <td className="whitespace-nowrap px-5 py-4 font-mono text-xs font-bold !text-[#D94826] sm:text-sm">
                      {formatPrice(event.price)}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/events/${event.id}/edit`}
                          title="Edit event"
                          aria-label={`Edit ${event.title}`}
                          className="
                            flex
                            items-center
                            justify-center
                            gap-1.5
                            rounded-none
                            border-2
                            border-[#161616]
                            bg-[#FFFDF9]
                            px-3.5
                            py-2
                            font-mono
                            text-xs
                            font-bold
                            uppercase
                            !text-[#161616]
                            shadow-[3px_3px_0px_#161616]
                            transition
                            hover:bg-[#1D4ED8]
                            hover:!text-[#FFFDF9]
                            active:translate-x-0.5
                            active:translate-y-0.5
                            active:shadow-none
                          "
                        >
                          <i className="ri-edit-line text-sm"></i>
                          <span>Edit</span>
                        </Link>

                        <button
                          type="button"
                          onClick={() => openDeleteModal(event)}
                          title="Hapus event"
                          aria-label={`Hapus ${event.title}`}
                          className="
                            flex
                            items-center
                            justify-center
                            gap-1.5
                            rounded-none
                            border-2
                            border-[#161616]
                            bg-[#D94826]
                            px-3.5
                            py-2
                            font-mono
                            text-xs
                            font-bold
                            uppercase
                            !text-[#FFFDF9]
                            shadow-[3px_3px_0px_#161616]
                            transition
                            hover:-translate-x-0.5
                            hover:-translate-y-0.5
                            hover:shadow-[4px_4px_0px_#161616]
                            active:translate-x-0.5
                            active:translate-y-0.5
                            active:shadow-none
                          "
                        >
                          <i className="ri-delete-bin-line text-sm"></i>
                          <span>Hapus</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================
          MOBILE CARDS
      ========================== */}
      {!loading && !error && events.length > 0 && (
        <div className="mt-6 grid min-w-0 gap-5 md:hidden">
          {events.map((event) => (
            <article
              key={event.id}
              className="
                min-w-0
                overflow-hidden
                rounded-none
                border-2
                border-[#161616]
                bg-[#FFFDF9]
                shadow-[6px_6px_0px_#161616]
              "
            >
              {/* Image */}
              <div className="relative border-b-2 border-[#161616] bg-[#F4EFE6]">
                {event.image ? (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="aspect-[16/9] w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-[16/9] w-full items-center justify-center !text-[#161616]">
                    <i className="ri-image-line text-3xl"></i>
                  </div>
                )}

                {/* Featured */}
                {event.featured && (
                  <span
                    className="
                      absolute
                      right-3
                      top-3
                      flex
                      items-center
                      gap-1
                      rounded-none
                      border-2
                      border-[#161616]
                      bg-[#1D4ED8]
                      px-2.5
                      py-1
                      font-mono
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-wider
                      !text-[#FFFDF9]
                      shadow-[3px_3px_0px_#161616]
                    "
                  >
                    <i className="ri-star-fill text-xs"></i>
                    Featured
                  </span>
                )}

                {/* Category */}
                <span
                  className="
                    absolute
                    bottom-3
                    left-3
                    rounded-none
                    border-2
                    border-[#161616]
                    bg-[#FFFDF9]
                    px-3
                    py-1
                    font-mono
                    text-[11px]
                    font-bold
                    uppercase
                    !text-[#161616]
                    shadow-[3px_3px_0px_#161616]
                  "
                >
                  {event.category}
                </span>
              </div>

              {/* Content */}
              <div className="min-w-0 p-4">
                <h2
                  style={{ fontFamily: "'Syne', 'Space Grotesk', sans-serif" }}
                  className="line-clamp-2 break-words text-base font-extrabold uppercase leading-6 !text-[#161616]"
                >
                  {event.title}
                </h2>

                {/* Information */}
                <div className="mt-4 space-y-2.5 font-mono text-xs !text-[#161616]">
                  <div className="flex items-center gap-2.5">
                    <i className="ri-calendar-line shrink-0 text-base !text-[#D94826]"></i>
                    <span>{formatDate(event.date)}</span>
                  </div>

                  <div className="flex min-w-0 items-center gap-2.5">
                    <i className="ri-map-pin-line shrink-0 text-base !text-[#1D4ED8]"></i>
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>

                {/* Price */}
                <div className="mt-4 border-t-2 border-dashed border-[#161616] pt-4">
                  <p className="font-mono text-[11px] font-bold uppercase tracking-wider !text-[#161616]">
                    Harga Tiket
                  </p>

                  <p className="mt-1 font-mono text-lg font-bold !text-[#D94826]">
                    {formatPrice(event.price)}
                  </p>
                </div>

                {/* Actions */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Link
                    to={`/admin/events/${event.id}/edit`}
                    aria-label={`Edit ${event.title}`}
                    className="
                      flex
                      items-center
                      justify-center
                      gap-2
                      rounded-none
                      border-2
                      border-[#161616]
                      bg-[#F4EFE6]
                      px-4
                      py-2.5
                      font-mono
                      text-xs
                      font-bold
                      uppercase
                      !text-[#161616]
                      shadow-[3px_3px_0px_#161616]
                      transition
                      hover:bg-[#1D4ED8]
                      hover:!text-[#FFFDF9]
                      active:translate-x-0.5
                      active:translate-y-0.5
                      active:shadow-none
                    "
                  >
                    <i className="ri-edit-line text-sm"></i>
                    <span>Edit</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => openDeleteModal(event)}
                    aria-label={`Hapus ${event.title}`}
                    className="
                      flex
                      items-center
                      justify-center
                      gap-2
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
                      !text-[#FFFDF9]
                      shadow-[3px_3px_0px_#161616]
                      transition
                      hover:-translate-x-0.5
                      hover:-translate-y-0.5
                      hover:shadow-[4px_4px_0px_#161616]
                      active:translate-x-0.5
                      active:translate-y-0.5
                      active:shadow-none
                    "
                  >
                    <i className="ri-delete-bin-line text-sm"></i>
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* =========================
          DELETE MODAL
          Global: desktop + mobile
      ========================== */}
      {deleteTarget && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-[#161616]/70
            px-4
            backdrop-blur-[1px]
          "
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              closeDeleteModal();
            }
          }}
        >
          <div
            className="
              w-full
              max-w-md
              min-w-0
              rounded-none
              border-2
              border-[#161616]
              bg-[#FFFDF9]
              p-6
              shadow-[8px_8px_0px_#161616]
            "
          >
            {/* Icon */}
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
                !text-[#FFFDF9]
                shadow-[4px_4px_0px_#161616]
              "
            >
              <i className="ri-delete-bin-line text-xl"></i>
            </div>

            {/* Content */}
            <h2
              style={{ fontFamily: "'Syne', 'Space Grotesk', sans-serif" }}
              className="mt-5 text-xl font-extrabold uppercase !text-[#161616]"
            >
              Hapus Event?
            </h2>

            <p className="mt-2 break-words font-mono text-xs leading-6 !text-[#161616]">
              Event{" "}
              <span className="font-bold underline decoration-[#D94826] decoration-2 !text-[#161616]">
                {deleteTarget.title}
              </span>{" "}
              akan dihapus secara permanen.
            </p>

            <p className="mt-2 font-mono text-xs font-bold uppercase !text-[#D94826]">
              Tindakan ini tidak dapat dibatalkan.
            </p>

            {/* Error */}
            {deleteError && (
              <div className="mt-5 rounded-none border-2 border-[#161616] bg-[#F4EFE6] px-4 py-3 shadow-[3px_3px_0px_#161616]">
                <div className="flex items-start gap-2">
                  <i className="ri-error-warning-line mt-0.5 shrink-0 !text-[#D94826]"></i>

                  <p className="break-words font-mono text-xs font-bold !text-[#D94826]">
                    {deleteError}
                  </p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={deleteLoading}
                onClick={closeDeleteModal}
                className="
                  rounded-none
                  border-2
                  border-[#161616]
                  bg-[#F4EFE6]
                  px-5
                  py-2.5
                  font-mono
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  !text-[#161616]
                  shadow-[3px_3px_0px_#161616]
                  transition
                  hover:bg-[#FFFDF9]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                Batal
              </button>

              <button
                type="button"
                disabled={deleteLoading}
                onClick={handleDelete}
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
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
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {deleteLoading ? (
                  <>
                    <i className="ri-loader-4-line animate-spin"></i>
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <>
                    <i className="ri-delete-bin-line"></i>
                    <span>Ya, Hapus</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminEvents;