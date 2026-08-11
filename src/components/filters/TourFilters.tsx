import { useEffect, useMemo, useState } from "react";
import type { Tour } from "../../lib/schemas";

type Locale = "ka" | "en";

type Labels = {
  allRegions: string;
  regions: Record<string, string>;
  noResults: string;
  register: string;
};

type Props = {
  locale: Locale;
  tours: Tour[];
  labels: Labels;
  basePath: string;
};

function getLocalized(
  field: { ka: string; en: string },
  locale: Locale,
): string {
  return field[locale] || field.ka;
}

function formatDate(date: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "ka" ? "ka-GE" : "en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export default function TourFilters({ locale, tours, labels, basePath }: Props) {
  const regions = useMemo(
    () => [...new Set(tours.map((tour) => tour.region))],
    [tours],
  );
  const [region, setRegion] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setRegion(params.get("region") ?? "");
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (region) params.set("region", region);
    const query = params.toString();
    const next = query ? `${basePath}?${query}` : basePath;
    window.history.replaceState({}, "", next);
  }, [region, basePath]);

  const filtered = useMemo(() => {
    return tours.filter((tour) => !region || tour.region === region);
  }, [tours, region]);

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setRegion("")}
          className={`border px-4 py-2 text-sm transition-colors ${
            region === ""
              ? "border-black bg-black text-white"
              : "border-[#e5e5e5] bg-white hover:border-[#e6339e] hover:text-[#e6339e]"
          }`}
        >
          {labels.allRegions}
        </button>
        {regions.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setRegion(key)}
            className={`border px-4 py-2 text-sm transition-colors ${
              region === key
                ? "border-black bg-black text-white"
                : "border-[#e5e5e5] bg-white hover:border-[#e6339e] hover:text-[#e6339e]"
            }`}
          >
            {labels.regions[key]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-sm text-[#6b6b6b]">{labels.noResults}</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filtered.map((tour) => {
            const nextDate = [...tour.dates].sort()[0];
            return (
              <article
                key={tour.slug}
                className="group border border-[#e5e5e5] bg-white p-5 transition-shadow hover:shadow-sm"
              >
                <a href={`${basePath}/${tour.slug}`}>
                  {tour.heroImage && (
                    <div className="mb-4 aspect-[16/10] overflow-hidden bg-[#fafafa]">
                      <img
                        src={tour.heroImage}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#e6339e]">
                    {labels.regions[tour.region]}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold leading-snug group-hover:text-[#e6339e]">
                    {getLocalized(tour.title, locale)}
                  </h3>
                  <p className="mt-2 text-sm text-[#6b6b6b]">
                    {getLocalized(tour.duration, locale)}
                    {nextDate && ` · ${formatDate(nextDate, locale)}`}
                  </p>
                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-[#6b6b6b]">
                    {getLocalized(tour.summary, locale)}
                  </p>
                </a>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
