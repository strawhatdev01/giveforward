import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GiveForward — Give with transparency",
  description: "Support verified causes across Nigeria and track every donation in real time.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* always light — keeps form inputs readable and the UI consistent */}
      <body className="bg-stone-50 text-stone-900 antialiased">
        {children}
      </body>
    </html>
  );
}
