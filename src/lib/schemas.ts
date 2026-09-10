import { z } from "zod";

export const localizedStringSchema = z.object({
  ka: z.string(),
  en: z.string(),
});

export const curriculumSessionSchema = z.object({
  week: z.number().optional(),
  title: localizedStringSchema,
  theory: localizedStringSchema.optional(),
  practice: localizedStringSchema.optional(),
  materials: localizedStringSchema.optional(),
  homework: localizedStringSchema.optional(),
  bullets: z.array(localizedStringSchema).optional(),
});

export const courseSchema = z.object({
  slug: z.string(),
  featured: z.boolean().default(false),
  discipline: z.enum([
    "visual-art",
    "design",
    "photography",
    "film",
    "music",
    "craft",
    "storytelling",
    "culture",
    "gastronomy",
  ]),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  duration: z.enum([
    "4-weeks",
    "6-weeks",
    "8-weeks",
    "10-weeks",
    "12-weeks",
    "2-months",
    "3-months",
    "weekend",
    "intensive",
  ]),
  schedule: z.enum([
    "weekday-morning",
    "weekday-evening",
    "weekend",
    "flexible",
  ]),
  format: z.enum(["in-person", "online", "hybrid"]),
  formUrl: z.string().url(),
  title: localizedStringSchema,
  summary: localizedStringSchema,
  body: localizedStringSchema,
  instructor: z.string(),
  startsAt: z.string().optional(),
  scheduleText: localizedStringSchema,
  durationText: localizedStringSchema,
  priceMonthly: z.number(),
  currency: z.string().default("GEL"),
  curriculum: z.array(curriculumSessionSchema).default([]),
  heroImage: z.string().optional(),
});

export const tourSchema = z.object({
  slug: z.string(),
  featured: z.boolean().default(false),
  region: z.enum([
    "tbilisi",
    "kakheti",
    "svaneti",
    "adjara",
    "imereti",
    "mtskheta",
  ]),
  dates: z.array(z.string()),
  meetingPoint: localizedStringSchema,
  duration: localizedStringSchema,
  languages: z.array(z.string()),
  guide: z.string(),
  formUrl: z.string().url(),
  title: localizedStringSchema,
  summary: localizedStringSchema,
  body: localizedStringSchema,
  heroImage: z.string().optional(),
});

export const eventSchema = z.object({
  slug: z.string(),
  featured: z.boolean().default(false),
  date: z.string(),
  venue: localizedStringSchema,
  formUrl: z.string().url().optional(),
  title: localizedStringSchema,
  summary: localizedStringSchema,
  body: localizedStringSchema,
  heroImage: z.string().optional(),
});

export const summerSchoolSchema = z.object({
  year: z.number(),
  ages: localizedStringSchema,
  location: localizedStringSchema,
  dates: localizedStringSchema,
  formUrl: z.string().url(),
  heroImage: z.string().optional(),
  intro: localizedStringSchema,
  curriculum: z.array(
    z.object({
      title: localizedStringSchema,
      description: localizedStringSchema,
    }),
  ),
  dailyRhythm: z.array(
    z.object({
      time: z.string(),
      activity: localizedStringSchema,
    }),
  ),
  faq: z.array(
    z.object({
      question: localizedStringSchema,
      answer: localizedStringSchema,
    }),
  ),
});

export const editorialSchema = z.object({
  slug: z.string(),
  author: z.string(),
  date: z.string(),
  heroImage: z.string().optional(),
  title: localizedStringSchema,
  summary: localizedStringSchema,
  body: localizedStringSchema,
});

export type Course = z.infer<typeof courseSchema>;
export type CurriculumSession = z.infer<typeof curriculumSessionSchema>;
export type Tour = z.infer<typeof tourSchema>;
export type Event = z.infer<typeof eventSchema>;
export type SummerSchool = z.infer<typeof summerSchoolSchema>;
export type Editorial = z.infer<typeof editorialSchema>;
