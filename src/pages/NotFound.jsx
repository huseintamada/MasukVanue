import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F4EFE6] px-4 py-28 text-[#161616]">
      <div className="w-full min-w-0 max-w-lg rounded-none border-2 border-[#161616] bg-[#FFFDF9] p-8 text-center shadow-[7px_7px_0px_#161616] sm:p-10">
        {/* Top Tag */}
        <div className="inline-flex items-center gap-2 border border-[#161616] bg-[#F4EFE6] px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-[#1D4ED8]">
          <span className="inline-block h-2 w-2 bg-[#D94826]" />
          <span>MASUKVENUE // DEAD END</span>
        </div>

        {/* 404 Block */}
        <div className="mt-6">
          <h1
            style={{ fontFamily: "'Syne', 'Space Grotesk', sans-serif" }}
            className="inline-block border-2 border-[#161616] bg-[#D94826] px-6 py-2 text-6xl font-extrabold tracking-tight !text-[#FFFDF9] shadow-[4px_4px_0px_#161616] sm:text-7xl"
          >
            404
          </h1>
        </div>

        <h2 className="mt-6 text-2xl font-extrabold uppercase tracking-tight !text-[#161616] sm:text-3xl">
          Halaman Tidak Ditemukan
        </h2>

        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#161616]/75 sm:text-base">
          Halaman yang kamu cari tidak tersedia atau mungkin sudah dipindahkan.
        </p>

        <div className="mt-8 border-t-2 border-dashed border-[#161616]/25 pt-6">
          <Link
            to="/"
            className="
              inline-flex
              items-center
              gap-2
              rounded-none
              border-2
              border-[#161616]
              bg-[#161616]
              px-6
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
            "
          >
            <i className="ri-arrow-left-line"></i>
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </div>
    </main>
  );
}