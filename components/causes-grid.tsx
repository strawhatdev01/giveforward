"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { formatNaira } from "@/lib/data";

type Cause = {
  id: string;
  title: string;
  org: string;
  category: string;
  emoji: string;
  goal: number;
  raised: number;
  donorCount: number;
  daysLeft: number;
  verified: boolean;
  story: string;
  accountNumber: string;
  bankName: string;
};

export default function CausesGrid({ causes }: { causes: Cause[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = useMemo(() => {
    const set = new Set(causes.map((c) => c.category));
    return ["All", ...Array.from(set)];
  }, [causes]);

  const filtered = useMemo(() => {
    return causes.filter((c) => {
      const matchesSearch =
        !search ||
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.org.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "All" || c.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [causes, search, category]);

  return (
    <section>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <svg className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search causes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-stone-200 bg-white py-2.5 pl-10 pr-4 text-sm placeholder-stone-400 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                category === cat
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-white text-stone-600 ring-1 ring-stone-200 hover:bg-stone-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-sm ring-1 ring-stone-200">
          <p className="text-lg font-medium text-stone-900">No causes found</p>
          <p className="mt-1 text-sm text-stone-500">Try adjusting your search or filter.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((cause) => {
            const pct = Math.round((cause.raised / cause.goal) * 100);
            return (
              <Link
                key={cause.id}
                href={`/causes/${cause.id}`}
                className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200 transition hover:shadow-md"
              >
                <div className="flex h-40 items-center justify-center bg-gradient-to-br from-emerald-50 to-amber-50 text-5xl">
                  {cause.emoji}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-stone-900 group-hover:text-emerald-700">{cause.title}</p>
                      <p className="mt-0.5 text-sm text-stone-500">{cause.org}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                      {cause.category}
                    </span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-stone-100">
                    <div className="h-full rounded-full bg-emerald-600 transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="mt-2 flex justify-between text-sm">
                    <span className="font-medium text-emerald-700">{formatNaira(cause.raised)}</span>
                    <span className="text-stone-500">{pct}% of {formatNaira(cause.goal)}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-3 text-xs text-stone-400">
                    <span>{cause.donorCount} donors</span>
                    <span>{cause.daysLeft} days left</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
