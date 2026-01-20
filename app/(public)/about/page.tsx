import Image from "next/image";
import { Award, Leaf, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col w-full">
      
      {/* --- 1. Hero Header --- */}
      <section className="relative h-[400px] flex items-center justify-center bg-zinc-900 text-white overflow-hidden">
        {/* Background Image Placeholder */}
        <div className="absolute inset-0 bg-zinc-800 opacity-50 z-0">
             {/* In production, use next/image with object-cover here */}
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-3xl space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Crafting Memories, <br /> One Plate at a Time
          </h1>
          <p className="text-lg text-zinc-200">
            Where traditional culinary artistry meets modern hospitality.
          </p>
        </div>
      </section>

      {/* --- 2. Our Story (The Narrative) --- */}
      <section className="container py-20 px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900">
              Our Journey
            </h2>
            <div className="space-y-4 text-zinc-600 leading-relaxed">
              <p>
                Founded in 2023, Lumière Bistro began with a simple but ambitious goal: 
                to serve Michelin-quality food without the pretension or the wait.
              </p>
              <p>
                We believe that dining out should be a seamless experience. That is why 
                we have invested heavily in integrating technology into our service model. 
                From the moment you scan your menu to the final bite of dessert, 
                our focus is on minimizing distractions so you can focus on the food and 
                the company you are with.
              </p>
              <p>
                We source our ingredients from local farms in the tri-state area, 
                ensuring that every dish supports our local community and reduces our carbon footprint.
              </p>
            </div>
          </div>
          
          {/* Visual: Image Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4 mt-8">
              <div className="h-48 bg-zinc-200 rounded-lg w-full relative overflow-hidden">
                {/* <Image src="/chef-cooking.jpg" alt="Chef" fill className="object-cover" /> */}
              </div>
              <div className="h-32 bg-zinc-100 rounded-lg w-full"></div>
            </div>
            <div className="space-y-4">
              <div className="h-32 bg-zinc-100 rounded-lg w-full"></div>
              <div className="h-48 bg-zinc-200 rounded-lg w-full relative overflow-hidden">
                {/* <Image src="/restaurant-interior.jpg" alt="Interior" fill className="object-cover" /> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 3. Our Values (Three Pillars) --- */}
      <section className="bg-zinc-50 py-20 border-y">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            
            <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-xl shadow-sm">
              <div className="p-3 bg-orange-100 text-orange-600 rounded-full">
                <Leaf size={32} />
              </div>
              <h3 className="text-xl font-bold">Sustainable Sourcing</h3>
              <p className="text-zinc-500">
                90% of our ingredients are organic and sourced within 50 miles of the restaurant.
              </p>
            </div>

            <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-xl shadow-sm">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-bold">Community First</h3>
              <p className="text-zinc-500">
                We are more than a business; we are a gathering place for neighbors, friends, and families.
              </p>
            </div>

            <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-xl shadow-sm">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-full">
                <Award size={32} />
              </div>
              <h3 className="text-xl font-bold">Culinary Excellence</h3>
              <p className="text-zinc-500">
                Led by Executive Chef Gordon, our kitchen maintains rigorous standards of quality.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* --- 4. Meet the Chef --- */}
      <section className="container py-20 px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="w-full md:w-1/3 aspect-square bg-zinc-200 rounded-full relative overflow-hidden shrink-0">
             {/* <Image src="/head-chef.jpg" alt="Head Chef" fill className="object-cover" /> */}
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Meet Executive Chef Gordon</h2>
            <blockquote className="text-xl italic text-zinc-600 border-l-4 border-orange-500 pl-4">
              "Cooking is about discipline and passion. But running a great restaurant is about 
              respecting the guest's time. That is why we built a system that lets us focus 
              entirely on the art of cooking, while technology handles the logistics."
            </blockquote>
            <p className="text-zinc-500">
              With over 15 years of experience in Paris and New York, Chef Gordon brings 
              a refined yet accessible approach to modern dining.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}