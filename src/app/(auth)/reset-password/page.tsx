import AuthInvalidResetLink from "@/components/auth-invalid-reset-link";
import AuthResetPasswordForm from "@/components/auth-reset-password-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type ResetPasswordPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const params = await searchParams;
  const token = params.token as string | undefined;
  const error = params.error as string | undefined;

  if (!token || error) {
    return <AuthInvalidResetLink />;
  }

  return (
    <Card>
      <CardHeader>Reset Password</CardHeader>
      <CardContent>
        <AuthResetPasswordForm token={token} />
      </CardContent>
    </Card>
  );
}
