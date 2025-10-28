"use client";

import { authClient } from "@/lib/auth/client";
import { AuthActionButton } from "./auth-action-button";

export default function AuthAccountDeletion() {
  return (
    <AuthActionButton
      requireAreYouSure
      variant="destructive"
      className="w-full"
      successMessage="Account deletion initiated. Please check your email to confirm."
      action={() => authClient.deleteUser({ callbackURL: "/" })}
    >
      Delete Account Permanently
    </AuthActionButton>
  );
}
