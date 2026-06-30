import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-stone-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl">❤️</span>
          <span className="text-lg font-bold text-emerald-700">GiveForward</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/" className="font-medium text-stone-600 hover:text-emerald-700">Causes</Link>
          <Link href="/admin" className="font-medium text-stone-600 hover:text-emerald-700">Admin</Link>
        </nav>
      </div>
    </header>
  );
}
