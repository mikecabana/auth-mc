"use client";

import NextLink from "next/link";
import { authClient } from "@/lib/auth/client";
import { SIGN_IN_PATH } from "@/lib/auth/constants";
import { AuthActionButton } from "./auth-action-button";
import { Button } from "./ui/button";

export default function AuthButton() {
  const { data: session } = authClient.useSession();

  if (session) {
    return (
      <AuthActionButton
        variant="destructive"
        action={() => authClient.signOut()}
      >
        Sign Out
      </AuthActionButton>
    );
  }

  return (
    <Button className="cursor-pointer" asChild>
      <NextLink href={SIGN_IN_PATH}>Sign In</NextLink>
    </Button>
  );
}
