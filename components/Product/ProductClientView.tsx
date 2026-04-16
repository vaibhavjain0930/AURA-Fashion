"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/UI/Button";
import Link from "next/link";
import { Star, Wand2, ArrowRight, Share2, Heart, Plus, Minus, Check } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useUserStore } from "@/store/userStore";
import toast from "react-hot-toast";
import { useEffect } from "react";
import BuildOutfitBundle from "@/components/AI/BuildOutfitBundle";

interface ProductClientViewProps {
  product: {
    id: string;
    name: string;
    price: number;
    description: string;
    images: string[];
    colors: string[];
    sizes: string[];
    reviews: number;
    rating: string | number;
    category?: string;
  };
}

export default function ProductClientView({ product }: ProductClientViewProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "M");
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showOutfitBuilder, setShowOutfitBuilder] = useState(false);
  
  const cart = useCartStore();
  const { addRecentlyViewed } = useUserStore();

  useEffect(() => {
    if (product?.id) {
        addRecentlyViewed(product.id);
    }
  }, [product.id, addRecentlyViewed]);

  const handleAddToCart = () => {
    cart.addItem({
      id: `${product.id}-${selectedColor}-${selectedSize}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size: selectedSize,
      color: selectedColor,
      quantity: quantity
    });
    toast.success(`Added ${quantity} ${product.name} to cart!`);
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-[#fafafa] dark:bg-[#090a0f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <nav className="text-xs uppercase tracking-widest text-gray-400 mb-8">
          <Link href="/" className="hover:text-black dark:hover:text-white transition">Home</Link>
          <span className="mx-2">/</span>
          <Link href={`/${product.category?.toLowerCase() || 'women'}/clothing`} className="hover:text-black dark:hover:text-white transition">{product.category || 'Shop'}</Link>
          <span className="mx-2">/</span>
          <span className="text-black dark:text-white">{product.name}</span>
        </nav>

        <div className="flex flex-col md:flex-row gap-12 lg:gap-24">
          
          {/* Image Gallery */}
          <div className="w-full md:w-1/2 flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex flex-row md:flex-col gap-4 overflow-x-auto md:overflow-x-visible hide-scrollbar flex-shrink-0">
              {product.images.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImage(idx)}
                  className={`relative w-20 h-24 sm:w-24 sm:h-32 rounded-lg overflow-hidden flex-shrink-0 transition-all ${activeImage === idx ? "ring-1 ring-black dark:ring-white border-[3px] border-white dark:border-[#090a0f]" : "opacity-70 hover:opacity-100"}`}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            
            {/* Main Image */}
            <div className="relative aspect-[3/4] md:aspect-auto md:h-[700px] w-full bg-gray-100 rounded-xl overflow-hidden cursor-zoom-in">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  src={product.images[activeImage]} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              <button 
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/50 backdrop-blur-md flex items-center justify-center hover:bg-white text-black transition-colors"
               >
                <Heart className={`w-5 h-5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
              </button>
            </div>
          </div>

          {/* Product Details */}
          <div className="w-full md:w-1/2 py-6">
            <div className="flex items-center gap-1 mb-3 text-sm">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.floor(Number(product.rating)) ? "fill-black dark:fill-white" : "fill-gray-200 dark:fill-gray-800 text-gray-200 dark:text-gray-800"}`} />
              ))}
              <span className="ml-2 text-gray-500 underline cursor-pointer">{product.reviews} Reviews</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-serif font-bold mb-4">{product.name}</h1>
            <p className="text-2xl font-light mb-8">${product.price.toFixed(2)}</p>
            
            <p className="text-gray-600 dark:text-gray-300 font-light mb-10 leading-relaxed">
              {product.description}
            </p>

            {/* Colors */}
            <div className="mb-8">
              <div className="flex justify-between items-end mb-3">
                <span className="text-sm font-semibold uppercase tracking-widest text-gray-500">Color</span>
                <span className="text-sm">{selectedColor}</span>
              </div>
              <div className="flex gap-4">
                {product.colors.map((color, idx) => (
                  <button 
                    key={`${color}-${idx}`}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border border-gray-200 dark:border-[#1a1c23] transition-all ${selectedColor === color ? "ring-2 ring-black dark:ring-white ring-offset-2 dark:ring-offset-[#090a0f]" : ""}`}
                    // simplified coloring strategy for mock
                    style={{ backgroundColor: color === "White" ? "#fcfcfd" : color === "Navy" ? "#0f172a" : "#111" }}
                  />
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="mb-10">
              <div className="flex justify-between items-end mb-3">
                <span className="text-sm font-semibold uppercase tracking-widest text-gray-500">Size</span>
                <span className="text-sm underline text-gray-500 cursor-pointer">Size Guide</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map(size => (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-14 h-12 flex items-center justify-center border transition-colors ${
                      selectedSize === size 
                        ? "border-black dark:border-white bg-black dark:bg-white text-white dark:text-black font-semibold" 
                        : "border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-black dark:hover:border-white"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex items-center justify-between border border-gray-200 dark:border-gray-800 w-full sm:w-32 h-14 px-4">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-500 hover:text-black dark:hover:text-white">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-medium">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="text-gray-500 hover:text-black dark:hover:text-white">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <Button onClick={handleAddToCart} size="lg" className="flex-1 h-14 text-sm tracking-[0.2em]">Add to Cart</Button>
            </div>

            {/* AI Promos */}
            <div className="space-y-4">
               <Link href={`/try-on?productUrl=${encodeURIComponent(product.images[0])}`}>
                <div className="w-full flex items-center justify-between p-4 rounded-xl border border-purple-200 bg-purple-50 dark:bg-purple-900/10 dark:border-purple-800/30 cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-800/50 flex items-center justify-center text-purple-600 dark:text-purple-400">
                      <Wand2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-purple-900 dark:text-purple-100">AI Virtual Try-On</h4>
                      <p className="text-xs text-purple-700 dark:text-purple-300">See how this looks on you</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              <div 
                  className={`w-full flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors group ${showOutfitBuilder ? 'border-gray-800 bg-[#fafafa] dark:bg-[#111218] dark:border-[#1a1c23]' : 'border-gray-100 dark:border-[#1a1c23] bg-[#fafafa] dark:bg-[#111218] hover:border-gray-300 dark:hover:border-gray-700'}`}
                  onClick={() => setShowOutfitBuilder(!showOutfitBuilder)}
              >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white dark:bg-[#1a1c23] shadow-sm flex items-center justify-center text-gray-900 dark:text-white border border-gray-100 dark:border-[#1a1c23]">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="m3 15 2 2 4-4"/></svg>
                    </div>
                    <div>
                      <h4 className="font-semibold">Match Outfits</h4>
                      <p className="text-xs text-gray-500">Find the perfect pairings</p>
                    </div>
                  </div>
                  {showOutfitBuilder ? (
                      <Check className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  ) : (
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                  )}
              </div>
              
              <AnimatePresence>
                 {showOutfitBuilder && (
                     <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                     >
                        <BuildOutfitBundle anchorProduct={product as any} />
                     </motion.div>
                 )}
              </AnimatePresence>
            </div>

            {/* Accordion / Extras */}
            <div className="mt-12 border-t border-gray-200 dark:border-gray-800 pt-8 flex gap-6 text-sm font-medium uppercase tracking-widest text-gray-500">
               <button className="hover:text-black dark:hover:text-white transition">Details & Care</button>
               <button className="hover:text-black dark:hover:text-white transition">Delivery & Returns</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
