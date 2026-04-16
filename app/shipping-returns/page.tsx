"use client";

import { motion } from "framer-motion";
import { Truck, RefreshCw, Globe, Clock } from "lucide-react";

export default function ShippingReturnsPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#fafafa] dark:bg-[#090a0f]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight mb-4">Shipping & Returns</h1>
          <p className="text-gray-500 dark:text-gray-400 font-light">Everything you need to know about delivery and our guarantee.</p>
        </motion.div>

        <div className="space-y-16">
          {/* Shipping Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-200 dark:border-gray-800">
              <Truck className="w-6 h-6" />
              <h2 className="text-2xl font-serif font-semibold">Shipping Policies</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-[#111218] p-6 rounded-2xl border border-gray-100 dark:border-[#1a1c23]">
                <Clock className="w-5 h-5 mb-4 text-gray-400" />
                <h3 className="font-semibold text-lg mb-2">Domestic Delivery</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-light mb-4">
                  Complimentary standard shipping on all domestic orders over $200.
                </p>
                <ul className="text-sm space-y-2 text-gray-500 font-light">
                  <li className="flex justify-between"><span>Standard (3-5 Days)</span> <span>$10</span></li>
                  <li className="flex justify-between"><span>Express (2 Days)</span> <span>$25</span></li>
                  <li className="flex justify-between"><span>Overnight (Next Day)</span> <span>$45</span></li>
                </ul>
              </div>

              <div className="bg-white dark:bg-[#111218] p-6 rounded-2xl border border-gray-100 dark:border-[#1a1c23]">
                <Globe className="w-5 h-5 mb-4 text-gray-400" />
                <h3 className="font-semibold text-lg mb-2">International Delivery</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-light mb-4">
                  We ship globally via secure courier networks. Duties and taxes calculated at checkout.
                </p>
                <ul className="text-sm space-y-2 text-gray-500 font-light">
                  <li className="flex justify-between"><span>Europe (5-7 Days)</span> <span>$35</span></li>
                  <li className="flex justify-between"><span>Asia & Pacific (7-10 Days)</span> <span>$45</span></li>
                  <li className="flex justify-between"><span>Rest of World</span> <span>Calculated</span></li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Returns Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-200 dark:border-gray-800">
              <RefreshCw className="w-6 h-6" />
              <h2 className="text-2xl font-serif font-semibold">Return Policy</h2>
            </div>
            
            <div className="space-y-6 text-gray-600 dark:text-gray-300 font-light leading-relaxed">
              <p>
                At AURA, we want you to be completely satisfied with your purchase. Our AI Try-On guarantees highly accurate visualization, but we understand that sometimes a physical garment might not meet expectations.
              </p>
              
              <div className="bg-gray-50 dark:bg-[#111218] p-6 rounded-xl border border-gray-200 dark:border-[#1a1c23]">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">The 30-Day Guarantee</h4>
                <p className="text-sm">
                  We accept returns of unworn, unwashed, and undamaged items with all original tags attached within 30 days of the delivery date for a full refund.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">How to initiate a return:</h4>
                <ol className="list-decimal pl-5 space-y-2 text-sm">
                  <li>Visit our Returns Portal and enter your Order ID.</li>
                  <li>Select the items you wish to return and generate your prepaid shipping label.</li>
                  <li>Securely pack the items in the original packaging.</li>
                  <li>Drop off the package at any authorized courier location.</li>
                </ol>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
