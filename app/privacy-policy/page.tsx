"use client";

import { motion } from "framer-motion";

export default function PrivacyPolicyPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#fafafa] dark:bg-[#090a0f]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight mb-4">Privacy Policy</h1>
          <p className="text-gray-500 dark:text-gray-400 font-light text-sm">Last Updated: April 16, 2026</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="space-y-10 text-gray-600 dark:text-gray-300 font-light leading-relaxed"
        >
          <section>
            <h2 className="text-2xl font-serif font-semibold text-gray-900 dark:text-white mb-4">Introduction</h2>
            <p className="mb-4">
              At AURA Fashion, we merge cutting-edge artificial intelligence with luxury retail. Because our services involve personal styling and image processing, protecting your privacy and personal data is our highest priority.
            </p>
            <p>
              This Privacy Policy details how we collect, use, and protect your information when you visit our website, use our AI Virtual Try-On, or make a purchase.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-gray-900 dark:text-white mb-4">Data Collection & AI Usage</h2>
            <p className="mb-4">
              When you utilize the <strong>AURA AI Virtual Try-On</strong> and <strong>Smart Search</strong> features, we process images and text you provide utilizing Google Gemini GenAI APIs.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Photos & Images:</strong> Images uploaded for the Virtual Try-On are processed securely. We do <em>not</em> persistently store your facial data or biometric information to train public AI models.</li>
              <li><strong>Search Intent:</strong> Queries entered into our Smart Search are processed semantically to provide accurate results.</li>
              <li><strong>Data Retention:</strong> Temporary image tokens are destroyed immediately following the generation of your try-on preview.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-gray-900 dark:text-white mb-4">Payment & Account Information</h2>
            <p>
              We collect standard commerce information such as name, email, shipping address, and payment details. All payment processing is handled by compliant third-party gateways (e.g., Stripe). We do not store your raw credit card information on our servers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-gray-900 dark:text-white mb-4">Cookies & Analytics</h2>
            <p>
              We use strictly necessary cookies to keep your session active, manage your cart via our robust state management systems, and apply functional cookies to remember your visual preferences (like Dark Mode).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-gray-900 dark:text-white mb-4">Your Rights</h2>
            <p>
              Under global data protection structures (including GDPR and CCPA), you have the right to request access to, deletion of, or correction of your personal data. Please reach out to <strong>privacy@aurafashion.com</strong> to exercise these rights.
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
