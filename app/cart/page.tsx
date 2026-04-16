"use client";

import { useCartStore } from "@/store/cartStore";
import Button from "@/components/UI/Button";
import Link from "next/link";
import { Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function CartPage() {
  // Prevent hydration errors with Zustand persist
  const [mounted, setMounted] = useState(false);
  const cart = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="pt-32 pb-24 min-h-screen bg-white dark:bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-serif font-bold mb-12">Shopping Cart</h1>

        {cart.items.length === 0 ? (
          <div className="text-center py-20 border-y border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-serif mb-4">Your cart is empty</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">Looks like you haven't added anything to your cart yet. Explore our collections and find something you love.</p>
            <Link href="/women">
              <Button size="lg" className="w-48 tracking-widest">Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
            
            {/* Cart Items */}
            <div className="flex-1">
              <div className="hidden sm:grid grid-cols-12 gap-4 pb-4 border-b border-gray-200 dark:border-gray-800 text-xs font-semibold uppercase tracking-widest text-gray-500 mb-6">
                <div className="col-span-6">Product</div>
                <div className="col-span-3 text-center">Quantity</div>
                <div className="col-span-3 text-right">Total</div>
              </div>

              <div className="space-y-8">
                {cart.items.map((item) => (
                  <div key={item.id} className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center border-b border-gray-100 dark:border-gray-900 pb-8">
                    
                    <div className="col-span-1 sm:col-span-6 flex gap-6">
                      <div className="w-24 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col justify-center">
                        <h3 className="font-semibold mb-1 text-sm"><Link href={`/product/${item.productId}`}>{item.name}</Link></h3>
                        <p className="text-gray-500 text-xs mb-3">Color: {item.color} <span className="mx-2">|</span> Size: {item.size}</p>
                        <button 
                          onClick={() => cart.removeItem(item.id)}
                          className="text-xs uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 w-fit mt-auto"
                        >
                          <Trash2 className="w-3 h-3" /> Remove
                        </button>
                      </div>
                    </div>

                    <div className="col-span-1 sm:col-span-3 flex justify-start sm:justify-center items-center">
                      <div className="flex items-center justify-between border border-gray-200 dark:border-gray-800 w-28 h-10 px-3">
                        <button 
                          onClick={() => cart.updateQuantity(item.id, Math.max(1, item.quantity - 1))} 
                          className="text-gray-500 hover:text-black dark:hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-medium text-sm">{item.quantity}</span>
                        <button 
                          onClick={() => cart.updateQuantity(item.id, item.quantity + 1)} 
                          className="text-gray-500 hover:text-black dark:hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="col-span-1 sm:col-span-3 text-left sm:text-right font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-96 flex-shrink-0">
              <div className="bg-gray-50 dark:bg-[#111] p-8 rounded-xl border border-gray-100 dark:border-gray-800 sticky top-32">
                <h3 className="text-lg font-serif font-bold mb-6">Order Summary</h3>
                
                <div className="space-y-4 mb-6 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${cart.totalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-800 pt-6 mb-8 flex justify-between items-center font-semibold text-lg">
                  <span>Total</span>
                  <span>${cart.totalPrice().toFixed(2)}</span>
                </div>

                <Link href="/checkout">
                  <Button size="lg" className="w-full h-14 bg-black hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-200 group">
                    Proceed to Checkout <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>

                <div className="mt-6 flex justify-center gap-4 text-gray-400">
                   {/* Payment icons mock */}
                   <div className="w-10 h-6 bg-gray-200 dark:bg-gray-800 rounded"></div>
                   <div className="w-10 h-6 bg-gray-200 dark:bg-gray-800 rounded"></div>
                   <div className="w-10 h-6 bg-gray-200 dark:bg-gray-800 rounded"></div>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
