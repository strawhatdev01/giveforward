"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateCausePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "", org: "", category: "Education", emoji: "📚",
    goal: "", daysLeft: "30", story: "", accountNumber: "", bankName: "",
  });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/causes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, goal: Number(form.goal), daysLeft: Number(form.daysLeft) }),
      });
      if (!res.ok) throw new Error("Failed to create");
      router.push("/admin");
    } catch {
      alert("Failed to create cause");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
          <Link href="/admin" className="text-sm text-stone-500 hover:text-emerald-700">← Admin</Link>
          <span className="text-lg font-bold text-stone-900">New cause</span>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">Title</label>
              <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">Organization</label>
              <input value={form.org} onChange={e => setForm(p => ({ ...p, org: e.target.value }))} required className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">Category</label>
              <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none focus:border-emerald-500">
                {["Education", "Health", "Community", "Emergency", "Environment", "Other"].map(c => <option key={c} className="text-stone-900">{c}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">Emoji</label>
              <input value={form.emoji} onChange={e => setForm(p => ({ ...p, emoji: e.target.value }))} required className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">Goal (₦)</label>
              <input type="number" min="1" value={form.goal} onChange={e => setForm(p => ({ ...p, goal: e.target.value }))} required className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">Days left</label>
              <input type="number" min="1" value={form.daysLeft} onChange={e => setForm(p => ({ ...p, daysLeft: e.target.value }))} required className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">Account number</label>
              <input value={form.accountNumber} onChange={e => setForm(p => ({ ...p, accountNumber: e.target.value }))} required className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">Bank name</label>
              <input value={form.bankName} onChange={e => setForm(p => ({ ...p, bankName: e.target.value }))} required className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none focus:border-emerald-500" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">Story</label>
            <textarea rows={4} value={form.story} onChange={e => setForm(p => ({ ...p, story: e.target.value }))} required className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none focus:border-emerald-500" />
          </div>
          <button type="submit" disabled={saving} className="w-full rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50">
            {saving ? "Creating…" : "Create cause"}
          </button>
        </form>
      </main>
    </div>
  );
}
