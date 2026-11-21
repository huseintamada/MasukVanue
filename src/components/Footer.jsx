import { Link } from "react-router-dom";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t-2 border-[#161616] bg-[#F4EFE6] text-[#161616]">
      <div className="container-app min-w-0">
        <div
          className="
            grid
            grid-cols-1
            gap-10
            py-12
            sm:grid-cols-2
            lg:grid-cols-[1.5fr_1fr_1fr]
          "
        >
          {/* Brand */}
          <div className="min-w-0 max-w-sm">
            <Link
              to="/"
              className="inline-flex items-center gap-2.5 rounded-none border-2 border-[#161616] bg-[#FFFDF9] px-3.5 py-2 shadow-[3px_3px_0px_#161616] transition hover:-translate-x-0.5 hover:-translate-y-0.5"
            >
              <span
                style={{ fontFamily: "'Syne', 'Space Grotesk', sans-serif" }}
                className="inline-flex items-center text-base font-extrabold uppercase tracking-tight !text-[#161616] sm:text-lg"
              >
                <span>MASUK</span>
                <span className="ml-1.5 border border-[#161616] bg-[#D94826] px-1.5 py-0.5 !text-[#FFFDF9]">
                  VENUE
                </span>
              </span>
            </Link>

            <p className="!mt-6 !text-sm !leading-7 !text-[#161616]/80">
              Temukan event menarik, pesan tiket dengan mudah, dan kelola semua
              tiketmu dalam satu tempat.
            </p>

            <div className="mt-4 inline-flex items-center gap-2 border border-[#161616]/30 bg-[#FFFDF9] px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-[#161616]/75">
              <span className="inline-block h-2 w-2 bg-[#D94826]" />
              <span>INDIE GIGS &amp; EVENT INDEX</span>
            </div>
          </div>

          {/* Navigation */}
          <div className="min-w-0">
            <h3 className="inline-block border-b-2 !border-[#161616] pb-1 font-mono text-xs font-bold uppercase tracking-wider !text-[#161616]">
              Navigasi
            </h3>

            <div className="mt-4 flex flex-col gap-2.5">
              <Link
                to="/"
                className="w-fit text-sm font-medium text-[#161616]/80 transition hover:translate-x-1 hover:font-bold hover:text-[#D94826]"
              >
                Beranda
              </Link>

              <Link
                to="/events"
                className="w-fit text-sm font-medium text-[#161616]/80 transition hover:translate-x-1 hover:font-bold hover:text-[#D94826]"
              >
                Event
              </Link>

              <Link
                to="/my-tickets"
                className="w-fit text-sm font-medium text-[#161616]/80 transition hover:translate-x-1 hover:font-bold hover:text-[#D94826]"
              >
                Tiket Saya
              </Link>

              <Link
                to="/about"
                className="w-fit text-sm font-medium text-[#161616]/80 transition hover:translate-x-1 hover:font-bold hover:text-[#D94826]"
              >
                Tentang
              </Link>
            </div>
          </div>

          {/* Account */}
          <div className="min-w-0">
            <h3 className="inline-block border-b-2 !border-[#161616] pb-1 font-mono text-xs font-bold uppercase tracking-wider !text-[#161616]">
              Akun
            </h3>

            <div className="mt-4 flex flex-col gap-2.5">
              <Link
                to="/login"
                className="w-fit text-sm font-medium text-[#161616]/80 transition hover:translate-x-1 hover:font-bold hover:text-[#1D4ED8]"
              >
                Masuk
              </Link>

              <Link
                to="/register"
                className="w-fit text-sm font-medium text-[#161616]/80 transition hover:translate-x-1 hover:font-bold hover:text-[#1D4ED8]"
              >
                Daftar
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div
          className="
            flex
            flex-col
            gap-3
            border-t-2
            border-dashed
            border-[#161616]/30
            py-6
            font-mono
            text-xs
            text-[#161616]/75
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <p>© {currentYear} MASUKVENUE Crew. All rights reserved.</p>

          <p className="font-bold uppercase tracking-wider text-[#161616]">
            *Semua Bisa Beli
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;