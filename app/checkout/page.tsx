"use client";

import { useCartStore } from "@/store/cartStore";
import Button from "@/components/UI/Button";
import Input from "@/components/UI/Input";
import { Lock, ShieldCheck, Truck, CheckCircle2, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";

export default function CheckoutPage() {
  const [mounted, setMounted] = useState(false);
  const cart = useCartStore();
  const { register, handleSubmit } = useForm();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onSubmit = (data: any) => {
    setIsProcessing(true);
    
    // Save order snapshot before clearing cart
    const orderSnapshot = {
        items: [...cart.items],
        total: cart.totalPrice(),
        customer: data,
        orderId: `AURA-${Math.floor(Math.random() * 1000000)}`,
        date: new Date().toLocaleDateString()
    };

    setTimeout(() => {
      setIsProcessing(false);
      setOrderDetails(orderSnapshot);
      setIsSuccess(true);
      cart.clearCart();
    }, 2000);
  };

  if (!mounted) return null;

  if (isSuccess && orderDetails) {
      return (
          <div className="pt-32 pb-16 min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex justify-center px-4">
              <div className="w-full max-w-3xl bg-white dark:bg-[#111] p-8 md:p-12 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800">
                  <div className="text-center mb-10">
                      <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                          <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-500" />
                      </div>
                      <h1 className="text-3xl font-serif font-bold mb-2">Order Confirmed</h1>
                      <p className="text-gray-500">Thank you for your purchase. Your invoice is below.</p>
                  </div>

                  {/* Invoice Form */}
                  <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-8 mb-8">
                      <div className="flex justify-between items-start mb-8 pb-8 border-b border-gray-200 dark:border-gray-800">
                          <div>
                              <h2 className="text-2xl font-serif font-bold tracking-tighter mb-1">AURA</h2>
                              <p className="text-xs text-gray-500">Luxury fashion, redefined.</p>
                          </div>
                          <div className="text-right">
                              <p className="text-sm font-semibold mb-1">Invoice #{orderDetails.orderId}</p>
                              <p className="text-xs text-gray-500">{orderDetails.date}</p>
                          </div>
                      </div>

                      <div className="grid grid-cols-2 gap-8 mb-8 text-sm">
                          <div>
                              <p className="font-semibold text-gray-400 uppercase tracking-widest text-xs mb-2">Billed To</p>
                              <p className="font-medium">{orderDetails.customer.firstName} {orderDetails.customer.lastName}</p>
                              <p className="text-gray-500 mt-1">{orderDetails.customer.email}</p>
                              <p className="text-gray-500">{orderDetails.customer.address}</p>
                              <p className="text-gray-500">{orderDetails.customer.city}, {orderDetails.customer.zip}</p>
                          </div>
                      </div>

                      <div className="space-y-4 mb-8">
                          <div className="grid grid-cols-12 text-xs font-semibold uppercase tracking-widest text-gray-400 pb-2 border-b border-gray-100 dark:border-gray-800">
                              <div className="col-span-6">Item</div>
                              <div className="col-span-2 text-center">Qty</div>
                              <div className="col-span-4 text-right">Amount</div>
                          </div>
                          
                          {orderDetails.items.map((item: any) => (
                              <div key={item.id} className="grid grid-cols-12 text-sm items-center py-2">
                                  <div className="col-span-6">
                                      <p className="font-medium truncate">{item.name}</p>
                                      <p className="text-xs text-gray-500">{item.color} / {item.size}</p>
                                  </div>
                                  <div className="col-span-2 text-center text-gray-600 dark:text-gray-400">{item.quantity}</div>
                                  <div className="col-span-4 text-right font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                              </div>
                          ))}
                      </div>

                      <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-800">
                          <div className="w-1/2 space-y-3 text-sm">
                              <div className="flex justify-between text-gray-500">
                                  <span>Subtotal</span>
                                  <span>${orderDetails.total.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-gray-500">
                                  <span>Shipping</span>
                                  <span>$0.00</span>
                              </div>
                              <div className="flex justify-between text-gray-500">
                                  <span>Tax (Estimated)</span>
                                  <span>${(orderDetails.total * 0.08).toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-200 dark:border-gray-800">
                                  <span>Total</span>
                                  <span>${(orderDetails.total * 1.08).toFixed(2)}</span>
                              </div>
                          </div>
                      </div>
                  </div>

                  <div className="flex gap-4">
                      <Button variant="outline" className="flex-1 flex gap-2 justify-center" onClick={() => window.print()}>
                          <Download className="w-4 h-4" /> Download PDF
                      </Button>
                      <Link href="/" className="flex-1">
                          <Button className="w-full h-full">Continue Shopping</Button>
                      </Link>
                  </div>
              </div>
          </div>
      );
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
           <h1 className="text-4xl font-serif font-bold mb-4">Checkout</h1>
           <div className="flex items-center justify-center gap-2 text-sm text-green-600 dark:text-green-500 font-medium">
             <Lock className="w-4 h-4" /> Secure SSL Encryption
           </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          
          {/* Form Content */}
          <div className="flex-1 space-y-12">
            
            {/* Contact */}
            <section className="space-y-6 bg-white dark:bg-[#111] p-8 rounded-2xl border border-gray-200 dark:border-gray-800">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-serif font-semibold">1. Contact Information</h2>
                <a href="/login" className="text-xs font-semibold underline text-gray-500">Log In</a>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Email address" type="email" required {...register("email")} />
                <Input label="Phone number" type="tel" {...register("phone")} />
              </div>
            </section>

            {/* Shipping */}
            <section className="space-y-6 bg-white dark:bg-[#111] p-8 rounded-2xl border border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-serif font-semibold mb-6">2. Shipping Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="First name" required {...register("firstName")} />
                <Input label="Last name" required {...register("lastName")} />
                <div className="md:col-span-2">
                  <Input label="Address" required {...register("address")} />
                </div>
                <Input label="City" required {...register("city")} />
                <Input label="Postal code" required {...register("zip")} />
                <div className="md:col-span-2">
                   <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4 mt-4">Shipping Method</h3>
                   <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex justify-between items-center cursor-pointer bg-gray-50 dark:bg-[#1a1a1a]">
                      <div className="flex items-center gap-4">
                         <div className="w-5 h-5 rounded-full border-4 border-black dark:border-white"></div>
                         <div>
                            <p className="font-semibold text-sm">Standard Shipping</p>
                            <p className="text-xs text-gray-500">3-5 business days</p>
                         </div>
                      </div>
                      <span className="font-medium text-sm">Free</span>
                   </div>
                </div>
              </div>
            </section>

            {/* Payment */}
            <section className="space-y-6 bg-white dark:bg-[#111] p-8 rounded-2xl border border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-serif font-semibold mb-6">3. Payment</h2>
              <p className="text-sm text-gray-500 mb-6 flex items-center gap-2"><ShieldCheck className="w-4 h-4"/> All transactions are secure and encrypted.</p>
              
              <div className="space-y-4">
                <div className="border border-black dark:border-white rounded-lg p-4 bg-gray-50 dark:bg-[#1a1a1a]">
                  <div className="flex items-center gap-4 mb-6">
                     <div className="w-5 h-5 rounded-full border-4 border-black dark:border-white"></div>
                     <span className="font-semibold text-sm">Credit card</span>
                  </div>
                  <div className="space-y-4">
                    <Input label="Card number" placeholder="0000 0000 0000 0000" />
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Expiration date" placeholder="MM/YY" />
                      <Input label="Security code" placeholder="CVC" />
                    </div>
                    <Input label="Name on card" />
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Order Summary Sticky Sidebar */}
          <div className="w-full lg:w-96 flex-shrink-0">
            <div className="bg-white dark:bg-[#111] p-8 rounded-2xl border border-gray-200 dark:border-gray-800 sticky top-32">
              <h3 className="text-xl font-serif font-bold mb-6">Order Summary</h3>
              
              <div className="space-y-4 max-h-64 overflow-y-auto pr-2 mb-6 hide-scrollbar">
                {cart.items.map(item => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="relative w-16 h-20 bg-gray-100 rounded flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded" />
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-black text-white dark:bg-white dark:text-black rounded-full flex items-center justify-center text-[10px] font-bold">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 text-sm">
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-gray-500 text-xs">{item.color} / {item.size}</p>
                    </div>
                    <div className="text-sm font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-gray-200 dark:border-gray-800 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium">${cart.totalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping</span>
                  <span className="font-medium text-green-600 dark:text-green-500">Free</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-800 text-lg font-bold">
                  <span>Total</span>
                  <span>${cart.totalPrice().toFixed(2)}</span>
                </div>
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full h-14 mt-8 tracking-widest text-sm"
                isLoading={isProcessing}
                disabled={cart.items.length === 0}
              >
                Place Order
              </Button>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
                <Truck className="w-4 h-4" /> Free carbon-neutral shipping
              </div>

            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
