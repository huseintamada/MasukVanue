import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

function AdminEventCreate() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    category: "",
    date: "",
    location: "",
    price: "",
    status: "Tersedia",
    featured: false,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // FORMAT RUPIAH
  // =========================
  const formatRupiahInput = (value) => {
    if (!value) return "";

    return new Intl.NumberFormat("id-ID").format(Number(value));
  };

  // =========================
  // FORM CHANGE
  // =========================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
  };

  // =========================
  // PRICE CHANGE
  // =========================
  const handlePriceChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, "");

    setForm((prev) => ({
      ...prev,
      price: rawValue,
    }));

    setError("");
  };

  // =========================
  // IMAGE CHANGE
  // =========================
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setError("Gambar harus berformat JPG, PNG, atau WEBP.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran gambar maksimal 5 MB.");
      e.target.value = "";
      return;
    }

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    const preview = URL.createObjectURL(file);

    setImageFile(file);
    setImagePreview(preview);
    setError("");
  };

  // =========================
  // REMOVE IMAGE
  // =========================
  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(null);
    setImagePreview("");
  };

  // Bersihkan object URL
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const title = form.title.trim();
    const location = form.location.trim();

    if (!title) {
      setError("Nama event wajib diisi.");
      return;
    }

    if (!form.category) {
      setError("Kategori wajib dipilih.");
      return;
    }

    if (!form.date) {
      setError("Tanggal event wajib diisi.");
      return;
    }

    if (!location) {
      setError("Lokasi event wajib diisi.");
      return;
    }

    if (form.price === "") {
      setError("Harga event wajib diisi. Isi 0 jika gratis.");
      return;
    }

    if (Number(form.price) < 0) {
      setError("Harga event tidak valid.");
      return;
    }

    if (!imageFile) {
      setError("Gambar event wajib diupload.");
      return;
    }

    let uploadedFilePath = null;

    try {
      setLoading(true);

      // =========================
      // 1. UPLOAD IMAGE
      // =========================

      const fileExtension =
        imageFile.name.split(".").pop()?.toLowerCase() || "webp";

      const fileName = `${crypto.randomUUID()}.${fileExtension}`;

      const filePath = `events/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("event-images")
        .upload(filePath, imageFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      uploadedFilePath = filePath;

      // =========================
      // 2. GET PUBLIC URL
      // =========================

      const { data: imageData } = supabase.storage
        .from("event-images")
        .getPublicUrl(filePath);

      const imageUrl = imageData.publicUrl;

      if (!imageUrl) {
        throw new Error("URL gambar gagal dibuat.");
      }

      // =========================
      // 3. INSERT EVENT
      // =========================

      const { data, error: insertError } = await supabase
        .from("events")
        .insert([
          {
            title,
            category: form.category,
            date: form.date,
            location,
            price: Number(form.price),
            image: imageUrl,
            status: form.status,
            featured: form.featured,
          },
        ])
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      console.log("Event berhasil dibuat:", data);

      navigate("/admin/events", {
        replace: true,
        state: {
          success: `Event "${title}" berhasil ditambahkan.`,
        },
      });
    } catch (err) {
      console.error("Gagal menambahkan event:", err);

      // Kalau gambar berhasil diupload tetapi INSERT event gagal,
      // hapus gambar supaya tidak menjadi file sampah.
      if (uploadedFilePath) {
        const { error: removeError } = await supabase.storage
          .from("event-images")
          .remove([uploadedFilePath]);

        if (removeError) {
          console.error("Gagal membersihkan gambar:", removeError);
        }
      }

      setError(err.message || "Event gagal ditambahkan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `
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
    sm:text-sm
    !text-[#161616]
    outline-none
    transition
    placeholder:!text-[#161616]/60
    focus:bg-[#FFFDF9]
    focus:shadow-[3px_3px_0px_#161616]
  `;

  return (
    <div className="mx-auto max-w-6xl min-w-0 bg-[#F4EFE6] !text-[#161616]">
      {/* ================= HEADER ================= */}

      <div className="min-w-0 border-b-2 border-dashed border-[#161616] pb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            to="/admin/events"
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
            <span>Kembali ke Kelola Event</span>
          </Link>
        </div>

        <div className="mt-8 min-w-0">
          <h1
            style={{ fontFamily: "'Syne', 'Space Grotesk', sans-serif" }}
            className="mt-3 break-words text-3xl font-extrabold uppercase tracking-tight !text-[#161616] sm:text-4xl"
          >
            Tambah Event
          </h1>

          <p className="mt-2 max-w-xl font-mono text-xs leading-6 sm:text-sm !text-[#161616]">
            Buat event baru di MASUKVENUE dan lengkapi informasi yang akan
            ditampilkan kepada pengguna.
          </p>
        </div>
      </div>

      {/* ================= FORM ================= */}

      <form onSubmit={handleSubmit} className="mt-8 min-w-0">
        <div className="grid min-w-0 gap-6 lg:grid-cols-[1fr_380px]">
          {/* ================= LEFT ================= */}

          <section className="min-w-0 rounded-none border-2 border-[#161616] bg-[#FFFDF9] p-5 shadow-[6px_6px_0px_#161616] sm:p-7">
            <div className="-mx-5 -mt-5 border-b-2 border-[#161616] bg-[#F4EFE6] px-5 py-4 sm:-mx-7 sm:-mt-7 sm:px-7">
              <h2
                style={{ fontFamily: "'Syne', 'Space Grotesk', sans-serif" }}
                className="text-lg font-extrabold uppercase tracking-tight !text-[#161616]"
              >
                Informasi Event
              </h2>

              <p className="mt-0.5 font-mono text-xs !text-[#161616]">
                Informasi utama mengenai event.
              </p>
            </div>

            {/* TITLE */}

            <div className="mt-6 min-w-0">
              <label
                htmlFor="title"
                className="mb-2 block font-mono text-xs font-bold uppercase tracking-wider !text-[#161616]"
              >
                Nama Event
              </label>

              <input
                id="title"
                name="title"
                type="text"
                value={form.title}
                onChange={handleChange}
                placeholder="Contoh: Festival Musik Nusantara 2026"
                className={inputClass}
              />
            </div>

            {/* CATEGORY + DATE */}

            <div className="mt-5 grid min-w-0 gap-5 sm:grid-cols-2">
              <div className="min-w-0">
                <label
                  htmlFor="category"
                  className="mb-2 block font-mono text-xs font-bold uppercase tracking-wider !text-[#161616]"
                >
                  Kategori
                </label>

                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Pilih kategori</option>

                  <option value="Musik">Musik</option>
                  <option value="Teknologi">Teknologi</option>
                  <option value="Bisnis">Bisnis</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Seni">Seni</option>
                  <option value="Olahraga">Olahraga</option>
                  <option value="Komunitas">Komunitas</option>
                </select>
              </div>

              <div className="min-w-0">
                <label
                  htmlFor="date"
                  className="mb-2 block font-mono text-xs font-bold uppercase tracking-wider !text-[#161616]"
                >
                  Tanggal Event
                </label>

                <input
                  id="date"
                  name="date"
                  type="date"
                  value={form.date}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

            {/* LOCATION */}

            <div className="mt-5 min-w-0">
              <label
                htmlFor="location"
                className="mb-2 block font-mono text-xs font-bold uppercase tracking-wider !text-[#161616]"
              >
                Lokasi
              </label>

              <input
                id="location"
                name="location"
                type="text"
                value={form.location}
                onChange={handleChange}
                placeholder="Contoh: Yogyakarta"
                className={inputClass}
              />
            </div>

            {/* PRICE */}

            <div className="mt-5 min-w-0">
              <label
                htmlFor="price"
                className="mb-2 block font-mono text-xs font-bold uppercase tracking-wider !text-[#161616]"
              >
                Harga Tiket
              </label>

              <div
                className="
                  flex
                  min-w-0
                  overflow-hidden
                  rounded-none
                  border-2
                  border-[#161616]
                  bg-[#F4EFE6]
                  transition
                  focus-within:bg-[#FFFDF9]
                  focus-within:shadow-[3px_3px_0px_#161616]
                "
              >
                <div
                  className="
                    flex
                    shrink-0
                    items-center
                    border-r-2
                    border-[#161616]
                    bg-[#FFFDF9]
                    px-4
                    font-mono
                    text-xs
                    font-bold
                    uppercase
                    !text-[#161616]
                    sm:text-sm
                  "
                >
                  Rp
                </div>

                <input
                  id="price"
                  name="price"
                  type="text"
                  inputMode="numeric"
                  value={formatRupiahInput(form.price)}
                  onChange={handlePriceChange}
                  placeholder="0"
                  className="
                    w-full
                    min-w-0
                    bg-transparent
                    px-4
                    py-3
                    font-mono
                    text-xs
                    font-bold
                    sm:text-sm
                    !text-[#161616]
                    outline-none
                    placeholder:!text-[#161616]/60
                  "
                />
              </div>

              <p className="mt-2 font-mono text-xs !text-[#161616]">
                Contoh: Rp 150.000. Isi 0 untuk event gratis.
              </p>
            </div>
          </section>

          {/* ================= RIGHT ================= */}

          <div className="min-w-0 space-y-6">
            {/* IMAGE */}

            <section className="min-w-0 rounded-none border-2 border-[#161616] bg-[#FFFDF9] p-5 shadow-[6px_6px_0px_#161616]">
              <div className="border-b-2 border-dashed border-[#161616] pb-3">
                <h2
                  style={{ fontFamily: "'Syne', 'Space Grotesk', sans-serif" }}
                  className="text-base font-extrabold uppercase tracking-tight !text-[#161616]"
                >
                  Gambar Event
                </h2>

                <p className="mt-0.5 font-mono text-xs !text-[#161616]">
                  Gunakan gambar landscape berkualitas baik.
                </p>
              </div>

              <div className="mt-5">
                {!imagePreview ? (
                  <label
                    className="
                      flex
                      min-h-[240px]
                      cursor-pointer
                      flex-col
                      items-center
                      justify-center
                      rounded-none
                      border-2
                      border-dashed
                      border-[#161616]
                      bg-[#F4EFE6]
                      px-6
                      text-center
                      transition
                      hover:bg-[#FFFDF9]
                      hover:shadow-[4px_4px_0px_#161616]
                    "
                  >
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
                        font-mono
                        text-xl
                        font-bold
                        !text-[#FFFDF9]
                        shadow-[3px_3px_0px_#161616]
                      "
                    >
                      <i className="ri-upload-2-line"></i>
                    </div>

                    <p
                      style={{ fontFamily: "'Syne', 'Space Grotesk', sans-serif" }}
                      className="mt-4 text-sm font-extrabold uppercase !text-[#161616]"
                    >
                      Upload gambar event
                    </p>

                    <p className="mt-2 font-mono text-xs leading-5 !text-[#161616]">
                      Klik untuk memilih gambar
                      <br />
                      JPG, PNG atau WEBP • Maks. 5 MB
                    </p>

                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="min-w-0">
                    <div className="relative overflow-hidden rounded-none border-2 border-[#161616] bg-[#F4EFE6]">
                      <img
                        src={imagePreview}
                        alt="Preview event"
                        className="h-56 w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={removeImage}
                        className="
                          absolute
                          right-3
                          top-3
                          flex
                          h-9
                          w-9
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
                        "
                        aria-label="Hapus gambar"
                      >
                        ×
                      </button>
                    </div>

                    <p className="mt-3 truncate rounded-none border border-[#161616] bg-[#F4EFE6] px-3 py-1.5 font-mono text-xs !text-[#161616]">
                      {imageFile?.name}
                    </p>

                    <label
                      className="
                        mt-3
                        inline-flex
                        cursor-pointer
                        items-center
                        gap-1.5
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
                        !text-[#161616]
                        shadow-[3px_3px_0px_#161616]
                        transition
                        hover:bg-[#1D4ED8]
                        hover:!text-[#FFFDF9]
                      "
                    >
                      <i className="ri-refresh-line"></i>
                      <span>Ganti gambar</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>
            </section>

            {/* PUBLISH SETTINGS */}

            <section className="min-w-0 rounded-none border-2 border-[#161616] bg-[#FFFDF9] p-5 shadow-[6px_6px_0px_#161616]">
              <h2
                style={{ fontFamily: "'Syne', 'Space Grotesk', sans-serif" }}
                className="border-b-2 border-dashed border-[#161616] pb-3 text-base font-extrabold uppercase tracking-tight !text-[#161616]"
              >
                Pengaturan
              </h2>

              <div className="mt-4 min-w-0">
                <label
                  htmlFor="status"
                  className="mb-2 block font-mono text-xs font-bold uppercase tracking-wider !text-[#161616]"
                >
                  Status Event
                </label>

                <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="Tersedia">Tersedia</option>

                  <option value="Habis">Habis</option>

                  <option value="Selesai">Selesai</option>
                </select>
              </div>

              {/* FEATURED */}

              <label
                className="
                  mt-5
                  flex
                  min-w-0
                  cursor-pointer
                  items-start
                  gap-3
                  rounded-none
                  border-2
                  border-[#161616]
                  bg-[#F4EFE6]
                  p-4
                  transition
                  hover:bg-[#FFFDF9]
                "
              >
                <input
                  name="featured"
                  type="checkbox"
                  checked={form.featured}
                  onChange={handleChange}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded-none border-2 border-[#161616] accent-[#D94826]"
                />

                <div className="min-w-0">
                  <p className="font-mono text-xs font-bold uppercase tracking-wider !text-[#161616]">
                    Event Pilihan
                  </p>

                  <p className="mt-1 font-mono text-xs leading-5 !text-[#161616]">
                    Event akan ditampilkan pada bagian featured di halaman
                    utama.
                  </p>
                </div>
              </label>
            </section>
          </div>
        </div>

        {/* ================= ERROR ================= */}

        {error && (
          <div className="mt-6 min-w-0 rounded-none border-2 border-[#161616] bg-[#FFFDF9] px-4 py-3.5 shadow-[5px_5px_0px_#161616]">
            <div className="flex items-start gap-2.5">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-none border-2 border-[#161616] bg-[#D94826] !text-[#FFFDF9]">
                <i className="ri-error-warning-line text-xs"></i>
              </span>
              <p className="break-words font-mono text-xs font-bold sm:text-sm !text-[#D94826]">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* ================= ACTION ================= */}

        <div
          className="
            mt-6
            flex
            min-w-0
            flex-col-reverse
            gap-3
            rounded-none
            border-2
            border-[#161616]
            bg-[#FFFDF9]
            p-4
            shadow-[6px_6px_0px_#161616]
            sm:flex-row
            sm:items-center
            sm:justify-end
          "
        >
          <Link
            to="/admin/events"
            className="
              rounded-none
              border-2
              border-[#161616]
              bg-[#F4EFE6]
              px-6
              py-3
              text-center
              font-mono
              text-xs
              font-bold
              uppercase
              tracking-wider
              !text-[#161616]
              shadow-[3px_3px_0px_#161616]
              transition
              hover:bg-[#FFFDF9]
              active:translate-x-0.5
              active:translate-y-0.5
              active:shadow-none
            "
          >
            Batal
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="
              rounded-none
              border-2
              border-[#161616]
              bg-[#D94826]
              px-7
              py-3
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
              active:translate-x-0.5
              active:translate-y-0.5
              active:shadow-[2px_2px_0px_#161616]
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {loading ? "Mengupload & Menyimpan..." : "Simpan Event"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminEventCreate;