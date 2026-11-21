import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/";

  const registerSuccess = location.state?.registerSuccess || "";

  // state lainnya...
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    try {
      const username = form.username.trim().toLowerCase();

      if (!username) {
        setError("Username wajib diisi.");
        return;
      }

      // Cari email berdasarkan username
      const { data: email, error: lookupError } = await supabase.rpc(
        "get_email_by_username",
        {
          input_username: username,
        },
      );

      if (lookupError) {
        console.error("Username lookup error:", lookupError);
        setError("Terjadi kesalahan saat mencari akun.");
        return;
      }

      if (!email) {
        setError("Username atau password salah.");
        return;
      }

      // Login Supabase menggunakan email yang ditemukan
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password: form.password,
      });

      if (loginError) {
        console.error("LOGIN ERROR:", {
          message: loginError.message,
          code: loginError.code,
          status: loginError.status,
        });

        setError(loginError.message);
        return;
      }

      // Redirect ke halaman yang sebelumnya ingin dibuka
      navigate(from, {
        replace: true,
      });
    } catch (err) {
      console.error("Login error:", err);

      setError("Terjadi kesalahan saat login. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F4EFE6] px-4 py-28 text-[#161616]">
      <div className="w-full min-w-0 max-w-md">
        {/* Header */}
        <div className="mb-6 text-center">


          <h1 className="mt-4 text-3xl font-extrabold uppercase tracking-tight !text-[#161616] sm:text-4xl">
            <span className="inline-block px-2.5 py-0.5 !text-[#161616]">
              MASUK VENUE
            </span>
          </h1>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-none border-2 border-[#161616] bg-[#FFFDF9] p-6 shadow-[6px_6px_0px_#161616] sm:p-8"
        >
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
              autoComplete="username"
              placeholder="Masukkan username"
              className="
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
              "
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
              placeholder="Masukkan password"
              className="
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
              "
            />
          </div>

          {error && (
            <div className="mt-5 rounded-none border-2 border-[#161616] bg-[#D94826] px-4 py-3 text-[#FFFDF9] shadow-[3px_3px_0px_#161616]">
              <p className="font-mono text-xs font-bold tracking-wide">
                {error}
              </p>
            </div>
          )}

          {registerSuccess && (
            <div className="mt-5 rounded-none border-2 border-[#161616] bg-[#1D4ED8] px-4 py-3 text-[#FFFDF9] shadow-[3px_3px_0px_#161616]">
              <p className="font-mono text-xs font-bold tracking-wide">
                {registerSuccess}
              </p>
            </div>
          )}

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
              shadow-[4px_4px_0px_#D94826]
              transition
              hover:-translate-x-0.5
              hover:-translate-y-0.5
              hover:bg-[#D94826]
              disabled:cursor-not-allowed
              disabled:opacity-60
              disabled:hover:translate-x-0
              disabled:hover:translate-y-0
            "
          >
            <span>{loading ? "Memproses..." : "Masuk"}</span>
            {!loading && <i className="ri-arrow-right-line"></i>}
          </button>

          <p className="mt-6 border-t-2 border-dashed border-[#161616]/25 pt-5 text-center font-mono text-xs text-[#161616]/75">
            Belum punya akun?{" "}
            <Link
              to="/register"
              className="font-bold uppercase tracking-wider text-[#1D4ED8] underline decoration-2 underline-offset-4 transition hover:text-[#D94826]"
            >
              Daftar
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}

export default Login;