"use client";

import LoginForm from "@/components/Layout/LoginForm";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/profile");
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) return null;

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center bg-gray-50 dark:bg-[#0a0a0a]">
      <LoginForm />
    </div>
  );
}
