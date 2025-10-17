import { type IconType, SiGoogle } from "@icons-pack/react-simple-icons";

export const SUPPORTED_OAUTH_PROVIDERS = ["google"] as const;

export type SupportedOAuthProvider = (typeof SUPPORTED_OAUTH_PROVIDERS)[number];

export const SUPPORTED_OAUTH_PROVIDER_DETAILS: Record<
  SupportedOAuthProvider,
  { name: string; Icon: IconType }
> = {
  google: { name: "Google", Icon: SiGoogle },
};
