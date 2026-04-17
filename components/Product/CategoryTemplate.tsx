"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/UI/Button";
import Link from "next/link";
import { Filter, SlidersHorizontal, Wand2, X } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  subcategory?: string;
  color: string;
  size: string[];
  rating?: string;
  reviews?: number;
  aiTags?: string[];
}

interface CategoryTemplateProps {
  title: string;
  description: string;
  products: Product[];
}

export default function CategoryTemplate({ title, description, products }: CategoryTemplateProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const cart = useCartStore();

  // Filter States
  const [sizeFilter, setSizeFilter] = useState<string | null>(null);
  const [priceFilter, setPriceFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const isAccessories = title.toLowerCase().includes("accessories");
  const isClothing = title.toLowerCase().includes("clothing");
  const isFootwear = title.toLowerCase().includes("footwear");

  const [isFiltering, setIsFiltering] = useState(false);

  // Derive filtered products
  const filteredProducts = products.filter((p) => {
    // Size match (assume p.size is an array of available sizes strings)
    if (sizeFilter && (!p.size || !p.size.includes(sizeFilter))) {
      return false;
    }
    // Price match
    if (priceFilter === "under50" && p.price >= 50) return false;
    if (priceFilter === "50to100" && (p.price < 50 || p.price > 100)) return false;
    if (priceFilter === "over100" && p.price <= 100) return false;
    
    // Category Match (specifically for accessories where subcategory acts as category)
    if (categoryFilter && p.subcategory?.toLowerCase() !== categoryFilter.toLowerCase() && p.color?.toLowerCase() !== categoryFilter.toLowerCase()) {
        if (!p.name.toLowerCase().includes(categoryFilter.toLowerCase())) return false;
    }

    return true;
  });

  // Effect to handle filter changes and show loading state
  useEffect(() => {
    setIsFiltering(true);
    const timer = setTimeout(() => {
      setIsFiltering(false);
    }, 600); // 600ms loading skeleton simulation
    return () => clearTimeout(timer);
  }, [sizeFilter, priceFilter, categoryFilter]);

  const handleQuickAdd = (product: Product) => {
    cart.addItem({
      id: `${product.id}-${product.color}-M`,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: "M", // Default Quick Add size
      color: product.color,
      quantity: 1
    });
    toast.success(`Added ${product.name} to cart!`);
  };

  const renderFilters = () => (
    <div className="space-y-8">
      {/* Clothing Size Filter */}
      {isClothing && (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Size</h4>
            <div className="flex flex-wrap gap-2">
              {["XS", "S", "M", "L", "XL"].map(size => (
                <button
                  key={size}
                  onClick={() => setSizeFilter(sizeFilter === size ? null : size)}
                  className={`w-10 h-10 rounded-full border flex items-center justify-center text-xs transition-colors
                    ${
                      sizeFilter === size
                        ? "bg-black text-white border-black"
                        : "border-black text-black hover:bg-black hover:text-white"
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
      )}

      {/* Footwear Size Filter */}
      {isFootwear && (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Size (UK)</h4>
            <div className="flex flex-wrap gap-2">
              {["6", "7", "8", "9", "10"].map(size => (
                <button
                  key={size}
                  onClick={() => setSizeFilter(sizeFilter === size ? null : size)}
                  className={`w-10 h-10 rounded-full border flex items-center justify-center text-xs transition-colors
                    ${
                      sizeFilter === size
                        ? "bg-black text-white border-black"
                        : "border-black text-black hover:bg-black hover:text-white"
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
      )}

      {/* Footwear Category Filter */}
      {isFootwear && (
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Category</h4>
          <div className="flex flex-wrap gap-2">
            {["Sneakers", "Running Shoes", "Casual Shoes", "Formal Shoes", "Sandals", "Flip-Flops", "Boots"].map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(categoryFilter === cat ? null : cat)}
                className={`px-4 py-2 rounded-full border text-xs transition-colors
                  ${
                    categoryFilter === cat
                      ? "bg-black text-white border-black"
                      : "border-black text-black hover:bg-black hover:text-white"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price Filter for Clothing and Footwear */}
      {!isAccessories && (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Price</h4>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                <input type="checkbox" checked={priceFilter === "under50"} onChange={() => setPriceFilter(priceFilter === "under50" ? null : "under50")} className="accent-black dark:accent-white" /> Under $50
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                <input type="checkbox" checked={priceFilter === "50to100"} onChange={() => setPriceFilter(priceFilter === "50to100" ? null : "50to100")} className="accent-black dark:accent-white" /> $50 - $100
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                <input type="checkbox" checked={priceFilter === "over100"} onChange={() => setPriceFilter(priceFilter === "over100" ? null : "over100")} className="accent-black dark:accent-white" /> Over $100
              </label>
            </div>
          </div>
      )}

      {/* Specific Filters for Accessories */}
      {isAccessories && (
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Category</h4>
          <div className="flex flex-wrap gap-2">
            {["Bags", "Jewelry", "Belts", "Hats", "Sunglasses"].map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(categoryFilter === cat ? null : cat)}
                className={`px-4 py-2 rounded-full border text-xs transition-colors
                  ${
                    categoryFilter === cat
                      ? "bg-black text-white border-black"
                      : "border-black text-black hover:bg-black hover:text-white"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl text-primary font-serif font-bold mb-4 uppercase tracking-wider"
          >
            {title}
          </motion.h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            className="h-[1px] w-24 bg-black dark:bg-white mx-auto mb-6"
          ></motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-secondary max-w-2xl mx-auto font-light"
          >
            {description}
          </motion.p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden flex justify-between items-center py-4 border-y border-gray-200 dark:border-gray-800 mb-6">
            <span className="text-sm font-medium uppercase tracking-widest">{products.length} Products</span>
            <Button variant="ghost" size="sm" onClick={() => setIsFilterOpen(true)} className="flex gap-2 text">
              <Filter className="w-4 h-4 text-gray-900" /> <span className="text-gray-900">Filter</span>
            </Button>
          </div>

          {/* Sidebar / Filters (Desktop) */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-border">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-primary">Filters</h3>
                <SlidersHorizontal className="w-4 h-4 text-muted" />
              </div>

              {/* Filter Categories */}
              {renderFilters()}
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {isFiltering ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6 lg:gap-x-8">
                {Array.from(new Array(8)).map((_, i) => (
                  <div key={i} className="group relative">
                    <Skeleton variant="rectangular" className="aspect-[3/4] w-full rounded-lg mb-4" />
                    <Skeleton variant="text" width="60%" className="mt-2 mb-1" />
                    <Skeleton variant="text" width="40%" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-background rounded-2xl border border-border">
                <Box className="mb-4 p-4 bg-card rounded-full shadow-sm">
                  <Filter className="w-8 h-8 text-muted" />
                </Box>
                <h3 className="text-xl font-medium text-primary mb-2">No products found</h3>
                <p className="text-secondary mb-6 max-w-md mx-auto">
                  We couldn't find any products matching your selected filters. Try adjusting your search criteria.
                </p>
                <Button 
                  onClick={() => {
                    setSizeFilter(null);
                    setPriceFilter(null);
                    setCategoryFilter(null);
                  }}
                  variant="outline"
                  className="bg-white hover:bg-gray-50 dark:bg-black dark:text-white dark:border-gray-700 dark:hover:bg-gray-900 border-black text-black hover:text-black transition-all duration-300 shadow-sm"
                >
                  Clear all filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6 lg:gap-x-8">
                {filteredProducts.map((product, i) => {
                  const isItemClothing = product.subcategory?.toLowerCase() === 'clothing' || isClothing || (!isFootwear && !isAccessories);
                  return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="group relative"
                >
                  <Link href={`/product/${product.id}`}>
                    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-card mb-4 cursor-pointer">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      />
                      {/* AI Tags Display */}
                      {product.aiTags && product.aiTags.length > 0 && (
                        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                          {product.aiTags.map((tag, idx) => (
                            <span
                              key={idx}
                              className={`text-[10px] font-bold px-2 py-0.5 rounded shadow-sm backdrop-blur-md ${tag.toLowerCase().includes('trending') ? 'bg-orange-500/90 text-white' :
                                  tag.toLowerCase().includes('wedding') ? 'bg-pink-500/90 text-white' :
                                    tag.toLowerCase().includes('summer') ? 'bg-yellow-400/90 text-black' :
                                      'bg-white/90 text-black'
                                }`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      {/* Hover Overlay */}
                      <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/60 to-transparent">
                        <Button
                          size="sm"
                          className="w-full bg-card text-primary hover:bg-background border-none transition-transform translate-y-4 group-hover:translate-y-0 duration-300"
                          onClick={(e) => {
                            e.preventDefault();
                            handleQuickAdd(product);
                          }}
                        >
                          Quick Add
                        </Button>
                      </div>
                    </div>
                  </Link>
                  <div className="flex flex-col mt-2 space-y-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-medium text-primary line-clamp-1 drop-shadow-sm">
                          <Link href={`/product/${product.id}`}>{product.name}</Link>
                        </h3>
                        <p className="text-xs text-secondary capitalize drop-shadow-sm">{product.subcategory || product.color}</p>
                      </div>
                      <p className="text-sm font-semibold text-primary">${product.price.toFixed(2)}</p>
                    </div>

                    {/* Rating Display */}
                    {product.rating && (
                      <div className="flex items-center gap-1 text-xs text-secondary">
                        <div className="flex items-center text-yellow-500">
                          {'★'.repeat(Math.round(Number(product.rating)))}
                          <span className="text-gray-300">{'★'.repeat(5 - Math.round(Number(product.rating)))}</span>
                        </div>
                        <span>{product.rating} ({product.reviews})</span>
                      </div>
                    )}

                    {/* Action Buttons (Only for Clothing) */}
                    {isItemClothing && (
                        <div className="flex gap-2 pt-2">
                          <Link
                            href={`/try-on?productUrl=${encodeURIComponent(product.image)}`}
                            className="flex-1 flex items-center justify-center gap-2 h-10 bg-gradient-to-r from-[#4285F4] via-[#EA4335] to-[#FBBC05] text-white rounded-full hover:shadow-lg transition-all"
                          >
                            <Wand2 className="w-4 h-4 text-white" />
                            <span className="text-xs">AI Try-On</span>
                          </Link>

                          <Link
                            href={`/product/${product.id}`}
                            className="flex-1"
                          >
                            <Button
                              size="sm"
                              className="w-full h-10 text-xs text-primary bg-card hover:bg-card hover:shadow-none transition-none"
                            >
                              Details
                            </Button>
                          </Link>
                        </div>
                    )}
                  </div>
                </motion.div>
              )})}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed inset-y-0 right-0 w-4/5 max-w-sm bg-card z-50 p-6 overflow-y-auto lg:hidden shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-border">
                <h3 className="text-lg font-semibold uppercase tracking-widest text-primary">Filters</h3>
                <button onClick={() => setIsFilterOpen(false)} className="p-2 -mr-2">
                  <X className="w-5 h-5 text-secondary hover:text-primary transition-colors" />
                </button>
              </div>
              
              {renderFilters()}
              
              <div className="mt-10 pt-6 border-t border-border">
                <Button className="w-full text-inverse bg-[var(--text-primary)] hover:opacity-90 transition-colors" onClick={() => setIsFilterOpen(false)}>
                  Show {filteredProducts.length} Results
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
