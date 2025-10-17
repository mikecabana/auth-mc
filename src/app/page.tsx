import { headers } from "next/headers";
import AuthButton from "@/components/auth-button";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });
  return (
    <div>
      <main className="w-full text-center p-4">
        <h1 className="text-2xl mb-4">Welcome {session?.user.name}</h1>

        <AuthButton />
      </main>
      <footer className="text-center">&copy;{new Date().getFullYear()}</footer>
    </div>
  );
}
