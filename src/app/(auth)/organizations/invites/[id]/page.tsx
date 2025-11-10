import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AuthInviteInformation } from "@/components/auth-invite-information";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { SIGN_IN_PATH } from "@/lib/auth/constants";

export default async function AuthInvitationPage({
  params,
}: PageProps<"/organizations/invites/[id]">) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session == null) return redirect(SIGN_IN_PATH);

  const { id } = await params;

  const invitation = await auth.api
    .getInvitation({
      headers: await headers(),
      query: { id },
    })
    .catch(() => redirect("/"));

  return (
    <div className="container mx-auto my-6 max-w-2xl px-4">
      <Card>
        <CardHeader>
          <CardTitle>Organization Invitation</CardTitle>
          <CardDescription>
            You have been invited to join the {invitation.organizationName}{" "}
            organization as a {invitation.role}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuthInviteInformation invitation={invitation} />
        </CardContent>
      </Card>
    </div>
  );
}
