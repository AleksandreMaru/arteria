export type Locale = "ka" | "en";

export const LOCALES: Locale[] = ["ka", "en"];
export const DEFAULT_LOCALE: Locale = "ka";

export type LocalizedString = {
  ka: string;
  en: string;
};

export type CourseLevel = "beginner" | "intermediate" | "advanced";
export type CourseDuration = "4-weeks" | "6-weeks" | "8-weeks" | "weekend" | "intensive";
export type CourseSchedule = "weekday-morning" | "weekday-evening" | "weekend" | "flexible";
export type CourseFormat = "in-person" | "online" | "hybrid";
export type CourseDiscipline =
  | "visual-art"
  | "design"
  | "photography"
  | "film"
  | "music"
  | "craft";

export type TourRegion =
  | "tbilisi"
  | "kakheti"
  | "svaneti"
  | "adjara"
  | "imereti"
  | "mtskheta";
