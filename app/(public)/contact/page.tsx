import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="container py-20 px-4 md:px-6">
      <div className="grid md:grid-cols-2 gap-12">
        
        {/* Left: Info */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-4">Visit Us</h1>
            <p className="text-zinc-500 text-lg">
              We are located in the heart of the downtown culinary district.
              Walk-ins are welcome, but we suggest booking ahead.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex gap-4">
              <MapPin className="text-orange-600 shrink-0" />
              <div>
                <h3 className="font-semibold">Address</h3>
                <p className="text-zinc-600">123 Culinary Ave, Food District<br />Metropolis, NY 10012</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Phone className="text-orange-600 shrink-0" />
              <div>
                <h3 className="font-semibold">Phone</h3>
                <p className="text-zinc-600">+1 (555) 123-4567</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Clock className="text-orange-600 shrink-0" />
              <div>
                <h3 className="font-semibold">Hours</h3>
                <div className="text-zinc-600 space-y-1">
                  <p>Mon-Fri: 11am - 10pm</p>
                  <p>Sat-Sun: 10am - 11pm</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Map Placeholder */}
        <div className="bg-zinc-100 rounded-xl min-h-[400px] flex items-center justify-center border">
          <p className="text-zinc-400 font-medium">Google Maps Embed Goes Here</p>
          {/* <iframe ... ></iframe> */}
        </div>
      </div>
    </div>
  );
}