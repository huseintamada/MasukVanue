import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";

function AdminEventEdit() {
  const { id } = useParams();
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

  const [oldImageUrl, setOldImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [fetchLoading, setFetchLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // FETCH EVENT
  // =========================

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setFetchLoading(true);
        setError("");

        const { data, error: fetchError } = await supabase
          .from("events")
          .select("*")
          .eq("id", id)
          .single();

        if (fetchError) {
          throw fetchError;
        }

        setForm({
          title: data.title ?? "",
          category: data.category ?? "",
          date: data.date ?? "",
          location: data.location ?? "",
          price: String(data.price ?? 0),
          status: data.status ?? "Tersedia",
          featured: data.featured ?? false,
        });

        setOldImageUrl(data.image ?? "");
        setImagePreview(data.image ?? "");
      } catch (err) {
        console.error("Gagal mengambil event:", err);
        setError("Data event gagal dimuat.");
      } finally {
        setFetchLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const formatRupiahInput = (value) => {
    if (value === "" || value === null || value === undefined) {
      return "";
    }

    return new Intl.NumberFormat("id-ID").format(Number(value));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
  };

  const handlePriceChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, "");

    setForm((prev) => ({
      ...prev,
      price: rawValue,
    }));

    setError("");
  };

  // =========================
  // IMAGE
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

    // Hanya revoke preview lokal, jangan URL Supabase lama.
    if (imageFile && imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError("");
  };

  // =========================
  // STORAGE PATH HELPER
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
  // UPDATE
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

    let newUploadedPath = null;

    try {
      setSaving(true);

      let finalImageUrl = oldImageUrl;

      // Jika admin memilih gambar baru
      if (imageFile) {
        const extension =
          imageFile.name.split(".").pop()?.toLowerCase() || "webp";

        const fileName = `${crypto.randomUUID()}.${extension}`;
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

        newUploadedPath = filePath;

        const { data: publicData } = supabase.storage
          .from("event-images")
          .getPublicUrl(filePath);

        finalImageUrl = publicData.publicUrl;
      }

      // Update database
      const { error: updateError } = await supabase
        .from("events")
        .update({
          title,
          category: form.category,
          date: form.date,
          location,
          price: Number(form.price),
          image: finalImageUrl,
          status: form.status,
          featured: form.featured,
        })
        .eq("id", id);

      if (updateError) {
        throw updateError;
      }

      // Database berhasil diupdate.
      // Kalau gambar diganti, hapus gambar Storage lama.
      if (imageFile && oldImageUrl) {
        const oldPath = getStoragePathFromUrl(oldImageUrl);

        if (oldPath) {
          const { error: removeError } = await supabase.storage
            .from("event-images")
            .remove([oldPath]);

          if (removeError) {
            // Jangan batalkan update hanya karena cleanup gagal.
            console.error("Gambar lama gagal dihapus:", removeError);
          }
        }
      }

      navigate("/admin/events", {
        replace: true,
        state: {
          success: `Event "${title}" berhasil diperbarui.`,
        },
      });
    } catch (err) {
      console.error("Gagal memperbarui event:", err);

      // Upload baru berhasil tetapi UPDATE database gagal.
      // Bersihkan gambar baru.
      if (newUploadedPath) {
        await supabase.storage.from("event-images").remove([newUploadedPath]);
      }

      setError(err.message || "Event gagal diperbarui. Silakan coba lagi.");
    } finally {
      setSaving(false);
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

  if (fetchLoading) {
    return (
      <div className="flex min-h-[500px] min-w-0 items-center justify-center rounded-none border-2 border-[#161616] bg-[#FFFDF9] shadow-[6px_6px_0px_#161616]">
        <div className="text-center">
          <i className="ri-loader-4-line inline-block animate-spin text-3xl !text-[#D94826]"></i>
          <p className="mt-4 font-mono text-xs font-bold uppercase tracking-wider !text-[#161616]">
            Memuat data event...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl min-w-0 bg-[#F4EFE6] !text-[#161616]">
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

      <div className="mt-8 min-w-0 border-b-2 border-dashed border-[#161616] !pb-2">

        <h1
          style={{ fontFamily: "'Syne', 'Space Grotesk', sans-serif" }}
          className="mt-3 break-words text-3xl font-extrabold uppercase tracking-tight !text-[#161616] sm:text-4xl"
        >
          Edit Event
        </h1>

        <p className="!mt-2 font-mono text-xs sm:text-sm !text-[#161616]">
          Perbarui informasi event yang sudah tersedia di MASUKVENUE.
        </p>
      </div>

      {error && !form.title ? (
        <div className="mt-8 min-w-0 rounded-none border-2 border-[#161616] bg-[#FFFDF9] p-5 shadow-[6px_6px_0px_#161616]">
          <div className="flex items-start gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-none border-2 border-[#161616] bg-[#D94826] !text-[#FFFDF9]">
              <i className="ri-error-warning-line text-base"></i>
            </span>
            <p className="break-words font-mono text-xs font-bold sm:text-sm !text-[#D94826]">
              {error}
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 min-w-0">
          <div className="grid min-w-0 gap-6 lg:grid-cols-[1fr_380px]">
            {/* INFORMASI */}
            <section className="min-w-0 rounded-none border-2 border-[#161616] bg-[#FFFDF9] p-5 shadow-[6px_6px_0px_#161616] sm:p-7">
              <div className="-mx-5 -mt-5 border-b-2 border-[#161616] bg-[#F4EFE6] px-5 py-4 sm:-mx-7 sm:-mt-7 sm:px-7">
                <h2
                  style={{ fontFamily: "'Syne', 'Space Grotesk', sans-serif" }}
                  className="text-lg font-extrabold uppercase tracking-tight !text-[#161616]"
                >
                  Informasi Event
                </h2>

                <p className="mt-0.5 font-mono text-xs !text-[#161616]">
                  Ubah informasi utama event.
                </p>
              </div>

              <div className="mt-6 min-w-0">
                <label className="mb-2 block font-mono text-xs font-bold uppercase tracking-wider !text-[#161616]">
                  Nama Event
                </label>

                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div className="mt-5 grid min-w-0 gap-5 sm:grid-cols-2">
                <div className="min-w-0">
                  <label className="mb-2 block font-mono text-xs font-bold uppercase tracking-wider !text-[#161616]">
                    Kategori
                  </label>

                  <select
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
                  <label className="mb-2 block font-mono text-xs font-bold uppercase tracking-wider !text-[#161616]">
                    Tanggal Event
                  </label>

                  <input
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="mt-5 min-w-0">
                <label className="mb-2 block font-mono text-xs font-bold uppercase tracking-wider !text-[#161616]">
                  Lokasi
                </label>

                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div className="mt-5 min-w-0">
                <label className="mb-2 block font-mono text-xs font-bold uppercase tracking-wider !text-[#161616]">
                  Harga Tiket
                </label>

                <div className="flex min-w-0 overflow-hidden rounded-none border-2 border-[#161616] bg-[#F4EFE6] focus-within:bg-[#FFFDF9] focus-within:shadow-[3px_3px_0px_#161616]">
                  <div className="flex shrink-0 items-center border-r-2 border-[#161616] bg-[#FFFDF9] px-4 font-mono text-xs font-bold uppercase !text-[#161616] sm:text-sm">
                    Rp
                  </div>

                  <input
                    type="text"
                    inputMode="numeric"
                    value={formatRupiahInput(form.price)}
                    onChange={handlePriceChange}
                    className="w-full min-w-0 bg-transparent px-4 py-3 font-mono text-xs font-bold sm:text-sm !text-[#161616] outline-none"
                  />
                </div>

                <p className="mt-2 font-mono text-xs !text-[#161616]">
                  Isi 0 jika event gratis.
                </p>
              </div>
            </section>

            {/* SIDEBAR */}
            <div className="min-w-0 space-y-6">
              <section className="min-w-0 rounded-none border-2 border-[#161616] bg-[#FFFDF9] p-5 shadow-[6px_6px_0px_#161616]">
                <h2
                  style={{ fontFamily: "'Syne', 'Space Grotesk', sans-serif" }}
                  className="border-b-2 border-dashed border-[#161616] pb-3 text-base font-extrabold uppercase tracking-tight !text-[#161616]"
                >
                  Gambar Event
                </h2>

                <div className="mt-4 overflow-hidden rounded-none border-2 border-[#161616] bg-[#F4EFE6]">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview event"
                      className="h-56 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-56 items-center justify-center bg-[#F4EFE6]">
                      <p className="font-mono text-xs font-bold uppercase !text-[#161616]">
                        Tidak ada gambar
                      </p>
                    </div>
                  )}
                </div>

                <label
                  className="
                    mt-4
                    flex
                    cursor-pointer
                    items-center
                    justify-center
                    gap-2
                    rounded-none
                    border-2
                    border-[#161616]
                    bg-[#F4EFE6]
                    px-4
                    py-3
                    text-center
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
                    active:translate-x-0.5
                    active:translate-y-0.5
                    active:shadow-[2px_2px_0px_#161616]
                  "
                >
                  <i className="ri-upload-2-line text-base"></i>
                  <span>Ganti Gambar</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                {imageFile && (
                  <p className="mt-3 truncate rounded-none border border-[#161616] bg-[#F4EFE6] px-3 py-1.5 font-mono text-xs font-medium !text-[#161616]">
                    Gambar baru: {imageFile.name}
                  </p>
                )}
              </section>

              <section className="min-w-0 rounded-none border-2 border-[#161616] bg-[#FFFDF9] p-5 shadow-[6px_6px_0px_#161616]">
                <h2
                  style={{ fontFamily: "'Syne', 'Space Grotesk', sans-serif" }}
                  className="border-b-2 border-dashed border-[#161616] pb-3 text-base font-extrabold uppercase tracking-tight !text-[#161616]"
                >
                  Pengaturan
                </h2>

                <div className="mt-4 min-w-0">
                  <label className="mb-2 block font-mono text-xs font-bold uppercase tracking-wider !text-[#161616]">
                    Status Event
                  </label>

                  <select
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

                <label className="mt-5 flex min-w-0 cursor-pointer gap-3 rounded-none border-2 border-[#161616] bg-[#F4EFE6] p-4 transition hover:bg-[#FFFDF9]">
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

                    <p className="mt-1 font-mono text-xs !text-[#161616]">
                      Tampilkan event di bagian featured.
                    </p>
                  </div>
                </label>
              </section>
            </div>
          </div>

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

          <div className="mt-6 flex min-w-0 flex-col-reverse gap-3 rounded-none border-2 border-[#161616] bg-[#FFFDF9] p-4 shadow-[6px_6px_0px_#161616] sm:flex-row sm:justify-end">
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
              disabled={saving}
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
              {saving ? "Menyimpan Perubahan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default AdminEventEdit;