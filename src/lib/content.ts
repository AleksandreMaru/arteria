import {
  courseSchema,
  summerSchoolSchema,
  tourSchema,
  type Course,
  type SummerSchool,
  type Tour,
} from "./schemas";

function loadJson<T>(
  modules: Record<string, { default: unknown }>,
  schema: { parse: (data: unknown) => T },
): T[] {
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

export function getSummerSchool(): SummerSchool {
  const mod = Object.values(summerSchoolModule)[0] as { default: unknown };
  return summerSchoolSchema.parse(mod.default);
}
