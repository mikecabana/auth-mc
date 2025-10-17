import SignUpForm from "@/components/signup-form";
import AuthSocialButtons from "@/components/social-auth-buttons";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function SignUpPage() {
  return (
    <Card>
      <CardHeader>Sign Up</CardHeader>
      <CardContent>
        <SignUpForm />
      </CardContent>

      <Separator />

      <CardFooter className="grid grid-cols-1 gap-3">
        <AuthSocialButtons />
      </CardFooter>
    </Card>
  );
}
