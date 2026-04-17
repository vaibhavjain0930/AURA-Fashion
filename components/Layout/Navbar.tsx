"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, User, ShoppingBag, Menu, X, Wand2, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import SmartSearch from "@/components/AI/SmartSearch";
import { useAuthStore } from "@/store/authStore";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const cart = useCartStore();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    {
      name: "Men",
      baseHref: "/men",
      subcategories: [
        { name: "Clothing", href: "/men/clothing" },
        { name: "Footwear", href: "/men/footwear" },
        { name: "Accessories", href: "/men/accessories" }
      ]
    },
    {
      name: "Women",
      baseHref: "/women",
      subcategories: [
        { name: "Clothing", href: "/women/clothing" },
        { name: "Footwear", href: "/women/footwear" },
        { name: "Accessories", href: "/women/accessories" }
      ]
    },
    {
      name: "Kids",
      baseHref: "/kids",
      subcategories: [
        { name: "Clothing", href: "/kids/clothing" },
        { name: "Footwear", href: "/kids/footwear" },
        { name: "Accessories", href: "/kids/accessories" }
      ]
    },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out ${isScrolled
          ? "bg-card text-primary shadow-lg py-4 border-b border-border"
          : "bg-transparent text-primary py-6"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center relative">
          {/* Logo */}
          <Link href="/" className="text-2xl font-serif font-bold tracking-tighter">
            AURA
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1 items-center h-full absolute left-1/2 -translate-x-1/2">
            {navLinks.map((category) => (
              <div
                key={category.name}
                className="relative group px-4 py-6"
                onMouseEnter={() => setActiveDropdown(category.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={category.subcategories[0].href}
                  className="flex items-center gap-1 text-sm font-medium hover:text-secondary transition-colors uppercase tracking-widest"
                >
                  {category.name}
                  <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === category.name ? 'rotate-180' : ''}`} />
                </Link>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {activeDropdown === category.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-0 w-56 bg-card border border-border shadow-xl rounded-xl overflow-hidden py-3"
                    >
                      {category.subcategories.map((sub) => (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          className="block px-6 py-2.5 text-sm hover:bg-background transition-colors hover:pl-7 duration-300"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Icons Context */}
          <div className="flex items-center space-x-5">
            <Link href="/try-on" className="hidden lg:flex items-center gap-2 text-sm font-medium bg-gradient-to-r from-[#4285F4] via-[#EA4335] to-[#FBBC05] text-white px-4 py-2 rounded-full hover:shadow-lg transition-all">
              <Wand2 className="w-4 h-4 text-white" />
              <span>AI Try-On</span>
            </Link>
            <SmartSearch />
            <Link href={isAuthenticated ? "/profile" : "/login"} className="hover:text-secondary transition-colors hidden sm:block">
              <User className="w-5 h-5" />
            </Link>
            <Link href="/cart" className="hover:text-secondary transition-colors relative">
              <ShoppingBag className="w-5 h-5" />
              {mounted && cart.totalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-[var(--text-primary)] text-inverse text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {cart.totalItems()}
                </span>
              )}
            </Link>
            <button
              className="md:hidden hover:text-secondary transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100vh" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background fixed inset-0 top-[72px] z-40 flex flex-col px-6 pt-8 pb-32 space-y-6 overflow-y-auto"
          >
            {navLinks.map((category) => (
              <div key={category.name} className="border-b border-border pb-4">
                <div className="text-2xl font-serif tracking-wide mb-3 text-primary">{category.name}</div>
                <div className="flex flex-col space-y-3 pl-4">
                  {category.subcategories.map(sub => (
                    <Link
                      key={sub.name}
                      href={sub.href}
                      className="text-secondary text-lg hover:text-primary transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            <div className="pt-4 flex flex-col space-y-4">
              <Link
                href={isAuthenticated ? "/profile" : "/login"}
                className="flex items-center gap-3 text-lg text-primary hover:text-secondary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User className="w-5 h-5" /> Account
              </Link>
              <Link
                href="/try-on"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 text-lg font-medium text-primary mt-2 p-3 bg-gradient-to-r from-[#4285F4]/10 via-[#EA4335]/10 to-[#FBBC05]/10 rounded-xl"
              >
                <Wand2 className="w-5 h-5 text-[#4285F4]" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4285F4] to-[#EA4335]">AI Try-On Room</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
