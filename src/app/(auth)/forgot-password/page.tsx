import AuthForgotPasswordForm from "@/components/auth-forgot-password-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  return (
    <Card>
      <CardHeader>Forgot Password</CardHeader>
      <CardContent>
        <AuthForgotPasswordForm />
      </CardContent>
    </Card>
  );
}
