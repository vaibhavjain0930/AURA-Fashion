"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Card, CardMedia, CardContent, IconButton, Button as MUIButton } from '@mui/material';
import { Product } from '@/components/Product/CategoryTemplate';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useCartStore } from '@/store/cartStore';

interface BuildOutfitBundleProps {
    anchorProduct: Product;
}

export default function BuildOutfitBundle({ anchorProduct }: BuildOutfitBundleProps) {
    const [loading, setLoading] = useState(true);
    const [bundle, setBundle] = useState<Product[]>([]);
    const [error, setError] = useState('');
    const { addItem } = useCartStore();

    useEffect(() => {
        const fetchBundle = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await fetch('/api/build-outfit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ product: anchorProduct })
                });
                
                if (!response.ok) {
                    throw new Error("Failed to generate outfit");
                }
                
                const data = await response.json();
                if (data.error) throw new Error(data.error);

                setBundle(data.items || []);
            } catch (err: any) {
                console.error(err);
                setError('Could not build outfit at this time.');
            } finally {
                setLoading(false);
            }
        };

        fetchBundle();
    }, [anchorProduct]);

    const handleAddToCart = (item: Product) => {
        const sizeToUse = item.size && item.size.length > 0 ? item.size[0] : 'M';
        addItem({
            id: `${item.id}-${sizeToUse}-${item.color}`,
            productId: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            size: sizeToUse,
            color: item.color,
            quantity: 1
        });
        alert(`Added ${item.name} to cart!`);
    };

    const handleAddFullOutfit = () => {
        // Add Anchor Product
        const anchorSize = anchorProduct.size && anchorProduct.size.length > 0 ? anchorProduct.size[0] : 'M';
        addItem({
            id: `${anchorProduct.id}-${anchorSize}-${anchorProduct.color}`,
            productId: anchorProduct.id,
            name: anchorProduct.name,
            price: anchorProduct.price,
            image: anchorProduct.image,
            size: anchorSize,
            color: anchorProduct.color,
            quantity: 1
        });

        // Add Bundle Items
        bundle.forEach(item => {
            const sizeToUse = item.size && item.size.length > 0 ? item.size[0] : 'M';
            addItem({
                id: `${item.id}-${sizeToUse}-${item.color}`,
                productId: item.id,
                name: item.name,
                price: item.price,
                image: item.image,
                size: sizeToUse,
                color: item.color,
                quantity: 1
            });
        });
        alert("Full outfit added to cart!");
    };

    if (loading) {
        return (
            <Box p={4} textAlign="center" border={1} borderColor="divider" borderRadius={2} mt={2}>
                <CircularProgress size={30} sx={{ mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                    Our AI Stylist is crafting the perfect look for this item...
                </Typography>
            </Box>
        );
    }

    if (error || bundle.length === 0) {
        return (
            <Box p={3} textAlign="center" border={1} borderColor="divider" borderRadius={2} mt={2} bgcolor="background.default">
                <Typography color="text.secondary" variant="body2">{error || "No matching items found."}</Typography>
            </Box>
        );
    }

    const totalPrice = anchorProduct.price + bundle.reduce((sum, item) => sum + item.price, 0);

    return (
        <Box border={1} borderColor="divider" borderRadius={3} mt={2} p={3} bgcolor="background.paper" boxShadow={1}>
            <Box display="flex" alignItems="center" gap={1} mb={3}>
                <AutoAwesomeIcon color="primary" fontSize="small" />
                <Typography variant="subtitle1" fontWeight="bold">Complete The Look</Typography>
            </Box>

            <Box display="flex" flexDirection="column" gap={2}>
                {bundle.map((item, index) => (
                    <Box key={item.id} display="flex" alignItems="center" gap={2}>
                        {index > 0 && <AddCircleOutlineIcon sx={{ color: 'text.disabled', opacity: 0.5 }} />}
                        
                        <Card sx={{ display: 'flex', width: '100%', boxShadow: 'none', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                            <CardMedia
                                component="img"
                                sx={{ width: 80, height: 80, objectFit: 'cover' }}
                                image={item.image}
                                alt={item.name}
                            />
                            <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, p: 1, justifyContent: 'center' }}>
                                <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight="bold">
                                    {item.category}
                                </Typography>
                                <Typography variant="body2" fontWeight="medium" noWrap sx={{ maxWidth: 150 }}>
                                    {item.name}
                                </Typography>
                                <Typography variant="body2" color="primary" fontWeight="bold">
                                    ${item.price.toFixed(2)}
                                </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" px={1}>
                                <IconButton size="small" onClick={() => handleAddToCart(item)} color="primary" sx={{ bgcolor: 'primary.50' }}>
                                    <ShoppingBagIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        </Card>
                    </Box>
                ))}
            </Box>

            <Box mt={4} pt={2} borderTop={1} borderColor="divider" display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                    <Typography variant="caption" color="text.secondary">Total Outfit Price</Typography>
                    <Typography variant="subtitle1" fontWeight="bold">${totalPrice.toFixed(2)}</Typography>
                </Box>
                <MUIButton 
                    variant="contained" 
                    color="primary" 
                    sx={{ borderRadius: 8, px: 3, py: 1, textTransform: 'none', fontWeight: 'bold' }}
                    onClick={handleAddFullOutfit}
                >
                    Add Full Look
                </MUIButton>
            </Box>
        </Box>
    );
}
