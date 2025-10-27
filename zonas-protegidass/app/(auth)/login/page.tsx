// app/(auth)/login/page.tsx
"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseClient";
import type { Session } from "@supabase/supabase-js";


export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/dashboard";

  const supabase = supabaseBrowser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

 useEffect(() => {
  supabase.auth.getSession().then(
    (res: { data: { session: Session | null } }) => {
      const session = res.data.session;
      if (session) router.replace(next);
    }
  );
}, [next, router, supabase]);


  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Introduce email y contraseña.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return setError(error.message);

    startTransition(() => router.replace(next));
  };

  const onSignup = async () => {
    setError(null);

    // ✅ Validación explícita (el botón está fuera del <form>)
    if (!email || !password) {
      setError("Introduce email y contraseña.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      // Si tienes confirmación por email activada y quieres redirigir tras el link:
      // options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}${next}` },
    });

    if (error) return setError(error.message);

    if (data.user && !data.session) {
      // Confirm email activado
      alert("Usuario creado. Revisa tu email para confirmar la cuenta.");
    } else {
      // Confirm email desactivado → ya hay sesión
      startTransition(() => router.replace(next));
    }
  };

  return (
    <div className="min-h-dvh grid place-items-center px-4">
      <div className="w-full max-w-sm rounded-xl border p-6 shadow-sm">
        <h1 className="text-xl font-semibold">Iniciar sesión</h1>

        <form className="mt-6 space-y-3" onSubmit={onSubmit}>
          <div>
            <label className="text-sm">Email</label>
            <input
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label className="text-sm">Contraseña</label>
            <input
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              minLength={6}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={pending}
            className="mt-2 w-full rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
          >
            {pending ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="mt-4 space-y-2">
          <button
            onClick={onSignup}
            className="w-full rounded-md border px-3 py-2 text-sm hover:bg-muted"
          >
            Crear cuenta
          </button>
          {/* Opcional: Magic Link
          <button
            onClick={async () => {
              setError(null);
              if (!email) return setError("Introduce tu email.");
              const { error } = await supabase.auth.signInWithOtp({
                email,
                options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}${next}` },
              });
              if (error) setError(error.message);
              else alert("Te hemos enviado un enlace mágico.");
            }}
            className="w-full rounded-md border px-3 py-2 text-sm hover:bg-muted"
          >
            Enviarme enlace mágico
          </button>
          */}
        </div>
      </div>
    </div>
  );
}
