import { headers } from "next/headers";
import NextLink from "next/link";
import AuthButton from "@/components/auth-button";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });
  return (
    <div>
      <main className="w-full text-center p-4">
        <h1 className="text-2xl mb-4">Welcome {session?.user.name}</h1>

        <Button asChild>
          <NextLink href="/profile">Profile</NextLink>
        </Button>
        <AuthButton />
      </main>
      <footer className="text-center">&copy;{new Date().getFullYear()}</footer>
    </div>
  );
}
