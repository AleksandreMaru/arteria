import {
  courseSchema,
  eventSchema,
  editorialSchema,
  summerSchoolSchema,
  tourSchema,
  type Course,
  type Editorial,
  type Event,
  type SummerSchool,
  type Tour,
} from "./schemas";

function loadJson<T>(modules: Record<string, { default: unknown }>, schema: {
  parse: (data: unknown) => T;
}): T[] {
  return Object.values(modules)
    .map((mod) => schema.parse(mod.default))
    .sort((a, b) => {
      const aSlug = (a as { slug?: string }).slug ?? "";
      const bSlug = (b as { slug?: string }).slug ?? "";
      return aSlug.localeCompare(bSlug);
    });
}

const courseModules = import.meta.glob("../content/courses/*.json", {
  eager: true,
});
const tourModules = import.meta.glob("../content/tours/*.json", { eager: true });
const eventModules = import.meta.glob("../content/events/*.json", {
  eager: true,
});
const interviewModules = import.meta.glob("../content/interviews/*.json", {
  eager: true,
});
const spotlightModules = import.meta.glob("../content/spotlights/*.json", {
  eager: true,
});

const summerSchoolModule = import.meta.glob("../content/summer-school.json", {
  eager: true,
});

export function getCourses(): Course[] {
  return loadJson(courseModules, courseSchema);
}

export function getCourse(slug: string): Course | undefined {
  return getCourses().find((course) => course.slug === slug);
}

export function getFeaturedCourses(): Course[] {
  return getCourses().filter((course) => course.featured);
}

export function getTours(): Tour[] {
  return loadJson(tourModules, tourSchema);
}

export function getTour(slug: string): Tour | undefined {
  return getTours().find((tour) => tour.slug === slug);
}

export function getFeaturedTours(): Tour[] {
  return getTours().filter((tour) => tour.featured);
}

export function getEvents(): Event[] {
  return loadJson(eventModules, eventSchema).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function getEvent(slug: string): Event | undefined {
  return getEvents().find((event) => event.slug === slug);
}

export function getFeaturedEvents(): Event[] {
  return getEvents().filter((event) => event.featured);
}

export function getInterviews(): Editorial[] {
  return loadJson(interviewModules, editorialSchema).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function getInterview(slug: string): Editorial | undefined {
  return getInterviews().find((item) => item.slug === slug);
}

export function getSpotlights(): Editorial[] {
  return loadJson(spotlightModules, editorialSchema).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function getSpotlight(slug: string): Editorial | undefined {
  return getSpotlights().find((item) => item.slug === slug);
}

export function getSummerSchool(): SummerSchool {
  const mod = Object.values(summerSchoolModule)[0] as { default: unknown };
  return summerSchoolSchema.parse(mod.default);
}

export function getUpcomingItems() {
  const courses = getCourses()
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())
    .slice(0, 2)
    .map((course) => ({
      type: "course" as const,
      slug: course.slug,
      date: course.startsAt,
      title: course.title,
    }));

  const tours = getTours()
    .flatMap((tour) =>
      tour.dates.map((date) => ({
        type: "tour" as const,
        slug: tour.slug,
        date,
        title: tour.title,
      })),
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 2);

  const events = getFeaturedEvents()
    .slice(0, 2)
    .map((event) => ({
      type: "event" as const,
      slug: event.slug,
      date: event.date,
      title: event.title,
    }));

  return [...courses, ...tours, ...events]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 6);
}
