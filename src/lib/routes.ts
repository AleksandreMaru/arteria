import { LOCALES, type Locale } from "./types";

export function isLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale);
}

export function localeStaticPaths() {
  return LOCALES.map((locale) => ({ params: { locale } }));
}
