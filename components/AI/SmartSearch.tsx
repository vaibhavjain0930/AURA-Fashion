"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface SearchResult {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    color: string;
}

export default function SmartSearch() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [parsedIntent, setParsedIntent] = useState<any>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (query.trim().length > 2) {
                performSearch(query);
            } else {
                setResults([]);
                setParsedIntent(null);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [query]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const performSearch = async (searchQuery: string) => {
        setLoading(true);
        try {
            const res = await fetch('/api/smart-search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: searchQuery })
            });
            const data = await res.json();
            if (data.results) {
                setResults(data.results);
                setParsedIntent(data.parsedQuery);
            }
        } catch (error) {
            console.error("Search failed", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative">
            {/* Search Toggle Button */}
            <button 
                onClick={() => setIsOpen(true)}
                className="hover:text-gray-500 transition-colors hidden sm:block"
                aria-label="Open search"
            >
                <Search className="w-5 h-5" />
            </button>

            {/* Smart Search Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
                        />

                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                            className="fixed top-[10vh] left-1/2 -translate-x-1/2 w-[90vw] max-w-2xl bg-white dark:bg-[#111] rounded-2xl shadow-2xl z-[101] overflow-hidden border border-gray-100 dark:border-gray-800"
                        >
                            {/* Search Input Area */}
                            <div className="flex items-center p-4 border-b border-gray-100 dark:border-gray-800 relative bg-gray-50/50 dark:bg-black/50">
                                <Search className="w-6 h-6 text-gray-400 ml-2" />
                                <input 
                                    ref={inputRef}
                                    type="text"
                                    value={query}
                                    onChange={e => setQuery(e.target.value)}
                                    placeholder="Try 'black party dress under 50'..."
                                    className="flex-1 bg-transparent border-none outline-none px-4 text-xl font-medium placeholder:text-gray-400 dark:text-white"
                                />
                                {loading && <Loader2 className="w-5 h-5 text-gray-400 animate-spin absolute right-16" />}
                                <button 
                                    onClick={() => {
                                        setIsOpen(false);
                                        setQuery('');
                                        setResults([]);
                                    }}
                                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition"
                                >
                                    <X className="w-6 h-6 text-gray-500" />
                                </button>
                            </div>

                            {/* NLP Intent Chips */}
                            {parsedIntent && Object.keys(parsedIntent).length > 0 && query.length > 2 && (
                                <div className="px-6 py-3 flex gap-2 overflow-x-auto bg-primary/5 border-b border-gray-100 dark:border-gray-800">
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider self-center mr-2">Detected:</span>
                                    {parsedIntent.category !== 'any' && <span className="text-xs bg-white dark:bg-gray-800 px-3 py-1 rounded-full border shadow-sm capitalize">{parsedIntent.category}</span>}
                                    {parsedIntent.color !== 'any' && <span className="text-xs bg-white dark:bg-gray-800 px-3 py-1 rounded-full border shadow-sm capitalize border-l-4" style={{borderLeftColor: parsedIntent.color}}>{parsedIntent.color}</span>}
                                    {parsedIntent.occasion !== 'any' && <span className="text-xs bg-white dark:bg-gray-800 px-3 py-1 rounded-full border shadow-sm capitalize">{parsedIntent.occasion}</span>}
                                    {parsedIntent.maxPrice < 9999 && <span className="text-xs bg-white dark:bg-gray-800 px-3 py-1 rounded-full border shadow-sm font-mono">Under ${parsedIntent.maxPrice}</span>}
                                </div>
                            )}

                            {/* Search Results Area */}
                            <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6 custom-scrollbar">
                                {query.length < 3 ? (
                                    <div className="text-center py-12 text-gray-400 space-y-3">
                                        <Search className="w-12 h-12 mx-auto text-gray-300" strokeWidth={1} />
                                        <p>Search for products, categories, or styles</p>
                                    </div>
                                ) : results.length > 0 ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                        {results.map((product) => (
                                            <Link 
                                                href={`/product/${product.id}`} 
                                                key={product.id}
                                                onClick={() => setIsOpen(false)}
                                                className="group"
                                            >
                                                <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 mb-2">
                                                    <img 
                                                        src={product.image} 
                                                        alt={product.name}
                                                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                </div>
                                                <h4 className="text-sm font-medium line-clamp-1">{product.name}</h4>
                                                <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
                                            </Link>
                                        ))}
                                    </div>
                                ) : !loading ? (
                                    <div className="text-center py-12 text-gray-500">
                                        <p>No results found for "{query}"</p>
                                        <button 
                                            onClick={() => setQuery('')}
                                            className="mt-4 text-black font-medium underline"
                                        >
                                            Clear search
                                        </button>
                                    </div>
                                ) : null}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
