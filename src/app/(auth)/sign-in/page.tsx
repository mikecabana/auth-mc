import NextLink from "next/link";
import AuthSignInForm from "@/components/auth-sign-in-form";
import AuthSocialButtons from "@/components/social-auth-buttons";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SIGN_UP_PATH } from "@/lib/auth/constants";

export default function SignInPage() {
  return (
    <Card>
      <CardHeader>Sign In</CardHeader>
      <CardContent>
        <AuthSignInForm />
      </CardContent>

      <Separator />

      <CardFooter className="grid grid-cols-1 gap-3">
        <AuthSocialButtons />
      </CardFooter>

      <p className="text-center text-sm">
        or use your e-mail to{" "}
        <NextLink href={SIGN_UP_PATH} className="underline">
          sign up
        </NextLink>
      </p>
    </Card>
  );
}
