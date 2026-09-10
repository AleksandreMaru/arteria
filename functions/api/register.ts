/// <reference path="../types.d.ts" />

interface Env {
  RESEND_API_KEY: string;
  REGISTER_TO_EMAIL: string;
  REGISTER_FROM_EMAIL?: string;
}

type Payload = {
  locale?: string;
  fullName?: string;
  dob?: string;
  courseSlug?: string;
  courseTitle?: string;
  phone?: string;
  email?: string;
  facebook?: string;
  about?: string;
  callSlot?: string;
  callSlotLabel?: string;
  website?: string;
  pageUrl?: string;
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export const onRequestOptions: PagesFunction = async () =>
  new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { RESEND_API_KEY, REGISTER_TO_EMAIL, REGISTER_FROM_EMAIL } =
    context.env;

  if (!RESEND_API_KEY || !REGISTER_TO_EMAIL) {
    return json(
      {
        error:
          "Registration email is not configured yet. Set RESEND_API_KEY and REGISTER_TO_EMAIL in Cloudflare.",
      },
      503,
    );
  }

  let body: Payload;
  try {
    body = (await context.request.json()) as Payload;
  } catch {
    return json({ error: "Invalid JSON body." }, 400);
  }

  // Honeypot
  if (body.website) {
    return json({ ok: true });
  }

  const fullName = body.fullName?.trim() ?? "";
  const dob = body.dob?.trim() ?? "";
  const courseTitle = body.courseTitle?.trim() || body.courseSlug?.trim() || "";
  const phone = body.phone?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const facebook = body.facebook?.trim() ?? "";
  const about = body.about?.trim() ?? "";
  const callSlotLabel = body.callSlotLabel?.trim() || body.callSlot?.trim() || "";
  const pageUrl = body.pageUrl?.trim() ?? "";

  if (!fullName || !dob || !courseTitle || !phone || !email || !callSlotLabel) {
    return json({ error: "Missing required fields." }, 400);
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: "Invalid email." }, 400);
  }

  const from = REGISTER_FROM_EMAIL || "ARTAREA ED <onboarding@resend.dev>";
  const subject = `ახალი რეგისტრაცია — ${courseTitle}`;
  const text = [
    `სახელი და გვარი: ${fullName}`,
    `დაბადების თარიღი: ${dob}`,
    `კურსი: ${courseTitle}`,
    `ტელეფონი: ${phone}`,
    `მეილი: ${email}`,
    `Facebook: ${facebook || "—"}`,
    `შენ შესახებ: ${about || "—"}`,
    `როდის დავრეკოთ: ${callSlotLabel}`,
    `გვერდი: ${pageUrl || "—"}`,
    `დრო: ${new Date().toISOString()}`,
  ].join("\n");

  const html = `
    <h2>ახალი რეგისტრაცია</h2>
    <p><strong>სახელი და გვარი:</strong> ${escapeHtml(fullName)}</p>
    <p><strong>დაბადების თარიღი:</strong> ${escapeHtml(dob)}</p>
    <p><strong>კურსი:</strong> ${escapeHtml(courseTitle)}</p>
    <p><strong>ტელეფონი:</strong> ${escapeHtml(phone)}</p>
    <p><strong>მეილი:</strong> ${escapeHtml(email)}</p>
    <p><strong>Facebook:</strong> ${escapeHtml(facebook || "—")}</p>
    <p><strong>შენ შესახებ:</strong><br>${escapeHtml(about || "—").replace(/\n/g, "<br>")}</p>
    <p><strong>როდის დავრეკოთ:</strong> ${escapeHtml(callSlotLabel)}</p>
    <p><strong>გვერდი:</strong> ${escapeHtml(pageUrl || "—")}</p>
  `;

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [REGISTER_TO_EMAIL],
      reply_to: email,
      subject,
      text,
      html,
    }),
  });

  if (!resendResponse.ok) {
    const detail = await resendResponse.text();
    console.error("Resend error:", detail);
    return json({ error: "Failed to send email." }, 502);
  }

  return json({ ok: true });
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
