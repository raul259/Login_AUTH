// app/(protected)/layout.tsx
import "server-only";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabaseServer";
import { logout } from "@/app/auth/actions";

export default async function ProtectedLayout({
  children,
}: { children: React.ReactNode }) {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent("/dashboard")}`);
  }

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="border-b">
        <div className="container flex items-center justify-between py-3">
          <span className="font-semibold">ForgeSkills</span>
          <form action={logout}>
            <button className="rounded-md border px-3 py-1 text-sm hover:bg-muted">
              Cerrar sesión
            </button>
          </form>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
