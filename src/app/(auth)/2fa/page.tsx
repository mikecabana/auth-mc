import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AuthBackupCode } from "@/components/auth-backup-code";
import { AuthTotpForm } from "@/components/auth-totp-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@/lib/auth";

export default async function TwoFactorPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session != null) return redirect("/");

  return (
    <div className="my-6 px-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Two-Factor Authentication
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="totp">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="totp">Authenticator</TabsTrigger>
              <TabsTrigger value="backup">Backup Code</TabsTrigger>
            </TabsList>

            <TabsContent value="totp">
              <AuthTotpForm />
            </TabsContent>

            <TabsContent value="backup">
              <AuthBackupCode />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
