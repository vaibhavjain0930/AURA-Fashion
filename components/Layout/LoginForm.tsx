"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import Button from "@/components/UI/Button";
import Input from "@/components/UI/Input";
import { User, Lock, Mail } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

const schema = yup.object({
  email: yup.string().email("Please enter a valid email").required("Email is required"),
  password: yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
}).required();

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const login = useAuthStore(state => state.login);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = (data: any) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Faking profile data for mock login, since real login drops full user payloads 
      login({
        firstName: data.email.split('@')[0],
        lastName: 'User',
        email: data.email,
        phone: "+1 (555) 000-0000",
      });
      toast.success("Welcome back!");
      router.push("/profile");
    }, 1500);
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 glass rounded-2xl border-gray-200 dark:border-gray-800 shadow-sm relative overflow-hidden">
      
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-3xl -mx-4 -my-4"></div>

      <div className="text-center mb-10 relative z-10">
        <h2 className="text-3xl font-serif font-bold mb-2">Welcome Back</h2>
        <p className="text-gray-500 text-sm font-light">Enter your credentials to access your account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
        
        <div className="relative">
          <Input 
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            {...register("email")}
            error={errors.email?.message}
          />
          <Mail className="w-4 h-4 text-gray-400 absolute right-1 top-8" />
        </div>

        <div className="relative">
          <Input 
            label="Password"
            type="password"
            placeholder="••••••••"
            {...register("password")}
            error={errors.password?.message}
          />
          <Lock className="w-4 h-4 text-gray-400 absolute right-1 top-8" />
        </div>

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="accent-black dark:accent-white" />
            <span className="text-gray-600 dark:text-gray-400">Remember me</span>
          </label>
          <a href="#" className="font-semibold underline text-gray-900 dark:text-gray-100 hover:text-black transition-colors">Forgot Password?</a>
        </div>

        <Button 
          type="submit" 
          size="lg" 
          className="w-full shadow-lg h-14 tracking-widest"
          isLoading={isLoading}
        >
          Sign In
        </Button>
      </form>

      <div className="mt-8 text-center text-sm text-gray-500 relative z-10">
        Don't have an account? <a href="/register" className="font-semibold text-black dark:text-white underline ml-1">Create one</a>
      </div>
    </div>
  );
}
