"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Plus } from "lucide-react";
import Link from "next/link";
import Button from "@/components/UI/Button";

const FAQs = [
  {
    question: "How does the AI Virtual Try-On work?",
    answer: "Our AI Virtual Try-On uses advanced computer vision. You simply upload a photo or use your webcam to capture your frame. The AI then seamlessly maps the selected garment onto your body, intelligently adjusting for lighting, fabric drape, and your specific proportions."
  },
  {
    question: "Is my personal data and photo secure?",
    answer: "Absolutely. We do not store your personal photos permanently unless you explicitly save them to your fashion profile. All processing is done via secure, encrypted channels utilizing enterprise-grade Gemini APIs."
  },
  {
    question: "How accurate is the sizing recommendation?",
    answer: "Our Smart Sizer cross-references the measurements of the garment with the visual data from your Try-On and standard fit histories to provide a 95% accurate sizing recommendation. We also offer free returns if it doesn't fit perfectly."
  },
  {
    question: "Do you ship internationally?",
    answer: "Yes, we ship globally via priority secure networking. International duties and taxes are calculated directly at checkout so there are no surprises upon delivery."
  },
  {
    question: "Can I modify or cancel my order?",
    answer: "Orders can be modified or cancelled within 2 hours of placement. After this window, the logistics team assumes processing. You can always use our 30-Day Guarantee to return items once they arrive."
  }
];

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#fafafa] dark:bg-[#090a0f]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-xs uppercase tracking-widest text-[#4285F4] font-semibold mb-2 block">Support</span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight mb-4">FAQ & Help Center</h1>
          <p className="text-gray-500 dark:text-gray-400 font-light">Find answers to common questions about AURA's shopping and AI features.</p>
        </motion.div>

        {/* FAQs */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="space-y-4 mb-16"
        >
          {FAQs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-[#111218] border border-gray-100 dark:border-[#1a1c23] rounded-2xl overflow-hidden shadow-sm"
            >
              <button 
                className="w-full px-6 py-5 flex justify-between items-center text-left focus:outline-none"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-semibold text-gray-900 dark:text-white pr-4">{faq.question}</span>
                <motion.div 
                  animate={{ rotate: openIndex === index ? 45 : 0 }}
                  className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-50 dark:bg-[#1a1c23] flex items-center justify-center"
                >
                  <Plus className="w-4 h-4 text-gray-500" />
                </motion.div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-6 pb-6 text-gray-600 dark:text-gray-400 font-light text-sm leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>

        {/* Still Need Help Block */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-gradient-to-br from-gray-900 to-black dark:from-gray-100 dark:to-white p-10 rounded-3xl text-center shadow-2xl"
        >
          <h2 className="text-2xl font-serif font-bold text-white dark:text-black mb-4">Still Need Help?</h2>
          <p className="text-gray-400 dark:text-gray-600 font-light mb-8 max-w-lg mx-auto">
            Our luxury concierge team is ready to assist you with styling, order inquiries, and technical support.
          </p>
          <Link href="/contact">
            <Button size="lg" className="bg-white text-black dark:bg-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800">
              Contact Concierge
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
