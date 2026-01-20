import Link from "next/link";
import { ArrowRight, Smartphone, ChefHat, Clock } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      
      {/* --- Hero Section --- */}
      <section className="relative h-[600px] flex items-center justify-center bg-zinc-900 text-white overflow-hidden">
        {/* Abstract Background - Replace with a real restaurant image in production */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40" />
        
        <div className="relative container px-4 md:px-6 text-center space-y-6">
          <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Taste the Future of Dining
          </h1>
          <p className="mx-auto max-w-[700px] text-zinc-200 md:text-xl">
            Experience culinary excellence with the speed of modern technology. 
            Scan, Order, Enjoy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link 
              href="/menu-preview" 
              className="inline-flex h-12 items-center justify-center rounded-md bg-white text-zinc-900 px-8 text-sm font-medium shadow hover:bg-gray-100 transition-all"
            >
              View Menu
            </Link>
            <Link 
              href="/contact" 
              className="inline-flex h-12 items-center justify-center rounded-md border border-white text-white px-8 text-sm font-medium hover:bg-white/10 transition-all"
            >
              Find Us
            </Link>
          </div>
        </div>
      </section>

      {/* --- Features / How it Works --- */}
      <section className="py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Dining Reimagined
            </h2>
            <p className="text-zinc-500 max-w-2xl mx-auto">
              We've integrated state-of-the-art technology to ensure your food arrives 
              hotter, faster, and exactly how you like it.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Smartphone className="h-10 w-10 text-orange-500" />}
              title="Contactless Ordering"
              description="Simply scan the QR code at your table to browse our interactive menu and order instantly."
            />
            <FeatureCard 
              icon={<ChefHat className="h-10 w-10 text-orange-500" />}
              title="Chef-Driven Quality"
              description="Your order goes directly to the kitchen display system, reducing errors and wait times."
            />
            <FeatureCard 
              icon={<Clock className="h-10 w-10 text-orange-500" />}
              title="Real-Time Updates"
              description="Track your meal status from 'Preparing' to 'Served' directly on your phone."
            />
          </div>
        </div>
      </section>

      {/* --- CTA Section --- */}
      <section className="py-24 bg-zinc-50 border-t">
        <div className="container px-4 md:px-6 flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Ready to visit?
          </h2>
          <p className="text-zinc-500 mb-8 max-w-[600px]">
            We are open daily for lunch and dinner. Reservations are recommended for weekends.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-orange-600 font-semibold hover:gap-3 transition-all"
          >
            Get Directions <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex flex-col items-center text-center p-6 rounded-xl bg-zinc-50 border hover:shadow-lg transition-shadow">
      <div className="mb-4 p-3 bg-white rounded-full shadow-sm">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-zinc-500">{description}</p>
    </div>
  );
}