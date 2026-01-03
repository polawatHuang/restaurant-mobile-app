import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await getServerSession(authOptions);

  // If NOT logged in, assume it's a customer and send them to the branch selection
  if (!session) {
    redirect("/user/select-branch");
  }

  // If logged in, redirect based on their specific role
  if (session.user.role === "ADMIN") {
    redirect("/admin/dashboard");
  } else if (session.user.role === "COOKER") {
    redirect("/cooker/orders");
  } else {
    // Logged in standard users also go here
    redirect("/user/select-branch");
  }
}