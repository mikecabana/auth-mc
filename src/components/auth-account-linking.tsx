"use client";

import { Plus, Shield, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import type { auth } from "@/lib/auth";
import { authClient } from "@/lib/auth/client";
import {
  SUPPORTED_OAUTH_PROVIDER_DETAILS,
  SUPPORTED_OAUTH_PROVIDERS,
  type SupportedOAuthProvider,
} from "@/lib/auth/providers";
import { AuthActionButton } from "./auth-action-button";
import { Card, CardContent } from "./ui/card";

type Account = Awaited<ReturnType<typeof auth.api.listUserAccounts>>[number];

export default function AuthAccountLinking({
  currentAccounts,
}: {
  currentAccounts: Account[];
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Linked Accounts</h3>

        {currentAccounts.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-secondary-muted">
              No linked accounts found
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {currentAccounts.map((account) => (
              <AccountCard
                key={account.id}
                provider={account.providerId}
                account={account}
              />
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-medium">Link Other Accounts</h3>
        <div className="grid gap-3">
          {SUPPORTED_OAUTH_PROVIDERS.filter(
            (provider) =>
              !currentAccounts.find((acc) => acc.providerId === provider),
          ).map((provider) => (
            <AccountCard key={provider} provider={provider} />
          ))}
        </div>
      </div>
    </div>
  );
}

function AccountCard({
  provider,
  account,
}: {
  provider: string;
  account?: Account;
}) {
  const router = useRouter();

  const providerDetails = SUPPORTED_OAUTH_PROVIDER_DETAILS[
    provider as SupportedOAuthProvider
  ] ?? {
    name: provider,
    Icon: Shield,
  };

  function linkAccount() {
    return authClient.linkSocial({
      provider,
      callbackURL: "/profile",
    });
  }

  function unlinkAccount() {
    if (account == null) {
      return Promise.resolve({ error: { message: "Account not found" } });
    }
    return authClient.unlinkAccount(
      {
        accountId: account.accountId,
        providerId: provider,
      },
      {
        onSuccess: () => {
          router.refresh();
        },
      },
    );
  }

  return (
    <Card>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {<providerDetails.Icon className="size-5" />}
            <div>
              <p className="font-medium">{providerDetails.name}</p>
              {account == null ? (
                <p className="text-sm text-muted-foreground">
                  Connect your {providerDetails.name} account for easier sign-in
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Linked on {new Date(account.createdAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
          {account == null ? (
            <AuthActionButton variant="outline" size="sm" action={linkAccount}>
              <Plus />
              Link
            </AuthActionButton>
          ) : (
            <AuthActionButton
              variant="destructive"
              size="sm"
              action={unlinkAccount}
            >
              <Trash2 />
              Unlink
            </AuthActionButton>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
