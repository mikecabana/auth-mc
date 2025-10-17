"use client";

import { useEffect, useRef, useState } from "react";
import { authClient } from "@/lib/auth/client";
import { AuthActionButton } from "./auth-action-button";

export default function AuthEmailVerificationForm({
  email,
}: {
  email: string;
}) {
  const [timeToNextResend, setTimeToNextResend] = useState(30);
  const interval = useRef<NodeJS.Timeout>(undefined);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    startEmailVerificationCountdown();
  }, []);

  function startEmailVerificationCountdown(time = 30) {
    setTimeToNextResend(time);

    clearInterval(interval.current);
    interval.current = setInterval(() => {
      setTimeToNextResend((t) => {
        const newT = t - 1;

        if (newT <= 0) {
          clearInterval(interval.current);
          return 0;
        }
        return newT;
      });
    }, 1000);
  }

  return (
    <AuthActionButton
      variant="outline"
      className="w-full"
      successMessage="Verification email sent!"
      disabled={timeToNextResend > 0}
      action={() => {
        startEmailVerificationCountdown();
        return authClient.sendVerificationEmail({
          email,
          callbackURL: "/",
        });
      }}
    >
      {timeToNextResend > 0
        ? `Resend Email (${timeToNextResend})`
        : "Resend Email"}
    </AuthActionButton>
  );
}
