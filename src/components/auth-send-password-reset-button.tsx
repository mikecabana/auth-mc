import { authClient } from "@/lib/auth/client";
import { RESET_PASSWORD_PATH } from "@/lib/auth/constants";
import { AuthActionButton } from "./auth-action-button";

export default function AuthSendPasswordResetButton({
  email,
}: {
  email: string;
}) {
  return (
    <AuthActionButton
      variant="outline"
      successMessage="Password reset email set"
      action={() => {
        return authClient.requestPasswordReset({
          email,
          redirectTo: RESET_PASSWORD_PATH,
        });
      }}
    >
      Send Password Reset Email
    </AuthActionButton>
  );
}
