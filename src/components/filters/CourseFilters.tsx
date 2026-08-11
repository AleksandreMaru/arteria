import { useEffect, useMemo, useState } from "react";
import type { Course } from "../../lib/schemas";

type Locale = "ka" | "en";

type Labels = {
  filters: string;
  level: string;
  discipline: string;
  duration: string;
  schedule: string;
  format: string;
  sort: string;
  sortStartingSoon: string;
  sortAlphabetical: string;
  noResults: string;
  learnMore: string;
  levels: Record<string, string>;
  disciplines: Record<string, string>;
  durations: Record<string, string>;
  schedules: Record<string, string>;
  formats: Record<string, string>;
};

type Props = {
  locale: Locale;
  courses: Course[];
  labels: Labels;
  basePath: string;
};

type SortMode = "starting-soon" | "alphabetical";

function getLocalized(
  field: { ka: string; en: string },
  locale: Locale,
): string {
  return field[locale] || field.ka;
}

export default function CourseFilters({
  locale,
  courses,
  labels,
  basePath,
}: Props) {
  const [level, setLevel] = useState("");
  const [discipline, setDiscipline] = useState("");
  const [duration, setDuration] = useState("");
  const [schedule, setSchedule] = useState("");
  const [format, setFormat] = useState("");
  const [sort, setSort] = useState<SortMode>("starting-soon");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setLevel(params.get("level") ?? "");
    setDiscipline(params.get("discipline") ?? "");
    setDuration(params.get("duration") ?? "");
    setSchedule(params.get("schedule") ?? "");
    setFormat(params.get("format") ?? "");
    setSort((params.get("sort") as SortMode) ?? "starting-soon");
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (level) params.set("level", level);
    if (discipline) params.set("discipline", discipline);
    if (duration) params.set("duration", duration);
    if (schedule) params.set("schedule", schedule);
    if (format) params.set("format", format);
    if (sort !== "starting-soon") params.set("sort", sort);

    const query = params.toString();
    const next = query ? `${basePath}?${query}` : basePath;
    window.history.replaceState({}, "", next);
  }, [level, discipline, duration, schedule, format, sort, basePath]);

  const filtered = useMemo(() => {
    let result = courses.filter((course) => {
      if (level && course.level !== level) return false;
      if (discipline && course.discipline !== discipline) return false;
      if (duration && course.duration !== duration) return false;
      if (schedule && course.schedule !== schedule) return false;
      if (format && course.format !== format) return false;
      return true;
    });

    if (sort === "alphabetical") {
      result = [...result].sort((a, b) =>
        getLocalized(a.title, locale).localeCompare(getLocalized(b.title, locale)),
      );
    } else {
      result = [...result].sort(
        (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
      );
    }

    return result;
  }, [courses, level, discipline, duration, schedule, format, sort, locale]);

  const selectClass =
    "w-full border border-[#e5e5e5] bg-white px-3 py-2 text-sm outline-none focus:border-[#e6339e]";

  return (
    <div>
      <div className="mb-8 grid gap-4 border border-[#e5e5e5] bg-[#fafafa] p-5 md:grid-cols-3 lg:grid-cols-6">
        <label className="text-xs font-semibold uppercase tracking-[0.12em]">
          {labels.level}
          <select
            className={`${selectClass} mt-2`}
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            <option value="">—</option>
            {Object.entries(labels.levels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="text-xs font-semibold uppercase tracking-[0.12em]">
          {labels.discipline}
          <select
            className={`${selectClass} mt-2`}
            value={discipline}
            onChange={(e) => setDiscipline(e.target.value)}
          >
            <option value="">—</option>
            {Object.entries(labels.disciplines).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="text-xs font-semibold uppercase tracking-[0.12em]">
          {labels.duration}
          <select
            className={`${selectClass} mt-2`}
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          >
            <option value="">—</option>
            {Object.entries(labels.durations).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="text-xs font-semibold uppercase tracking-[0.12em]">
          {labels.schedule}
          <select
            className={`${selectClass} mt-2`}
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
          >
            <option value="">—</option>
            {Object.entries(labels.schedules).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="text-xs font-semibold uppercase tracking-[0.12em]">
          {labels.format}
          <select
            className={`${selectClass} mt-2`}
            value={format}
            onChange={(e) => setFormat(e.target.value)}
          >
            <option value="">—</option>
            {Object.entries(labels.formats).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="text-xs font-semibold uppercase tracking-[0.12em]">
          {labels.sort}
          <select
            className={`${selectClass} mt-2`}
            value={sort}
            onChange={(e) => setSort(e.target.value as SortMode)}
          >
            <option value="starting-soon">{labels.sortStartingSoon}</option>
            <option value="alphabetical">{labels.sortAlphabetical}</option>
          </select>
        </label>
      </div>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-sm text-[#6b6b6b]">{labels.noResults}</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((course) => (
            <article
              key={course.slug}
              className="group border border-[#e5e5e5] bg-white p-5 transition-shadow hover:shadow-sm"
            >
              <a href={`${basePath}/${course.slug}`}>
                {course.heroImage && (
                  <div className="mb-4 aspect-[16/10] overflow-hidden bg-[#fafafa]">
                    <img
                      src={course.heroImage}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                )}
                <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#e6339e]">
                  {labels.learnMore}
                </span>
                <h3 className="mt-3 text-lg font-semibold leading-snug group-hover:text-[#e6339e]">
                  {getLocalized(course.title, locale)}
                </h3>
                <p className="mt-2 text-sm text-[#6b6b6b]">
                  {labels.levels[course.level]} · {labels.durations[course.duration]}
                </p>
                <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-[#6b6b6b]">
                  {getLocalized(course.summary, locale)}
                </p>
              </a>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
