import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Hero from "../components/Hero";
import EventCard from "../components/EventCard";

import { supabase } from "../lib/supabase";

function Home() {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [eventError, setEventError] = useState("");

  useEffect(() => {
    const fetchFeaturedEvents = async () => {
      try {
        setLoadingEvents(true);
        setEventError("");

        const { data, error } = await supabase
          .from("events")
          .select("*")
          .eq("featured", true)
          .order("date", { ascending: true })
          .limit(3);

        if (error) {
          throw error;
        }

        setFeaturedEvents(data ?? []);
      } catch (error) {
        console.error("Gagal mengambil featured events:", error);

        setEventError("Event pilihan gagal dimuat. Silakan coba lagi.");
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchFeaturedEvents();
  }, []);

  return (
    <>
      {/* HERO */}
      <Hero />

      {/* FEATURED EVENTS — EDITORIAL ZINE SECTION */}
      <section className="border-t-2 border-[#161616] bg-[#F4EFE6] py-16 text-[#161616] sm:py-20">
        <div className="container-app min-w-0" data-aos="fade-up">
          {/* SECTION HEADER */}
          <div className="flex flex-col justify-between gap-6 border-b border-[#161616]/20 pb-7 sm:flex-row sm:items-end">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 border border-[#161616] bg-[#FFFDF9] px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wider text-[#D94826]">
                <span>ISSUE // 01</span>
                <span>•</span>
                <span>CURATED PICKS</span>
              </div>

              <h2 className="mt-4 max-w-2xl text-3xl font-extrabold uppercase leading-[1.08] tracking-tight !text-[#161616] sm:text-4xl lg:text-[42px]">
                Event yang sayang untuk{" "}
                <span className="inline-block bg-[#D94826] px-2.5 py-0.5 !text-[#FFFDF9]">
                  dilewatkan
                </span>
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-[#161616]/80 sm:text-base">
                Pilihan event menarik yang bisa kamu temukan dan pesan langsung
                melalui MASUKVENUE.
              </p>
            </div>

            {/* DESKTOP VIEW ALL */}
            <Link
              to="/events"
              className="
                hidden
                shrink-0
                items-center
                gap-2
                rounded-none
                border-2
                border-[#161616]
                bg-[#FFFDF9]
                px-5
                py-3
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
                sm:inline-flex
              "
            >
              <span>Lihat Semua Event</span>
              <span className="font-mono text-sm leading-none">→</span>
            </Link>
          </div>

          {/* CONTENT */}
          <div className="mt-10" data-aos="fade-up">
            {loadingEvents ? (
              /* LOADING */
              <div className="rounded-none border-2 border-dashed border-[#161616] bg-[#FFFDF9] px-6 py-16 text-center">
                <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-[#161616]/20 border-t-[#D94826]" />

                <p className="mt-4 font-mono text-xs uppercase tracking-wider text-[#161616]/75">
                  Memuat event pilihan...
                </p>
              </div>
            ) : eventError ? (
              /* ERROR */
              <div className="rounded-none border-2 border-[#D94826] bg-[#FFFDF9] px-6 py-14 text-center shadow-[4px_4px_0px_#D94826]">
                <div className="mx-auto flex h-11 w-11 items-center justify-center border-2 border-[#D94826] bg-[#D94826] font-mono text-lg font-bold text-[#FFFDF9]">
                  !
                </div>

                <h3 className="mt-4 text-lg font-bold uppercase tracking-tight text-[#161616]">
                  Event gagal dimuat
                </h3>

                <p className="mt-2 text-sm text-[#161616]/75">{eventError}</p>
              </div>
            ) : featuredEvents.length > 0 ? (
              /* EVENT GRID */
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {featuredEvents.map((event) => (
                  <div key={event.id} className="min-w-0">
                    <EventCard event={event} />
                  </div>
                ))}
              </div>
            ) : (
              /* EMPTY */
              <div className="rounded-none border-2 border-dashed border-[#161616] bg-[#FFFDF9] px-6 py-14 text-center">
                <div className="mx-auto flex h-11 w-11 items-center justify-center border border-[#161616] bg-[#1D4ED8] font-mono text-base font-bold text-[#FFFDF9]">
                  ★
                </div>

                <h3 className="mt-4 text-lg font-bold uppercase tracking-tight text-[#161616]">
                  Belum ada event pilihan
                </h3>

                <p className="mt-2 text-sm text-[#161616]/75">
                  Event menarik akan segera hadir di sini.
                </p>
              </div>
            )}
          </div>

          {/* MOBILE VIEW ALL */}
          <Link
            to="/events"
            className="
              mt-8
              flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-none
              border-2
              border-[#161616]
              bg-[#FFFDF9]
              px-5
              py-3.5
              text-xs
              font-bold
              uppercase
              tracking-wider
              text-[#161616]
              shadow-[4px_4px_0px_#161616]
              transition-all
              duration-150
              hover:bg-[#1D4ED8]
              hover:text-[#FFFDF9]
              active:translate-x-0.5
              active:translate-y-0.5
              active:shadow-none
              sm:hidden
            "
          >
            <span>Lihat Semua Event</span>
            <span className="font-mono text-sm leading-none">→</span>
          </Link>
        </div>
      </section>
    </>
  );
}

export default Home;
