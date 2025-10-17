import AuthEmailVerification from "@/components/auth-email-verification-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type EmailVerificationPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function EmailVerificationPage({
  searchParams,
}: EmailVerificationPageProps) {
  const params = await searchParams;
  const email = params.email as string | undefined;
  return (
    <Card>
      <CardHeader>Verify Your Email</CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground mt-2">
          A verification link was sent to you. Please check your email and click
          the link to verify your account.
        </p>

        <AuthEmailVerification email={email ?? ""} />
      </CardContent>
    </Card>
  );
}
