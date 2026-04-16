"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import Button from "@/components/UI/Button";

export default function ContactPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#fafafa] dark:bg-[#090a0f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight mb-4">
            Get In Touch
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-light">
            We are here to assist with your shopping experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-12"
          >
            <div>
              <h3 className="text-2xl font-serif font-semibold mb-6">
                Concierge Services
              </h3>
              <p className="text-gray-600 dark:text-gray-300 font-light mb-8 leading-relaxed">
                Whether you need styling advice, have a question about an order,
                or need assistance navigating our AI Virtual Try-On, our
                dedicated concierge team is available around the clock.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white dark:bg-[#111218] border border-gray-200 dark:border-[#1a1c23] flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Phone className="w-4 h-4 text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm uppercase tracking-widest text-gray-900 dark:text-white">
                      Phone
                    </h4>
                    <p className="text-gray-500 mt-1 font-light">
                      +1 (800) 123-4567
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Mon-Fri, 9am - 6pm EST
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white dark:bg-[#111218] border border-gray-200 dark:border-[#1a1c23] flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Mail className="w-4 h-4 text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm uppercase tracking-widest text-gray-900 dark:text-white">
                      Email
                    </h4>
                    <p className="text-gray-500 mt-1 font-light">
                      concierge@aurafashion.com
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      24/7 Priority Support
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white dark:bg-[#111218] border border-gray-200 dark:border-[#1a1c23] flex items-center justify-center flex-shrink-0 shadow-sm">
                    <MapPin className="w-4 h-4 text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm uppercase tracking-widest text-gray-900 dark:text-white">
                      Flagship Studio
                    </h4>
                    <p className="text-gray-500 mt-1 font-light">
                      123 Fashion Avenue
                      <br />
                      New York, NY 10001
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white dark:bg-[#111218] p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100 dark:border-[#1a1c23]"
          >
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 py-3 outline-none focus:border-black dark:focus:border-white transition-colors text-sm font-medium"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 py-3 outline-none focus:border-black dark:focus:border-white transition-colors text-sm font-medium"
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
                  Inquiry Type
                </label>
                <select className="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 py-3 outline-none focus:border-black dark:focus:border-white transition-colors text-sm font-medium appearance-none">
                  <option value="order" className="dark:bg-[#111218]">
                    Order Status
                  </option>
                  <option value="stylist" className="dark:bg-[#111218]">
                    AI Stylist Assistance
                  </option>
                  <option value="returns" className="dark:bg-[#111218]">
                    Returns & Exchanges
                  </option>
                  <option value="other" className="dark:bg-[#111218]">
                    Other Inquiries
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
                  Message
                </label>
                <textarea
                  rows={4}
                  className="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 py-3 outline-none focus:border-black dark:focus:border-white transition-colors text-sm font-medium resize-none"
                  placeholder="How can we help you today?"
                  required
                ></textarea>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> Send Message
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
