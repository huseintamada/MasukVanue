import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const usernameRegex = /^[a-z0-9._]{3,20}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const username = form.username.trim().toLowerCase();
    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();

    // Validasi username
    if (!usernameRegex.test(username)) {
      setError(
        "Username harus 3-20 karakter dan hanya boleh menggunakan huruf kecil, angka, titik, atau underscore.",
      );
      return;
    }

    // Validasi nama
    if (name.length < 3) {
      setError("Nama lengkap minimal 3 karakter.");
      return;
    }

    // Validasi password
    if (form.password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }

    // Validasi konfirmasi password
    if (form.password !== form.confirmPassword) {
      setError("Konfirmasi password tidak sama.");
      return;
    }

    try {
      setLoading(true);

      // =========================
      // CEK USERNAME & EMAIL
      // =========================

      const { data: availability, error: checkError } = await supabase.rpc(
        "check_registration_availability",
        {
          input_username: username,
          input_email: email,
        },
      );

      if (checkError) {
        console.error("Gagal mengecek akun:", checkError);
        setError("Terjadi kesalahan saat memeriksa akun.");
        return;
      }

      // Username sudah digunakan
      if (availability?.username_exists) {
        setError("Username sudah terdaftar.");
        return;
      }

      // Email sudah digunakan
      if (availability?.email_exists) {
        setError("Email sudah terdaftar.");
        return;
      }

      // =========================
      // REGISTER
      // =========================

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password: form.password,

        options: {
          data: {
            username,
            name,
          },
        },
      });

      if (signUpError) {
        console.error("Register error:", signUpError);

        if (signUpError.message.toLowerCase().includes("already")) {
          setError("Username atau email sudah terdaftar.");
          return;
        }

        setError(signUpError.message);
        return;
      }

      console.log("Register berhasil:", data.user);

      // =========================
      // LOGOUT SESSION OTOMATIS
      // =========================

      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) {
        console.error(
          "Gagal menghapus session setelah register:",
          signOutError,
        );
      }

      // =========================
      // REDIRECT KE LOGIN
      // =========================

      navigate("/login", {
        replace: true,
        state: {
          registerSuccess: `Akun @${username} berhasil dibuat. Silakan masuk.`,
        },
      });
    } catch (err) {
      console.error("Register error:", err);

      setError("Terjadi kesalahan saat membuat akun. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `
    w-full
    rounded-none
    border-2
    border-[#161616]
    bg-[#F4EFE6]
    px-4
    py-3
    text-sm
    font-medium
    !text-[#161616]
    outline-none
    transition
    placeholder:text-[#161616]/45
    focus:border-[#1D4ED8]
    focus:bg-[#FFFDF9]
    focus:shadow-[3px_3px_0px_#1D4ED8]
  `;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F4EFE6] px-4 py-28 text-[#161616]">
      <div className="w-full min-w-0 max-w-md">
        {/* Header */}
        <div className="mb-6 text-center">

          <h1 className="mt-4 text-3xl font-extrabold uppercase leading-tight tracking-tight !text-[#161616] sm:text-4xl">
            
            <span className="mt-1 inline-block px-2.5 py-0.5 !text-[#161616]">
             Gabung dengan{" MASUK VENUE "}
            </span>
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#161616]/75">
            Buat akun untuk mulai menemukan dan memesan event favoritmu.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-none border-2 border-[#161616] bg-[#FFFDF9] p-6 shadow-[6px_6px_0px_#161616] sm:p-8"
        >
          {/* Username */}
          <div className="min-w-0">
            <label
              htmlFor="username"
              className="mb-2 block font-mono text-xs font-bold uppercase tracking-wider text-[#161616]"
            >
              Username
            </label>

            <input
              id="username"
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              required
              minLength={3}
              maxLength={20}
              autoComplete="username"
              placeholder="Masukkan username"
              className={inputClass}
            />

            <p className="mt-2 font-mono text-[11px] leading-relaxed text-[#161616]/65">
              3-20 karakter. Gunakan huruf kecil, angka, titik, atau underscore.
            </p>
          </div>

          {/* Name */}
          <div className="mt-5 min-w-0">
            <label
              htmlFor="name"
              className="mb-2 block font-mono text-xs font-bold uppercase tracking-wider text-[#161616]"
            >
              Nama Lengkap
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
              autoComplete="name"
              placeholder="Nama lengkap"
              className={inputClass}
            />
          </div>

          {/* Email */}
          <div className="mt-5 min-w-0">
            <label
              htmlFor="email"
              className="mb-2 block font-mono text-xs font-bold uppercase tracking-wider text-[#161616]"
            >
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
              placeholder="nama@email.com"
              className={inputClass}
            />
          </div>

          {/* Password */}
          <div className="mt-5 min-w-0">
            <label
              htmlFor="password"
              className="mb-2 block font-mono text-xs font-bold uppercase tracking-wider text-[#161616]"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              autoComplete="new-password"
              placeholder="Minimal 6 karakter"
              className={inputClass}
            />
          </div>

          {/* Confirm Password */}
          <div className="mt-5 min-w-0">
            <label
              htmlFor="confirmPassword"
              className="mb-2 block font-mono text-xs font-bold uppercase tracking-wider text-[#161616]"
            >
              Konfirmasi Password
            </label>

            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              minLength={6}
              autoComplete="new-password"
              placeholder="Ulangi password"
              className={inputClass}
            />
          </div>

          {/* Error */}
          {error && (
            <div className="mt-5 rounded-none border-2 border-[#161616] bg-[#D94826] px-4 py-3 text-[#FFFDF9] shadow-[3px_3px_0px_#161616]">
              <p className="font-mono text-xs font-bold leading-relaxed tracking-wide">
                {error}
              </p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="
              mt-7
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
              py-3.5
              font-mono
              text-xs
              font-bold
              uppercase
              tracking-wider
              text-[#FFFDF9]
              shadow-[4px_4px_0px_#1D4ED8]
              transition
              hover:-translate-x-0.5
              hover:-translate-y-0.5
              hover:bg-[#1D4ED8]
              disabled:cursor-not-allowed
              disabled:opacity-60
              disabled:hover:translate-x-0
              disabled:hover:translate-y-0
            "
          >
            <span>{loading ? "Mendaftarkan..." : "Buat Akun"}</span>
            {!loading && <i className="ri-arrow-right-line"></i>}
          </button>

          <p className="mt-6 border-t-2 border-dashed border-[#161616]/25 pt-5 text-center font-mono text-xs text-[#161616]/75">
            Sudah punya akun?{" "}
            <Link
              to="/login"
              className="font-bold uppercase tracking-wider text-[#D94826] underline decoration-2 underline-offset-4 transition hover:text-[#1D4ED8]"
            >
              Masuk
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}

export default Register;