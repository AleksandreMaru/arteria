export type RegisterCourseOption = {
  slug: string;
  title: string;
};

export type RegisterLabels = {
  title: string;
  close: string;
  personal: string;
  courseGroup: string;
  scheduling: string;
  fullName: string;
  dob: string;
  dobPlaceholder: string;
  course: string;
  coursePlaceholder: string;
  phone: string;
  email: string;
  facebook: string;
  facebookHint: string;
  about: string;
  aboutHint: string;
  callWhen: string;
  slots: Record<"11-14" | "14-17" | "17-20", string>;
  termsPrefix: string;
  termsLink: string;
  optional: string;
  submit: string;
  submitting: string;
  successTitle: string;
  successBody: string;
  errorGeneric: string;
  errorRequired: string;
  errorEmail: string;
  errorDob: string;
  errorTerms: string;
};

export const OPEN_REGISTER_EVENT = "artarea:open-register";

export function openRegisterModal(courseSlug?: string) {
  window.dispatchEvent(
    new CustomEvent(OPEN_REGISTER_EVENT, {
      detail: { courseSlug: courseSlug ?? "" },
    }),
  );
}
