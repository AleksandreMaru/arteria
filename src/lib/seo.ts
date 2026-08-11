import type { Locale } from "./types";

const SITE_URL = "https://artarea-ed.pages.dev";

export function pageTitle(locale: Locale, title?: string): string {
  if (!title) return locale === "ka" ? "ARTAREA ED" : "ARTAREA ED";
  return `${title} | ARTAREA ED`;
}

export function buildAlternateLinks(path: string) {
  const stripped = path.replace(/^\/(ka|en)/, "") || "/";
  const normalized = stripped === "/" ? "" : stripped;

  return {
    ka: `${SITE_URL}/ka${normalized}`,
    en: `${SITE_URL}/en${normalized}`,
  };
}

export function siteUrl(path: string): string {
  return `${SITE_URL}${path}`;
}
