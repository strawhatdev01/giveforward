import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-white mt-16">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl">❤️</span>
              <span className="text-lg font-bold text-emerald-700">GiveForward</span>
            </Link>
            <p className="mt-3 text-sm text-stone-500 leading-relaxed">
              A transparent, mobile-first donation platform connecting donors with verified causes across Nigeria.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-stone-900">Quick links</h3>
            <ul className="mt-3 space-y-2 text-sm text-stone-500">
              <li><Link href="/" className="hover:text-emerald-700">Browse causes</Link></li>
              <li><Link href="/about" className="hover:text-emerald-700">About us</Link></li>
              <li><Link href="/admin/login" className="hover:text-emerald-700">Admin</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-stone-900">Contact</h3>
            <ul className="mt-3 space-y-2 text-sm text-stone-500">
              <li>hello@giveforward.app</li>
              <li>Lagos, Nigeria</li>
              <li className="text-stone-400">DevCareer x Nomba Hackathon 2026</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-stone-100 pt-6 text-center text-xs text-stone-400">
          &copy; {new Date().getFullYear()} GiveForward. Built with ❤️ for the DevCareer x Nomba Hackathon.
        </div>
      </div>
    </footer>
  );
}
