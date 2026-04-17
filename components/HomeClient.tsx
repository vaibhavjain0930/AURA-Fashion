"use client";

import { motion, Variants } from "framer-motion";
import Button from "@/components/UI/Button";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import RecentlyViewedCarousel from "@/components/Product/RecentlyViewedCarousel";
import RecommendedForYouSection from "@/components/Product/RecommendedForYouSection";

interface Category {
  name: string;
  image: string;
  href: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  color: string;
}

interface HomeClientProps {
  categories: Category[];
  trendingItems: Product[];
}

export default function HomeClient({ categories, trendingItems }: HomeClientProps) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.2 } 
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Background Video/Image placeholder */}
        <div className="absolute inset-0 z-0 bg-background">
          <img 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop" 
            alt="Hero Fashion" 
            className="w-full h-full object-cover opacity-60 mix-blend-multiply dark:mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
        </div>

        <motion.div 
          className="relative z-10 text-center px-4 max-w-4xl mx-auto text-primary mt-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.span variants={itemVariants} className="uppercase tracking-[0.3em] text-sm md:text-md mb-6 block text-primary/80 drop-shadow-sm">
            Welcome to the future of fashion
          </motion.span>
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold mb-6 leading-tight drop-shadow-sm text-primary">
            Redefine Your <br/>
            <span className="italic font-light">Style</span>
          </motion.h1>
          <motion.p variants={itemVariants} className="text-lg md:text-xl text-secondary mb-10 max-w-2xl mx-auto font-light">
            Experience our premium collection with our ground-breaking AI virtual try-on. See it on yourself before you buy.
          </motion.p>
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/women/clothing">
              <Button size="lg" className="w-full sm:w-auto">Shop Collection</Button>
            </Link>
            <Link href="/try-on">
              <Button variant="glass" size="lg" className="w-full sm:w-auto flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FBBC05]" /> AI Try-On
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Categories Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-primary font-bold mb-4">Discover Categories</h2>
          <div className="h-[1px] w-24 bg-[var(--text-primary)] mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat, i) => (
            <Link key={cat.name} href={cat.href}>
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className="group relative h-[600px] overflow-hidden rounded-2xl cursor-pointer"
              >
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-10 left-8 right-8 flex justify-between items-end">
                  <h3 className="text-white text-3xl font-serif drop-shadow-md">{cat.name}</h3>
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-white group-hover:text-black shadow-md transition-colors duration-300">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>
      
      {/* Trending Section */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl text-primary font-serif font-bold">Trending Now</h2>
              <p className="text-secondary mt-2">Curated essentials for your wardrobe</p>
            </div>
            <Link href="/women/clothing" className="text-sm font-semibold uppercase tracking-widest border-b border-[var(--text-primary)] pb-1 text-secondary transition-colors hidden sm:block">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {trendingItems.map((item, index) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-card mb-4">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/50 to-transparent">
                    <Link href={`/product/${item.id}`}>
                      <Button size="sm" className="w-full bg-card text-primary hover:bg-background border-none">Quick Add</Button>
                    </Link>
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-medium text-primary line-clamp-1 pr-2">{item.name}</h3>
                    <p className="text-xs text-secondary mt-1">{item.color}</p>
                  </div>
                  <span className="text-sm font-semibold text-primary">${item.price.toFixed(2)}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Personalized Sections */}
      <RecentlyViewedCarousel />
      <RecommendedForYouSection />

      {/* AI Promo Section */}
      <section className="py-32 relative overflow-hidden bg-background text-primary border-y border-border">
        <div className="absolute inset-0 z-0 opacity-80">
          <div className="absolute inset-0 bg-gradient-to-br from-[#4285F4]/10 via-[#EA4335]/5 to-[#34A853]/10"></div>
          <div className="absolute -top-[30%] -right-[10%] w-[60%] h-[160%] bg-gradient-to-b from-[#4285F4]/20 via-[#EA4335]/20 to-[#FBBC05]/20 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen pointer-events-none"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-black/10 dark:border-current bg-white/10 dark:bg-black/5 backdrop-blur-md text-xs font-semibold uppercase tracking-widest mb-6">
              <span className="text-[#4285F4]">A</span><span className="text-[#EA4335]">U</span><span className="text-[#FBBC05]">R</span><span className="text-[#34A853]">A</span> AI
            </div>
            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6 leading-tight">
              Try It On <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4285F4] via-[#EA4335] to-[#FBBC05]">Virtually</span>
            </h2>
            <p className="text-lg text-secondary font-light mb-10 max-w-md">
              Upload your photo and see how our clothes look on you instantly. Powered by advanced AI vision technology.
            </p>
            <div className="flex gap-4">
              <Link href="/try-on">
                 <Button className="bg-[var(--text-primary)] text-inverse hover:opacity-90 transition-opacity">Try AI Assistant</Button>
              </Link>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="flex-1 relative w-full aspect-square md:aspect-auto md:h-[600px] rounded-2xl overflow-hidden glass border-white/10 p-2"
          >
            <div className="w-full h-full relative rounded-xl overflow-hidden">
               <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1962&auto=format&fit=crop" alt="AI Try On Demo" className="w-full h-full object-cover" />
               {/* Animated scanning line effect */}
               <motion.div 
                 animate={{ top: ['0%', '100%', '0%'] }}
                 transition={{ duration: 4, ease: "linear", repeat: Infinity }}
                 className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#4285F4] to-transparent blur-[2px] z-20"
               />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 bg-card text-center px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-serif font-bold mb-4 text-primary">Join the List</h2>
          <p className="text-secondary mb-8 font-light">Sign up to get 10% off your first order and early access to new collections.</p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="YOUR EMAIL" 
              className="flex-1 bg-transparent border-b border-border py-3 px-2 outline-none focus:border-[var(--text-primary)] transition-colors text-sm font-medium uppercase tracking-widest placeholder:text-muted text-primary"
              required
            />
            <Button type="submit" variant="primary" className="rounded-none sm:rounded-full">Subscribe</Button>
          </form>
        </div>
      </section>
    </div>
  );
}
