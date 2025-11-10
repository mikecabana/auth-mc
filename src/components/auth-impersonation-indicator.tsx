"use client";

import { UserX } from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";
import { AuthActionButton } from "./auth-action-button";

export default function AuthImpersonationIndicator() {
  const router = useRouter();
  const { data: session, refetch } = authClient.useSession();

  if (session?.session.impersonatedBy == null) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <AuthActionButton
        action={() =>
          authClient.admin.stopImpersonating(undefined, {
            onSuccess: () => {
              router.push("/admin");
              refetch();
            },
          })
        }
        variant="destructive"
        size="sm"
      >
        <UserX className="size-4" />
      </AuthActionButton>
    </div>
  );
}
