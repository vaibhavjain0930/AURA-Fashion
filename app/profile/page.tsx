"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogOut, Package, MapPin, CreditCard, ChevronRight, Truck, CheckCircle2, Clock } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import Button from "@/components/UI/Button";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { isAuthenticated, user, orders, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) return null;

  const handleLogout = () => {
    logout();
    toast.success("Successfully logged out.");
    router.push("/login");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'Shipped': return <Truck className="w-5 h-5 text-blue-500" />;
      default: return <Clock className="w-5 h-5 text-orange-500" />;
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 bg-[#fafafa] dark:bg-[#090a0f]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-16"
        >
          {/* Avatar Profile Image using First Name Initial */}
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 text-white dark:text-gray-900 flex items-center justify-center text-5xl font-serif font-bold shadow-xl flex-shrink-0">
            {user.firstName?.charAt(0).toUpperCase()}
          </div>
          
          <div className="text-center md:text-left flex-1">
            <h1 className="text-4xl font-serif font-bold tracking-tight mb-2">
              Welcome, {user.firstName} {user.lastName}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 font-light mb-6">
              Manage your personal details and view your exclusive orders.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <span className="px-4 py-2 rounded-full border border-gray-200 dark:border-gray-800 text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" /> Default Address Set
              </span>
              <span className="px-4 py-2 rounded-full border border-gray-200 dark:border-gray-800 text-sm flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-gray-400" /> Payment Saved
              </span>
            </div>
          </div>

          <Button variant="ghost" onClick={handleLogout} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 flex items-center gap-2">
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Profile Details Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1 space-y-6"
          >
            <div className="bg-white dark:bg-[#111218] p-6 rounded-2xl border border-gray-100 dark:border-[#1a1c23]">
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                Personal Information
              </h3>
              
              <div className="space-y-4 text-sm">
                <div>
                  <span className="block text-xs uppercase tracking-widest text-gray-500 mb-1">Full Name</span>
                  <span className="font-medium text-gray-900 dark:text-white">{user.firstName} {user.lastName}</span>
                </div>
                <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                  <span className="block text-xs uppercase tracking-widest text-gray-500 mb-1">Email Address</span>
                  <span className="font-medium text-gray-900 dark:text-white">{user.email}</span>
                </div>
                <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                  <span className="block text-xs uppercase tracking-widest text-gray-500 mb-1">Phone Number</span>
                  <span className="font-medium text-gray-900 dark:text-white">{user.phone}</span>
                </div>
              </div>

              <Button variant="outline" className="w-full mt-8">
                Edit Details
              </Button>
            </div>
          </motion.div>

          {/* Order History */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-serif font-bold flex items-center gap-3">
                <Package className="w-6 h-6" /> Order History
              </h2>
            </div>
            
            {orders.length === 0 ? (
              <div className="bg-white dark:bg-[#111218] p-10 rounded-2xl border border-gray-100 dark:border-[#1a1c23] text-center">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Orders Yet</h3>
                <p className="text-gray-500 dark:text-gray-400 font-light mb-6">You haven't placed any orders with AURA yet.</p>
                <Button onClick={() => router.push('/')}>Start Shopping</Button>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white dark:bg-[#111218] rounded-2xl border border-gray-100 dark:border-[#1a1c23] overflow-hidden group">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-black/20 flex flex-wrap justify-between items-center gap-4">
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-widest text-gray-500 block mb-1">Order ID</span>
                        <span className="font-mono text-sm tracking-tight">{order.id}</span>
                      </div>
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-widest text-gray-500 block mb-1">Date</span>
                        <span className="text-sm">{new Date(order.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-widest text-gray-500 block mb-1">Total</span>
                        <span className="text-sm font-semibold">${order.total.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-white dark:bg-[#1a1c23] px-3 py-1.5 rounded-full shadow-sm border border-gray-100 dark:border-gray-800">
                        {getStatusIcon(order.status)}
                        <span className="text-sm font-medium">{order.status}</span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="space-y-4">
                        {order.items.map(item => (
                          <div key={item.id} className="flex gap-4 items-center">
                            <div className="w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-900 overflow-hidden flex-shrink-0">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">{item.name}</h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                              </p>
                            </div>
                            <div className="text-sm font-medium">
                              ${item.price.toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                        <Button variant="ghost" size="sm" className="flex items-center gap-1 group-hover:bg-gray-100 dark:group-hover:bg-gray-800">
                          Track Order <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
}
