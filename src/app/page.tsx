import AuthSessionRequiredButtons from "@/components/auth-session-required-buttons";

export default async function Home() {
  return (
    <div className="flex flex-col size-full">
      <main className="flex-grow text-center p-4">
        <header>
          <AuthSessionRequiredButtons />
        </header>
      </main>
      <footer className="text-center">&copy;{new Date().getFullYear()}</footer>
    </div>
  );
}
