import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GiveForward — Give with transparency",
  description: "Support verified causes across Nigeria and track every donation in real time.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-stone-50 text-stone-900 antialiased">
        <div className="mx-auto min-h-screen max-w-md bg-white shadow-sm">{children}</div>
      </body>
    </html>
  );
}
