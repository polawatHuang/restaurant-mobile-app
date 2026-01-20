import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RMS Login | Restaurant OS",
  description: "Secure access for staff and administrators",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side: Visual/Branding */}
      <div className="hidden lg:flex flex-col justify-between bg-zinc-900 p-10 text-white">
        <div className="flex items-center gap-2 font-bold text-2xl">
          <div className="w-8 h-8 bg-white rounded-full" /> {/* Logo Placeholder */}
          Restaurant OS
        </div>
        <div>
          <blockquote className="space-y-2">
            <p className="text-lg">
              "This system revolutionized how we handle our Friday night rush. 
              The kitchen display system is a lifesaver."
            </p>
            <footer className="text-sm text-zinc-400">
              &mdash; Chef Gordon, Head Chef
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Right Side: The Form (children) */}
      <div className="flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md space-y-8">
          {children}
        </div>
      </div>
    </div>
  );
}