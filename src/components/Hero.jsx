function Hero() {
  return (
    <section className="relative overflow-hidden border-b-2 border-[#161616] bg-[#F4EFE6] text-[#161616]">
      <div className="container-app min-w-0 py-24 sm:py-28 lg:py-32">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-8">
          {/* LEFT / MAIN EDITORIAL COLUMN */}
          <div className="min-w-0 animate__animated animate__fadeInUp lg:col-span-7">
            <div className="inline-flex flex-wrap items-center gap-2 border border-[#161616] bg-[#FFFDF9] px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wider text-[#161616]">
              <span className="inline-block h-2 w-2 bg-[#D94826]" />
              <span>IMYOUR EVENT // ZINE EDITION</span>
              <span className="hidden text-[#161616]/40 sm:inline">|</span>
              <span className="hidden text-[#1D4ED8] sm:inline">
                LIVE &amp; INDIE PASS
              </span>
            </div>

            <h1 className="mt-5 max-w-3xl text-4xl font-extrabold uppercase leading-[0.98] tracking-[-0.03em] !text-[#161616] sm:text-6xl lg:text-[68px]">
              Temukan Event
              <span className="mt-2 block w-fit bg-[#D94826] px-3 py-1 !text-[#FFFDF9]">
                Seru Untukmu.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-sm leading-7 text-[#161616]/80 sm:text-base lg:text-lg">
              Temukan konser, workshop, konferensi, festival, dan berbagai event
              menarik lainnya dalam satu platform.
            </p>

            {/* ACTION BUTTONS */}
            <div className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:flex-wrap sm:gap-4">
              <a
                href="/events"
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-none
                  border-2
                  border-[#161616]
                  bg-[#161616]
                  px-6
                  py-3.5
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  text-[#FFFDF9]
                  shadow-[4px_4px_0px_#D94826]
                  transition-all
                  duration-150
                  hover:-translate-x-0.5
                  hover:-translate-y-0.5
                  hover:bg-[#D94826]
                  active:translate-x-0.5
                  active:translate-y-0.5
                  active:shadow-none
                "
              >
                <span>Jelajahi Event</span>
                <span className="font-mono text-sm leading-none">→</span>
              </a>

              <a
                href="/my-tickets"
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-none
                  border-2
                  border-[#161616]
                  bg-[#FFFDF9]
                  px-6
                  py-3.5
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  text-[#161616]
                  shadow-[4px_4px_0px_#161616]
                  transition-all
                  duration-150
                  hover:-translate-x-0.5
                  hover:-translate-y-0.5
                  hover:bg-[#1D4ED8]
                  hover:text-[#FFFDF9]
                  active:translate-x-0.5
                  active:translate-y-0.5
                  active:shadow-none
                "
              >
                <span>Tiket Saya</span>
              </a>
            </div>

            {/* STATS STRIP */}
            <div className="mt-10 grid grid-cols-3 border-2 border-[#161616] bg-[#FFFDF9] shadow-[4px_4px_0px_#161616]">
              <div className="border-r border-[#161616]/20 p-3.5 sm:p-4">
                <p className="font-mono text-xl font-bold text-[#161616] sm:text-2xl">
                  50+
                </p>
                <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-[#161616]/65 sm:text-xs">
                  Event Aktif
                </p>
              </div>

              <div className="border-r border-[#161616]/20 p-3.5 sm:p-4">
                <p className="font-mono text-xl font-bold text-[#1D4ED8] sm:text-2xl">
                  10+
                </p>
                <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-[#161616]/65 sm:text-xs">
                  Kota
                </p>
              </div>

              <div className="p-3.5 sm:p-4">
                <p className="font-mono text-xl font-bold text-[#D94826] sm:text-2xl">
                  1K+
                </p>
                <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-[#161616]/65 sm:text-xs">
                  Tiket Terjual
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT / POSTER & PASS FRAME */}
          <div className="min-w-0 lg:col-span-5">
            <div className="rounded-none border-2 border-[#161616] bg-[#FFFDF9] p-3 shadow-[6px_6px_0px_#161616] sm:p-4">
              <div className="flex items-center justify-between border-b border-[#161616]/20 pb-2.5 font-mono text-[11px] font-semibold uppercase tracking-wider">
                <span>FIG. 01 — STAGE &amp; CROWD</span>
                <span className="bg-[#1D4ED8] px-2 py-0.5 text-[#FFFDF9]">
                  OPEN ACCESS
                </span>
              </div>

              <div className="relative mt-3 h-64 overflow-hidden border border-[#161616] sm:h-80 lg:h-[360px]">
                <img
                  src="/assets/hero/hero-event.webp"
                  alt="Suasana event"
                  className="h-full w-full object-cover object-center contrast-105"
                />
              </div>

              <div className="mt-3 flex flex-col justify-between gap-2 border-t border-dashed border-[#161616]/40 pt-3 font-mono text-xs sm:flex-row sm:items-center">
                <span className="text-[#161616]/75">
                  E-TICKET INSTAN • MULTI-KATEGORI
                </span>
                <span className="font-bold text-[#D94826]">
                  READY TO BOOK →
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
