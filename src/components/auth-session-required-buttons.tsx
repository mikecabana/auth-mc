"use client";

import NextLink from "next/link";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth/client";
import { SIGN_IN_PATH } from "@/lib/auth/constants";
import { AuthActionButton } from "./auth-action-button";
import { Button } from "./ui/button";

export default function AuthSessionRequiredButtons() {
  const { data: session, isPending: loading } = authClient.useSession();
  const [hasAdminPermission, setHasAdminPermission] = useState(false);

  useEffect(() => {
    authClient.admin
      .hasPermission({
        permission: {
          user: ["list"],
        },
      })
      .then(({ data }) => {
        setHasAdminPermission(data?.success ?? false);
      });
  }, []);

  if (loading) {
    return null;
  }

  return (
    <div className="flex items-center justify-between">
      {session == null ? (
        <>
          <h1 className="text-3xl font-bold">AUTH-MC</h1>
          <Button size="lg" asChild>
            <NextLink href={SIGN_IN_PATH}>Sign In</NextLink>
          </Button>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold">Welcome {session.user.name}!</h1>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <NextLink href="/profile">Profile</NextLink>
            </Button>
            <Button asChild size="lg" variant="outline">
              <NextLink href="/organizations">Organizations</NextLink>
            </Button>
            {hasAdminPermission && (
              <Button variant="outline" asChild size="lg">
                <NextLink href="/admin">Admin</NextLink>
              </Button>
            )}
            <AuthActionButton
              size="lg"
              variant="destructive"
              action={() => authClient.signOut()}
            >
              Sign Out
            </AuthActionButton>
          </div>
        </>
      )}
    </div>
  );
}
