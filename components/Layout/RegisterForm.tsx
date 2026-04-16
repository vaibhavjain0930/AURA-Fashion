"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Button from "@/components/UI/Button";
import Input from "@/components/UI/Input";
import { User, Lock, Mail, Phone } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

const schema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  phone: yup.string().required("Phone number is required"),
  email: yup.string().email("Please enter a valid email").required("Email is required"),
  password: yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
}).required();

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const login = useAuthStore(state => state.login);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = (data: any) => {
    setIsLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setIsLoading(false);
      // Authenticate user via Zustand
      login({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone
      });
      toast.success("Account created successfully! Welcome to AURA.");
      router.push("/profile");
    }, 1500);
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 glass rounded-2xl border-gray-200 dark:border-gray-800 shadow-sm relative overflow-hidden">
      
      {/* Decorative gradient */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl -mx-4 -my-4"></div>

      <div className="text-center mb-10 relative z-10">
        <h2 className="text-3xl font-serif font-bold mb-2">Create Account</h2>
        <p className="text-gray-500 text-sm font-light">Join the AURA exclusive membership</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative z-10">
        
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <Input 
              label="First Name"
              type="text"
              placeholder="John"
              {...register("firstName")}
              error={errors.firstName?.message}
            />
            <User className="w-4 h-4 text-gray-400 absolute right-1 top-8" />
          </div>
          <div className="relative">
            <Input 
              label="Last Name"
              type="text"
              placeholder="Doe"
              {...register("lastName")}
              error={errors.lastName?.message}
            />
          </div>
        </div>

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
            label="Phone Number"
            type="tel"
            placeholder="+1 (555) 000-0000"
            {...register("phone")}
            error={errors.phone?.message}
          />
          <Phone className="w-4 h-4 text-gray-400 absolute right-1 top-8" />
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

        <div className="pt-2">
          <Button 
            type="submit" 
            size="lg" 
            className="w-full shadow-lg h-14 tracking-widest text-white bg-black hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            isLoading={isLoading}
          >
            Create Account
          </Button>
        </div>
      </form>

      <div className="mt-8 text-center text-sm text-gray-500 relative z-10">
        Already have an account? <a href="/login" className="font-semibold text-black dark:text-white underline ml-1">Sign In</a>
      </div>
    </div>
  );
}
