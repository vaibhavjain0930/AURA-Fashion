"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#fafafa] dark:bg-[#090a0f]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight mb-6">Our Story</h1>
          <div className="h-[2px] w-24 bg-black dark:bg-white mx-auto"></div>
        </motion.div>

        <div className="space-y-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row gap-12 items-center"
          >
            <div className="w-full md:w-1/2 aspect-[4/5] relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80" 
                alt="AURA Fashion Studio" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-full md:w-1/2 space-y-6">
              <h2 className="text-3xl font-serif font-semibold">The Vision</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 font-light leading-relaxed">
                AURA was born from a singular, uncompromising vision: to perfectly marry the timeless elegance of minimalist luxury fashion with the limitless potential of artificial intelligence. 
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 font-light leading-relaxed">
                We believe that finding the perfect piece isn&apos;t just about browsing; it&apos;s about visualizing yourself in a new era. Our proprietary AI Try-On engine bridges the gap between digital discovery and physical reality, allowing you to curate your wardrobe with unprecedented confidence.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col-reverse md:flex-row-reverse gap-12 items-center"
          >
            <div className="w-full md:w-1/2 aspect-[4/5] relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80" 
                alt="AURA Craftsmanship" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-full md:w-1/2 space-y-6">
              <h2 className="text-3xl font-serif font-semibold">Our Craft</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 font-light leading-relaxed">
                Behind the groundbreaking technology lies a deep reverence for traditional craftsmanship. Every garment in the AURA collection is ethically sourced and meticulously crafted from premium, sustainable materials.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 font-light leading-relaxed">
                We partner with select artisanal workshops around the globe to ensure that what looks perfect on screen feels transcendent when you wear it. Welcome to the future of high fashion.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
