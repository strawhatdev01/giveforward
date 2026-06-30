"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const from = useSearchParams().get("from") || "/admin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Login failed");
      }

      router.push(from);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error — check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="email"
          placeholder="Admin email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-emerald-500"
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-emerald-500"
        />
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-emerald-600 px-6 py-3 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="text-4xl">❤️</span>
          <h1 className="mt-2 text-xl font-bold text-stone-900">GiveForward Admin</h1>
          <p className="text-sm text-stone-500">Sign in to manage campaigns</p>
        </div>

        <Suspense fallback={<div className="text-center text-sm text-stone-400">Loading…</div>}>
          <LoginForm />
        </Suspense>

        <p className="mt-6 text-center text-xs text-stone-400">
          <Link href="/" className="hover:text-stone-600">← Back to GiveForward</Link>
        </p>
      </div>
    </div>
  );
}
