import { Link } from "react-router-dom";

function About() {
  const features = [
    {
      number: "01",
      title: "Temukan Event",
      description:
        "Jelajahi berbagai event menarik mulai dari musik, teknologi, workshop, seni, hingga komunitas.",
    },
    {
      number: "02",
      title: "Pesan dengan Mudah",
      description:
        "Pilih event favoritmu, tentukan jumlah tiket, lalu selesaikan proses pemesanan dengan sederhana.",
    },
    {
      number: "03",
      title: "Kelola Tiket",
      description:
        "Semua tiket yang sudah dipesan tersimpan dalam satu tempat dan dapat diakses kapan saja.",
    },
  ];

  const categories = [
    "Musik",
    "Teknologi",
    "Workshop",
    "Bisnis",
    "Seni",
    "Olahraga",
    "Komunitas",
  ];

  return (
    <main className="min-h-screen bg-[#F4EFE6] pb-20 pt-28 text-[#161616] sm:pt-32">
      <div className="container-app min-w-0">
        {/* HERO */}
        <section
          className="
            relative
            overflow-hidden
            rounded-none
            border-2
            border-[#161616]
            bg-[#FFFDF9]
            px-6
            py-14
            shadow-[6px_6px_0px_#161616]
            md:px-10
            md:py-18
            lg:px-14
          "
        >

          <div className="relative z-10 min-w-0 max-w-3xl">
            <h1
              className="
                text-3xl
                font-extrabold
                uppercase
                leading-[1.03]
                tracking-tight
                !text-[#161616]
                sm:text-5xl
                lg:text-6xl
              "
            >
              Event seru dimulai dari{" "}
              <span className="mt-1 inline-block bg-[#D94826] px-3 py-0.5 !text-[#FFFDF9]">
                satu tempat.
              </span>
            </h1>

            <p
              className="
                mt-6
                max-w-2xl
                text-base
                leading-8
                text-[#161616]/80
                md:text-lg
              "
            >
              MASUKVENUE adalah platform manajemen event dan pemesanan tiket
              yang membantu kamu menemukan, memesan, dan mengelola tiket event
              dengan lebih mudah.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/events"
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-none
                  border-2
                  border-[#161616]
                  bg-[#161616]
                  px-6
                  py-3
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
                <span>Jelajahi Event</span>
                <i className="ri-arrow-right-line"></i>
              </Link>

              <Link
                to="/my-tickets"
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-none
                  border-2
                  border-[#161616]
                  bg-[#FFFDF9]
                  px-6
                  py-3
                  font-mono
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  text-[#161616]
                  shadow-[4px_4px_0px_#161616]
                  transition
                  hover:-translate-x-0.5
                  hover:-translate-y-0.5
                  hover:bg-[#1D4ED8]
                  hover:text-[#FFFDF9]
                "
              >
                <i className="ri-ticket-2-line"></i>
                <span>Tiket Saya</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section
          className="
            my-16
            grid
            grid-cols-1
            gap-8
            border-y-2
            border-[#161616]
            py-14
            lg:grid-cols-[0.85fr_1.15fr]
            lg:gap-16
          "
          data-aos="fade-up"
        >
          <div className="min-w-0"> 

            <h2
              className="
                mt-4
                text-3xl
                font-extrabold
                uppercase
                leading-tight
                tracking-tight
                !text-[#161616]
                md:text-4xl
              "
            >
              Semua kebutuhan event dalam satu platform.
            </h2>
          </div>

          <div className="min-w-0">
            <p className="text-base leading-8 text-[#161616]">
              Mencari event menarik seharusnya tidak rumit. MASUKVENUE dirancang
              untuk memberikan pengalaman yang sederhana mulai dari menemukan
              event hingga mendapatkan tiket.
            </p>

            <p className="mt-5 text-base leading-8 text-[#161616]/75">
              Dengan pencarian dan filter yang mudah digunakan, pengguna dapat
              menemukan event berdasarkan kategori, lokasi, tanggal, maupun
              harga sesuai kebutuhan mereka.
            </p>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section>
          <div className="min-w-0 max-w-xl">

            <h2 className="mt-4 text-3xl font-extrabold uppercase tracking-tight !text-[#161616] md:text-4xl">
              Tiga langkah sederhana.
            </h2>
          </div>

          <div
            className="
              mt-10
              grid
              grid-cols-1
              gap-6
              md:grid-cols-3
            "
            data-aos="fade-up"
          >
            {features.map((feature) => (
              <article
                key={feature.number}
                className="
                  group
                  min-w-0
                  rounded-none
                  border-2
                  border-[#161616]
                  bg-[#FFFDF9]
                  p-6
                  shadow-[5px_5px_0px_#161616]
                  transition-all
                  duration-150
                  hover:-translate-x-0.5
                  hover:-translate-y-0.5
                  hover:shadow-[7px_7px_0px_#D94826]
                "
              >
                <div className="flex items-center justify-between border-b-2 border-dashed border-[#161616]/25 pb-1">
                  <span className="inline-block border border-[#161616] bg-[#D94826] px-2.5 py-0.5 font-mono text-xs font-bold text-[#FFFDF9]">
                    STEP {feature.number}
                  </span>

                  <i className="ri-arrow-right-up-line text-lg text-[#161616]/50 transition group-hover:text-[#D94826]"></i>
                </div>

                <h3 className="mt-6 text-xl font-extrabold uppercase tracking-tight !text-[#161616]">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-[#161616]/80">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* CATEGORIES */}
        <section
          className="
            mt-16
            rounded-none
            border-2
            border-[#161616]
            bg-[#FFFDF9]
            px-6
            py-10
            shadow-[6px_6px_0px_#161616]
            md:px-10
          "
          data-aos="fade-up"
        >
          <div
            className="
              flex
              flex-col
              gap-8
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >
            <div className="min-w-0 max-w-xl">

              <h2 className="mt-3 text-2xl font-extrabold uppercase tracking-tight !text-[#161616] md:text-3xl">
                Temukan event sesuai minatmu.
              </h2>

              <p className="mt-3 text-sm leading-7 text-[#161616]/75">
                Dari konser hingga workshop, selalu ada pengalaman baru yang
                bisa kamu temukan.
              </p>
            </div>

            <div className="flex min-w-0 max-w-xl flex-wrap gap-2.5">
              {categories.map((category) => (
                <span
                  key={category}
                  className="
                    rounded-none
                    border-2
                    border-[#161616]
                    bg-[#F4EFE6]
                    px-4
                    py-2
                    font-mono
                    text-xs
                    font-bold
                    uppercase
                    tracking-wider
                    text-[#161616]
                    shadow-[2px_2px_0px_#161616]
                    transition
                    hover:-translate-x-0.5
                    hover:-translate-y-0.5
                    hover:bg-[#1D4ED8]
                    hover:text-[#FFFDF9]
                  "
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-16 rounded-none border-2 border-[#161616] bg-[#161616] px-6 py-14 text-center text-[#FFFDF9] shadow-[6px_6px_0px_#D94826] md:px-10">
          <div className="mx-auto max-w-2xl">

            <h2
              className="
                mt-4
                text-3xl
                font-extrabold
                uppercase
                tracking-tight
                !text-[#FFFDF9]
                md:text-4xl
              "
            >
              Temukan pengalaman berikutnya.
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#F4EFE6]/80 sm:text-base">
              Jelajahi berbagai event dan temukan aktivitas yang sesuai dengan
              minatmu.
            </p>

            <Link
              to="/events"
              className="
                mt-7
                inline-flex
                items-center
                gap-2
                rounded-none
                border-2
                border-[#FFFDF9]
                bg-[#D94826]
                px-7
                py-3.5
                font-mono
                text-xs
                font-bold
                uppercase
                tracking-wider
                text-[#FFFDF9]
                shadow-[4px_4px_0px_#FFFDF9]
                transition
                hover:-translate-x-0.5
                hover:-translate-y-0.5
                hover:bg-[#1D4ED8]
              "
            >
              <span>Lihat Semua Event</span>
              <i className="ri-arrow-right-line"></i>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

export default About;