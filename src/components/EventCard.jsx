import { Link } from "react-router-dom";

function EventCard({ event }) {
  const formatDate = (date) => {
    if (!date) return "-";

    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(`${date}T00:00:00`));
  };

  const formatPrice = (price) => {
    const numericPrice = Number(price);

    if (numericPrice === 0) {
      return "Gratis";
    }

    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(numericPrice);
  };

  const getStatusStyle = () => {
    switch (event.status) {
      case "Tersedia":
        return "border-[#161616] bg-[#161616] text-[#FFFDF9]";

      case "Habis":
        return "border-[#D94826] bg-[#D94826] text-[#FFFDF9]";

      case "Selesai":
        return "border-[#161616]/40 bg-[#F4EFE6] text-[#161616]/65";

      default:
        return "border-[#161616] bg-[#161616] text-[#FFFDF9]";
    }
  };

  return (
    <article
      className="
        group
        flex
        h-full
        min-w-0
        flex-col
        rounded-none
        border-2
        border-[#161616]
        bg-[#FFFDF9]
        text-[#161616]
        shadow-[4px_4px_0px_#161616]
        transition-all
        duration-150
        hover:-translate-x-0.5
        hover:-translate-y-0.5
        hover:shadow-[6px_6px_0px_#161616]
      "
    >
      {/* =========================
          IMAGE
      ========================== */}
      <Link
        to={`/events/${event.id}`}
        className="relative block aspect-[16/10] overflow-hidden border-b-2 border-[#161616] bg-[#EAE3D5]"
      >
        <img
          src={event.image}
          alt={event.title}
          loading="lazy"
          className="
            h-full
            w-full
            object-cover
            contrast-105
            transition-transform
            duration-300
            group-hover:scale-105
          "
        />

        {/* Category */}
        <span
          className="
            absolute
            left-3
            top-3
            border
            border-[#161616]
            bg-[#FFFDF9]
            px-2.5
            py-1
            font-mono
            text-[11px]
            font-bold
            uppercase
            tracking-wider
            text-[#1D4ED8]
          "
        >
          {event.category}
        </span>

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
              border
              border-[#161616]
              bg-[#D94826]
              px-2.5
              py-1
              font-mono
              text-[10px]
              font-bold
              uppercase
              tracking-wider
              text-[#FFFDF9]
            "
          >
            <i className="ri-star-fill"></i>
            Featured
          </span>
        )}

        {/* Status */}
        <span
          className={`
            absolute
            bottom-3
            right-3
            border
            px-2.5
            py-1
            font-mono
            text-[11px]
            font-bold
            uppercase
            tracking-wider
            ${getStatusStyle()}
          `}
        >
          {event.status || "Tersedia"}
        </span>
      </Link>

      {/* =========================
          CONTENT
      ========================== */}
      <div className="flex flex-1 flex-col p-5">
        {/* Date */}
        <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wide text-[#D94826]">
          <i className="ri-calendar-line text-sm"></i>
          <span>{formatDate(event.date)}</span>
        </div>

        {/* Title */}
        <Link to={`/events/${event.id}`} className="mt-3 block">
          <h3
            className="
              line-clamp-2
              text-lg
              font-extrabold
              leading-snug
              tracking-tight
              text-[#161616]
              transition-colors
              group-hover:text-[#D94826]
            "
          >
            {event.title}
          </h3>
        </Link>

        {/* Location */}
        <div className="mt-3 flex items-start gap-2 text-sm text-[#161616]/75">
          <i className="ri-map-pin-line mt-0.5 shrink-0 text-base text-[#1D4ED8]"></i>
          <p className="line-clamp-2">{event.location}</p>
        </div>

        {/* Push footer */}
        <div className="flex-1" />

        {/* =========================
            FOOTER
        ========================== */}
        <div
          className="
            mt-5
            flex
            items-end
            justify-between
            gap-3
            border-t-2
            border-dashed
            border-[#161616]/25
            pt-4
          "
        >
          {/* Price */}
          <div className="min-w-0">
            <p className="font-mono text-[11px] uppercase tracking-wider text-[#161616]/60">
              Mulai dari
            </p>
            <p className="mt-1 truncate font-mono text-sm font-bold text-[#161616] sm:text-base">
              {formatPrice(event.price)}
            </p>
          </div>

          {/* Detail */}
          <Link
            to={`/events/${event.id}`}
            aria-label={`Lihat detail ${event.title}`}
            className="
              inline-flex
              shrink-0
              items-center
              gap-1.5
              rounded-none
              border-2
              border-[#161616]
              bg-[#F4EFE6]
              px-3.5
              py-2
              text-xs
              font-bold
              uppercase
              tracking-wider
              text-[#161616]
              transition-colors
              duration-150
              hover:bg-[#161616]
              hover:text-[#FFFDF9]
            "
          >
            <span>Detail</span>
            <i className="ri-arrow-right-line transition-transform group-hover:translate-x-0.5"></i>
          </Link>
        </div>
      </div>
    </article>
  );
}

export default EventCard;