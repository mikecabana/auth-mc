import { ArrowLeft } from "lucide-react";
import { headers } from "next/headers";
import NextLink from "next/link";
import { redirect } from "next/navigation";
import { AuthCreateOrganizationButton } from "@/components/auth-create-organization-button";
import { AuthOrganizationSelect } from "@/components/auth-organization-select";
import { AuthOrganizationTabs } from "@/components/auth-organization-tabs";
import { auth } from "@/lib/auth";
import { SIGN_IN_PATH } from "@/lib/auth/constants";

export default async function AuthOrganizationPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session == null) return redirect(SIGN_IN_PATH);

  return (
    <div className="container mx-auto my-6 px-4">
      <NextLink href="/" className="inline-flex items-center mb-6">
        <ArrowLeft className="size-4 mr-2" />
        Back to Home
      </NextLink>

      <div className="flex items-center mb-8 gap-2">
        <AuthOrganizationSelect />
        <AuthCreateOrganizationButton />
      </div>

      <AuthOrganizationTabs />
    </div>
  );
}
