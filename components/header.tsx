"use client";

import Link from "next/link";

export default function Header() {
  const scrollToCauses = () => {
    const el = document.getElementById("causes");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-stone-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl">❤️</span>
          <span className="text-lg font-bold text-emerald-700">GiveForward</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <button onClick={scrollToCauses} className="font-medium text-stone-600 hover:text-emerald-700 cursor-pointer">Causes</button>
          <Link href="/admin/login" className="font-medium text-stone-600 hover:text-emerald-700">Admin</Link>
        </nav>
      </div>
    </header>
  );
}
