"use client";

import { authClient } from "@/lib/auth/client";
import {
  SUPPORTED_OAUTH_PROVIDER_DETAILS,
  SUPPORTED_OAUTH_PROVIDERS,
} from "@/lib/auth/providers";
import { AuthActionButton } from "./auth-action-button";

export default function AuthSocialButtons() {
  return SUPPORTED_OAUTH_PROVIDERS.map((provider) => {
    const Icon = SUPPORTED_OAUTH_PROVIDER_DETAILS[provider].Icon;
    const name = SUPPORTED_OAUTH_PROVIDER_DETAILS[provider].name;

    return (
      <AuthActionButton
        variant="outline"
        key={provider}
        action={() => authClient.signIn.social({ provider, callbackURL: "/" })}
      >
        <Icon />
        {name}
      </AuthActionButton>
    );
  });
}
