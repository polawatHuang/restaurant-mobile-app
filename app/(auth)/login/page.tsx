"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Lock } from "lucide-react";

// 1. Zod Schema for Validation
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

type FormData = z.infer<typeof formSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 2. Form Setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 3. Submission Handler
  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        setError("Invalid email or password.");
        setIsLoading(false);
        return;
      }

      // 4. Role-Based Redirect Logic
      // We fetch the session to know where to send them
      // Note: In a real app, the `signIn` response doesn't return the role directly
      // unless you customize the response, so we do a quick check or let the middleware handle it.
      // Here, we refresh the router which triggers the middleware to route them correctly.
      router.refresh();
      router.push("/dashboard-router"); // A helper route (see explanation below)
      
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
      <div className="flex flex-col space-y-2 text-center mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-gray-500">
          Enter your credentials to access your terminal
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email Field */}
        <div className="space-y-2">
          <label 
            htmlFor="email" 
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Email
          </label>
          <input
            {...register("email")}
            id="email"
            placeholder="chef@restaurant.com"
            type="email"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            disabled={isLoading}
            className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent disabled:opacity-50"
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label 
            htmlFor="password" 
            className="text-sm font-medium leading-none"
          >
            Password
          </label>
          <div className="relative">
            <input
              {...register("password")}
              id="password"
              type="password"
              disabled={isLoading}
              className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent disabled:opacity-50"
            />
            <Lock className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-zinc-900 text-white hover:bg-zinc-900/90 h-10 px-4 py-2 w-full"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-500">
        <p>
          Need an account? Contact your <span className="underline cursor-help" title="Only Admins can create new staff accounts">System Administrator</span>.
        </p>
      </div>
    </div>
  );
}