"use client";

import RegisterForm from "@/components/Layout/RegisterForm";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RegisterPage() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const router = useRouter();

  // Redirect to profile if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/profile");
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) return null; // Avoid flashing the form

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center bg-gray-50 dark:bg-[#0a0a0a]">
      <RegisterForm />
    </div>
  );
}
