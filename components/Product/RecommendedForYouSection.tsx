"use client";

import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useUserStore } from '@/store/userStore';
import { fetchCategoryProducts } from '@/lib/data/products';
import { Product } from './CategoryTemplate';
import Link from 'next/link';
import Button from '@/components/UI/Button';
import { useCartStore } from '@/store/cartStore';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

export default function RecommendedForYouSection() {
    const { recentlyViewed } = useUserStore();
    const { addItem } = useCartStore();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadRecommendations = async () => {
            // In a real app we'd call an AI recommendation API based on history profile
            // For this UI mockup, if they viewed items, we show complementary ones
            const [accessories, dresses] = await Promise.all([
                fetchCategoryProducts("women", "accessories"),
                fetchCategoryProducts("women", "dress")
            ]);

            // Shuffle and slice
            const combined = [...accessories, ...dresses].sort(() => 0.5 - Math.random());
            setProducts(combined.slice(0, 4));
            setLoading(false);
        };

        loadRecommendations();
    }, [recentlyViewed]);

    // Don't show if they have no history (cold start) to make it feel personalized
    if (!loading && recentlyViewed.length === 0) return null;

    return (
        <div className="py-16 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-2 mb-8">
                    <AutoAwesomeIcon className="w-4 h-4 text-[#FBBC05]" />
                    <Typography variant="h5" fontWeight="bold" className="uppercase tracking-widest font-serif text-primary">
                        Recommended For You
                    </Typography>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {loading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="w-full aspect-[3/4] bg-card animate-pulse rounded-lg" />
                        ))
                    ) : (
                        products.map(product => (
                            <Link href={`/product/${product.id}`} key={product.id} className="group w-full">
                                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-card mb-3">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    {/* AI Tag */}
                                    <div className="absolute top-2 left-2">
                                        <span className="bg-primary/90 backdrop-blur-sm text-black text-[10px] font-bold px-2 py-1 rounded shadow">
                                            Picked For You ✨
                                        </span>
                                    </div>
                                    <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/60 to-transparent">
                                        <Button
                                            size="sm"
                                            className="w-full bg-white text-black"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                addItem({
                                                    id: `${product.id}-${product.color}-M`,
                                                    productId: product.id,
                                                    name: product.name,
                                                    price: product.price,
                                                    image: product.image,
                                                    size: "M",
                                                    color: product.color,
                                                    quantity: 1
                                                });
                                            }}
                                        >
                                            Quick Add
                                        </Button>
                                    </div>
                                </div>
                                <h3 className="text-sm font-medium line-clamp-1 text-primary">{product.name}</h3>
                                <p className="text-sm font-semibold text-primary">${product.price.toFixed(2)}</p>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
