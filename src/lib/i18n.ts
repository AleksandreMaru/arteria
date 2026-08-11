import type { Locale, LocalizedString } from "./types";
import ka from "../i18n/ka.json";
import en from "../i18n/en.json";

export type UiStrings = typeof ka;

const dictionaries: Record<Locale, UiStrings> = { ka, en };

export function getUi(locale: Locale): UiStrings {
  return dictionaries[locale];
}

export function t(locale: Locale, key: string): string {
  const parts = key.split(".");
  let value: unknown = dictionaries[locale];

  for (const part of parts) {
    if (value && typeof value === "object" && part in value) {
      value = (value as Record<string, unknown>)[part];
    } else {
      return key;
    }
  }

  return typeof value === "string" ? value : key;
}

export function getLocalized(
  field: LocalizedString | undefined,
  locale: Locale,
  fallback = "",
): string {
  if (!field) return fallback;
  return field[locale] || field.ka || field.en || fallback;
}

export function localePath(locale: Locale, path = ""): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (!normalized || normalized === "/") return `/${locale}/`;
  return `/${locale}${normalized}`;
}

export function switchLocalePath(currentPath: string, targetLocale: Locale): string {
  const stripped = currentPath.replace(/^\/(ka|en)/, "") || "/";
  return localePath(targetLocale, stripped === "/" ? "" : stripped);
}

export function formatDate(date: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "ka" ? "ka-GE" : "en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}
