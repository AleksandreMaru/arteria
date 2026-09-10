import { useEffect, useId, useState, type FormEvent } from "react";
import {
  OPEN_REGISTER_EVENT,
  type RegisterCourseOption,
  type RegisterLabels,
} from "../../lib/register";

type Props = {
  locale: "ka" | "en";
  labels: RegisterLabels;
  courses: RegisterCourseOption[];
  termsHref: string;
  initialCourseSlug?: string;
};

type CallSlot = "11-14" | "14-17" | "17-20";

type FormState = {
  fullName: string;
  dob: string;
  course: string;
  phone: string;
  email: string;
  facebook: string;
  about: string;
  callSlot: CallSlot | "";
  terms: boolean;
  website: string;
};

const emptyForm = (course = ""): FormState => ({
  fullName: "",
  dob: "",
  course,
  phone: "",
  email: "",
  facebook: "",
  about: "",
  callSlot: "",
  terms: false,
  website: "",
});

function formatDobInput(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  const parts = [];
  if (digits.length > 0) parts.push(digits.slice(0, 2));
  if (digits.length > 2) parts.push(digits.slice(2, 4));
  if (digits.length > 4) parts.push(digits.slice(4, 8));
  return parts.join(" / ");
}

function isValidDob(value: string) {
  const match = value.match(/^(\d{2})\s*\/\s*(\d{2})\s*\/\s*(\d{4})$/);
  if (!match) return false;
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31 || year < 1940) return false;
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function RegistrationModal({
  locale,
  labels,
  courses,
  termsHref,
  initialCourseSlug = "",
}: Props) {
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm(initialCourseSlug));
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const onOpen = (event: Event) => {
      const detail = (event as CustomEvent<{ courseSlug?: string }>).detail;
      const slug = detail?.courseSlug || initialCourseSlug || "";
      setForm(emptyForm(slug));
      setError("");
      setSuccess(false);
      setOpen(true);
    };

    window.addEventListener(OPEN_REGISTER_EVENT, onOpen as EventListener);
    return () =>
      window.removeEventListener(OPEN_REGISTER_EVENT, onOpen as EventListener);
  }, [initialCourseSlug]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    if (
      !form.fullName.trim() ||
      !form.dob.trim() ||
      !form.course ||
      !form.phone.trim() ||
      !form.email.trim() ||
      !form.callSlot
    ) {
      setError(labels.errorRequired);
      return;
    }
    if (!isValidDob(form.dob)) {
      setError(labels.errorDob);
      return;
    }
    if (!isValidEmail(form.email)) {
      setError(labels.errorEmail);
      return;
    }
    if (!form.terms) {
      setError(labels.errorTerms);
      return;
    }

    setSubmitting(true);
    try {
      const courseTitle =
        courses.find((c) => c.slug === form.course)?.title || form.course;
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          fullName: form.fullName.trim(),
          dob: form.dob.trim(),
          courseSlug: form.course,
          courseTitle,
          phone: form.phone.trim(),
          email: form.email.trim(),
          facebook: form.facebook.trim(),
          about: form.about.trim(),
          callSlot: form.callSlot,
          callSlotLabel: form.callSlot ? labels.slots[form.callSlot] : "",
          website: form.website,
          pageUrl: window.location.href,
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(data?.error || labels.errorGeneric);
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : labels.errorGeneric);
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  const fieldClass =
    "mt-2 w-full border border-[#e5e5e5] bg-white px-3 py-3 text-base outline-none transition-colors focus:border-[#e6339e]";
  const labelClass = "text-sm font-medium text-black";

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label={labels.close}
        onClick={() => setOpen(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-[101] flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden bg-white shadow-xl sm:max-h-[90vh]"
      >
        <div className="flex items-center justify-between border-b border-[#e5e5e5] px-5 py-4 md:px-6">
          <h2 id={titleId} className="font-headline text-2xl font-semibold">
            {labels.title}
          </h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-sm font-medium text-[#6b6b6b] transition-colors hover:text-[#e6339e]"
          >
            {labels.close}
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-6 md:px-6">
          {success ? (
            <div className="py-10 text-center">
              <p className="font-headline text-2xl font-semibold">
                {labels.successTitle}
              </p>
              <p className="mt-3 text-base text-[#6b6b6b]">{labels.successBody}</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="mt-8 inline-flex min-h-12 w-full items-center justify-center bg-[#e6339e] px-7 py-3.5 text-base font-medium text-white transition-colors hover:bg-black"
              >
                {labels.close}
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="space-y-10">
              <input
                type="text"
                name="website"
                value={form.website}
                onChange={(e) => update("website", e.target.value)}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              <fieldset className="space-y-5">
                <legend className="font-headline text-lg font-semibold">
                  {labels.personal}
                </legend>

                <div>
                  <label className={labelClass} htmlFor="reg-fullName">
                    {labels.fullName} <span className="text-[#e6339e]">*</span>
                  </label>
                  <input
                    id="reg-fullName"
                    className={fieldClass}
                    value={form.fullName}
                    onChange={(e) => update("fullName", e.target.value)}
                    autoComplete="name"
                    required
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor="reg-dob">
                    {labels.dob} <span className="text-[#e6339e]">*</span>
                  </label>
                  <input
                    id="reg-dob"
                    className={fieldClass}
                    value={form.dob}
                    onChange={(e) => update("dob", formatDobInput(e.target.value))}
                    placeholder={labels.dobPlaceholder}
                    inputMode="numeric"
                    required
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor="reg-phone">
                    {labels.phone} <span className="text-[#e6339e]">*</span>
                  </label>
                  <input
                    id="reg-phone"
                    className={fieldClass}
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    autoComplete="tel"
                    required
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor="reg-email">
                    {labels.email} <span className="text-[#e6339e]">*</span>
                  </label>
                  <input
                    id="reg-email"
                    type="email"
                    className={fieldClass}
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor="reg-facebook">
                    {labels.facebook}{" "}
                    <span className="font-normal text-[#6b6b6b]">
                      ({labels.optional})
                    </span>
                  </label>
                  <input
                    id="reg-facebook"
                    className={fieldClass}
                    value={form.facebook}
                    onChange={(e) => update("facebook", e.target.value)}
                    placeholder="https://"
                    inputMode="url"
                  />
                  <p className="mt-1.5 text-xs text-[#6b6b6b]">
                    {labels.facebookHint}
                  </p>
                </div>
              </fieldset>

              <fieldset className="space-y-5">
                <legend className="font-headline text-lg font-semibold">
                  {labels.courseGroup}
                </legend>

                <div>
                  <label className={labelClass} htmlFor="reg-course">
                    {labels.course} <span className="text-[#e6339e]">*</span>
                  </label>
                  <div className="relative mt-2">
                    <select
                      id="reg-course"
                      className={`${fieldClass} mt-0 appearance-none pr-10`}
                      value={form.course}
                      onChange={(e) => update("course", e.target.value)}
                      required
                    >
                      <option value="">{labels.coursePlaceholder}</option>
                      {courses.map((course) => (
                        <option key={course.slug} value={course.slug}>
                          {course.title}
                        </option>
                      ))}
                    </select>
                    <span
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#6b6b6b]"
                      aria-hidden="true"
                    >
                      ⌄
                    </span>
                  </div>
                </div>

                <div>
                  <label className={labelClass} htmlFor="reg-about">
                    {labels.about}{" "}
                    <span className="font-normal text-[#6b6b6b]">
                      ({labels.optional})
                    </span>
                  </label>
                  <textarea
                    id="reg-about"
                    className={`${fieldClass} min-h-28 resize-y`}
                    value={form.about}
                    onChange={(e) => update("about", e.target.value)}
                    rows={4}
                  />
                  <p className="mt-1.5 text-xs text-[#6b6b6b]">{labels.aboutHint}</p>
                </div>
              </fieldset>

              <fieldset className="space-y-5">
                <legend className="font-headline text-lg font-semibold">
                  {labels.scheduling}
                </legend>

                <div>
                  <p className={labelClass}>
                    {labels.callWhen} <span className="text-[#e6339e]">*</span>
                  </p>
                  <div className="mt-3 space-y-3">
                    {(Object.keys(labels.slots) as CallSlot[]).map((slot) => (
                      <label
                        key={slot}
                        className="flex cursor-pointer items-center gap-3 border border-[#e5e5e5] px-4 py-3 text-sm transition-colors has-[:checked]:border-[#e6339e]"
                      >
                        <input
                          type="radio"
                          name="callSlot"
                          value={slot}
                          checked={form.callSlot === slot}
                          onChange={() => update("callSlot", slot)}
                          className="accent-[#e6339e]"
                        />
                        <span>{labels.slots[slot]}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <label className="flex items-start gap-3 text-sm leading-relaxed">
                  <input
                    type="checkbox"
                    checked={form.terms}
                    onChange={(e) => update("terms", e.target.checked)}
                    className="mt-1 accent-[#e6339e]"
                  />
                  <span>
                    {labels.termsPrefix}{" "}
                    <a
                      href={termsHref}
                      className="text-[#e6339e] underline underline-offset-2"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {labels.termsLink}
                    </a>
                  </span>
                </label>
              </fieldset>

              {error && (
                <p className="text-sm font-medium text-[#e6339e]" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex min-h-12 w-full items-center justify-center bg-[#e6339e] px-7 py-3.5 text-base font-medium text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? labels.submitting : labels.submit}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
