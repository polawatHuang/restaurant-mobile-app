import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* --- Header --- */}
      <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="bg-zinc-900 text-white p-1 rounded-md">
              <UtensilsCrossed size={20} />
            </div>
            <span>Lumière Bistro</span>
          </Link>
          
          <nav className="hidden md:flex gap-6 text-sm font-medium text-zinc-600">
            <Link href="/" className="hover:text-zinc-900 transition-colors">Home</Link>
            <Link href="/menu-preview" className="hover:text-zinc-900 transition-colors">Menu</Link>
            <Link href="/about" className="hover:text-zinc-900 transition-colors">Our Story</Link>
            <Link href="/contact" className="hover:text-zinc-900 transition-colors">Contact</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link 
              href="/auth/login" 
              className="text-sm font-medium text-zinc-500 hover:text-zinc-900"
            >
              Staff Login
            </Link>
            <Link
              href="/book" // Placeholder for reservation system
              className="hidden sm:inline-flex h-9 items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-zinc-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950"
            >
              Book a Table
            </Link>
          </div>
        </div>
      </header>

      {/* --- Main Content --- */}
      <main className="flex-1">
        {children}
      </main>

      {/* --- Footer --- */}
      <footer className="border-t bg-zinc-50 py-10 text-zinc-500">
        <div className="container px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm">
            © {new Date().getFullYear()} Lumière Bistro. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm">
            <Link href="#" className="hover:underline">Privacy</Link>
            <Link href="#" className="hover:underline">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}