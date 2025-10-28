import type { User } from "better-auth";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

function sendEmail({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}) {
  return resend.emails.send({
    from: `AUTH-MC <${process.env.RESEND_FROM_EMAIL}>`,
    to: [to],
    subject: subject,
    text: body,
  });
}

export async function sendPasswordResetEmail({
  user,
  url,
}: {
  user: User;
  url: string;
}) {
  return sendEmail({
    to: user.email,
    subject: "[AUTH-MC] Reset your password",
    body: `Reset your password by clicking here: ${url}`,
  });
}

export async function sendEmailVerificationEmail({
  user,
  url,
}: {
  user: User;
  url: string;
}) {
  return sendEmail({
    to: user.email,
    subject: "[AUTH-MC] Verify your email",
    body: `Verify your email by clicking here: ${url}`,
  });
}

export async function sendWelcomeEmail({ user }: { user: User }) {
  return sendEmail({
    to: user.email,
    subject: "[AUTH-MC] Welcome",
    body: `Welcome ${user.name} to AUTH-MC!`,
  });
}

export async function sendDeleteAccountVerification({
  user,
  url,
}: {
  user: User;
  url: string;
}) {
  return sendEmail({
    to: user.email,
    subject: "[AUTH-MC] Delete your account",
    body: `We're sorry to see you go. Please confirm your account deletion by clicking here: ${url}`,
  });
}
