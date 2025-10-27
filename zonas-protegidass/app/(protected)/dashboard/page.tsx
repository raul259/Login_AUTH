// app/(protected)/dashboard/page.tsx
import "server-only";
import { supabaseServer } from "@/lib/supabaseServer";

export default async function DashboardPage() {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <p className="mt-2 text-muted-foreground">
        Bienvenido, {user?.email ?? "usuario"}
      </p>
    </div>
  );
}