"use client";

import { signOut } from "next-auth/react";
import Button from "./ui/Button";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const handleLogout = () => {
    signOut({ callbackUrl: "/auth/signin" });
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleLogout}>
      <LogOut className="w-4 h-4 mr-2" />
      ออกจากระบบ
    </Button>
  );
}

