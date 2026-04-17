"use client";

import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useUserStore } from '@/store/userStore';
import { fetchCategoryProducts } from '@/lib/data/products';
import { Product } from './CategoryTemplate';
import CategoryTemplate from './CategoryTemplate'; // We can reuse parts or just build a small slider here
// Instead of full page CategoryTemplate, let's build a dedicated horizonal carousel slider

import Link from 'next/link';
import Button from '@/components/UI/Button';
import { useCartStore } from '@/store/cartStore';

export default function RecentlyViewedCarousel() {
    const { recentlyViewed } = useUserStore();
    const { addItem } = useCartStore();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProducts = async () => {
             if (recentlyViewed.length === 0) {
                 setLoading(false);
                 return;
             }

             // In a real app we'd fetch by IDs. For mock, we'll fetch a broad subset and filter by ID
             // Or we just re-hydrate from a dedicated mock API if we had one.
             // Since we use mock IDs string-matching, let's fetch default fallback items and map IDs.
             const [tops, bottoms, shoes] = await Promise.all([
                 fetchCategoryProducts("women", "top"),
                 fetchCategoryProducts("women", "bottom"),
                 fetchCategoryProducts("unisex", "shoes")
             ]);

             const catalog = [...tops, ...bottoms, ...shoes];
             const historyProducts = recentlyViewed
                .map(id => catalog.find(p => p.id === id))
                .filter(Boolean) as Product[];

             setProducts(historyProducts);
             setLoading(false);
        };

        loadProducts();
    }, [recentlyViewed]);

    if (!loading && products.length === 0) return null;

    return (
        <div className="py-12 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Typography variant="h5" fontWeight="bold" mb={4} className="uppercase tracking-widest font-serif text-primary">
                   Recently Viewed
                </Typography>
                
                <div className="flex overflow-x-auto gap-6 pb-4 custom-scrollbar snap-x">
                    {loading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                           <div key={i} className="min-w-[240px] h-[360px] bg-card animate-pulse rounded-lg snap-start" />
                        ))
                    ) : (
                        products.map(product => (
                            <Link href={`/product/${product.id}`} key={product.id} className="group min-w-[240px] max-w-[240px] snap-start">
                                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-card mb-3">
                                    <img 
                                        src={product.image} 
                                        alt={product.name} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/60 to-transparent">
                                        <Button 
                                            size="sm" 
                                            className="w-full bg-card text-primary hover:bg-background text-xs border-none"
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
