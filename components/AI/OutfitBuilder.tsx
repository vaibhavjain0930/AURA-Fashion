"use client";

import React, { useState } from 'react';
import { 
    Box, 
    Typography, 
    Button, 
    Select, 
    MenuItem, 
    FormControl, 
    InputLabel, 
    Slider,
    Grid,
    Card,
    CardContent,
    CardMedia,
    CircularProgress,
    Stack,
    IconButton
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useCartStore } from '@/store/cartStore';

// Types for our Outfit Builder
type Gender = 'Men' | 'Women' | 'Kids';
type Occasion = 'Casual' | 'Party' | 'Wedding' | 'Office';
type Season = 'Summer' | 'Winter' | 'Spring' | 'Autumn';

interface ProductItem {
    id: string;
    name: string;
    price: number;
    color: string;
    image: string;
    size: string[];
}

interface BundleItem {
    type: string;
    id: string;
    product: ProductItem;
}

interface Bundle {
    bundleName: string;
    description: string;
    totalPrice: number;
    items: BundleItem[];
}

export default function OutfitBuilder() {
    // Form State
    const [gender, setGender] = useState<Gender>('Women');
    const [occasion, setOccasion] = useState<Occasion>('Casual');
    const [season, setSeason] = useState<Season>('Summer');
    const [budget, setBudget] = useState<number>(150);
    
    // UI State
    const [loading, setLoading] = useState(false);
    const [bundles, setBundles] = useState<Bundle[]>([]);
    const [currentBundleIndex, setCurrentBundleIndex] = useState(0);
    const [error, setError] = useState('');

    const { addItem } = useCartStore();

    const fetchRecommendations = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch('/api/recommend-outfit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ gender, occasion, season, budget })
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch recommendations');
            }

            const data = await response.json();
            if (data.error) throw new Error(data.error);

            setBundles(data.bundles || []);
            setCurrentBundleIndex(0);
        } catch (err: any) {
            setError(err.message || 'Error fetching outfits');
            setBundles([]);
        } finally {
            setLoading(false);
        }
    };

    const nextBundle = () => {
        setCurrentBundleIndex((prev) => (prev + 1) % bundles.length);
    };

    const prevBundle = () => {
        setCurrentBundleIndex((prev) => (prev === 0 ? bundles.length - 1 : prev - 1));
    };

    const addBundleToCart = (bundle: Bundle) => {
        bundle.items.forEach(item => {
            if (item.product) {
                // Determine a realistic size. Use 'M' if available, otherwise just grab the first size.
                const size = item.product.size && item.product.size.length > 0 
                     ? (item.product.size.includes('M') ? 'M' : item.product.size[0]) 
                     : 'M';
                     
                addItem({
                    id: `${item.product.id}-${size}-${item.product.color}`, // unique cart item id
                    productId: item.product.id,
                    name: item.product.name,
                    price: item.product.price,
                    image: item.product.image,
                    size: size,
                    color: item.product.color,
                    quantity: 1
                });
            }
        });
        // Could add a toast notification here
        alert(`Added ${bundle.bundleName} to cart!`);
    };

    const addSingleItemToCart = (product: ProductItem) => {
        const size = product.size && product.size.length > 0 ? (product.size.includes('M') ? 'M' : product.size[0]) : 'M';
        addItem({
            id: `${product.id}-${size}-${product.color}`,
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            size: size,
            color: product.color,
            quantity: 1
        });
        alert(`Added ${product.name} to cart!`);
    };

    return (
        <Box sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3, mb: 6 }}>
            <Typography variant="h4" component="h2" gutterBottom display="flex" alignItems="center" gap={1} fontWeight="bold">
                <AutoAwesomeIcon color="primary" /> AI Outfit Builder
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={4}>
                Let our AI stylist craft the perfect look for you based on your preferences and budget.
            </Typography>

            <Box display="flex" flexWrap="wrap" mx={-1.5} rowGap={3} mb={4}>
                <Box width={{ xs: '100%', sm: '50%', md: '25%' }} px={1.5}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Gender</InputLabel>
                        <Select value={gender} label="Gender" onChange={(e) => setGender(e.target.value as Gender)}>
                            <MenuItem value="Men">Men</MenuItem>
                            <MenuItem value="Women">Women</MenuItem>
                            <MenuItem value="Kids">Kids</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <Box width={{ xs: '100%', sm: '50%', md: '25%' }} px={1.5}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Occasion</InputLabel>
                        <Select value={occasion} label="Occasion" onChange={(e) => setOccasion(e.target.value as Occasion)}>
                            <MenuItem value="Casual">Casual</MenuItem>
                            <MenuItem value="Office">Office</MenuItem>
                            <MenuItem value="Party">Party</MenuItem>
                            <MenuItem value="Wedding">Wedding</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <Box width={{ xs: '100%', sm: '50%', md: '25%' }} px={1.5}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Season</InputLabel>
                        <Select value={season} label="Season" onChange={(e) => setSeason(e.target.value as Season)}>
                            <MenuItem value="Spring">Spring</MenuItem>
                            <MenuItem value="Summer">Summer</MenuItem>
                            <MenuItem value="Autumn">Autumn</MenuItem>
                            <MenuItem value="Winter">Winter</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <Box width={{ xs: '100%', sm: '50%', md: '25%' }} px={1.5}>
                    <Box sx={{ px: 2 }}>
                        <Typography gutterBottom variant="caption" color="text.secondary">Budget: ${budget}</Typography>
                        <Slider 
                            value={budget} 
                            min={50} max={1000} step={50}
                            onChange={(_, val) => setBudget(val as number)}
                            valueLabelDisplay="auto"
                        />
                    </Box>
                </Box>
            </Box>

            <Box display="flex" justifyContent="center" mb={4}>
                <Button 
                    variant="contained" 
                    color="primary" 
                    size="large" 
                    onClick={fetchRecommendations}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AutoAwesomeIcon />}
                    sx={{ px: 4, py: 1.5, borderRadius: 8, textTransform: 'none', fontSize: '1.1rem' }}
                >
                    {loading ? 'Styling Your Look...' : 'Generate Outfits'}
                </Button>
            </Box>

            {error && (
                <Typography color="error" textAlign="center" mb={2}>{error}</Typography>
            )}

            {/* Carousel display for bundles */}
            {bundles.length > 0 && !loading && (
                <Box sx={{ position: 'relative', mt: 4, pt: 4, borderTop: 1, borderColor: 'divider' }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
                        <IconButton onClick={prevBundle} disabled={bundles.length <= 1}>
                            <ArrowBackIosNewIcon />
                        </IconButton>
                        
                        <Box textAlign="center" flex={1}>
                            <Typography variant="h5" fontWeight="bold" gutterBottom>
                                {bundles[currentBundleIndex].bundleName}
                            </Typography>
                            <Typography variant="body1" color="text.secondary" gutterBottom>
                                {bundles[currentBundleIndex].description}
                            </Typography>
                            <Typography variant="h6" color="primary" fontWeight="bold">
                                Total: ${bundles[currentBundleIndex].totalPrice.toFixed(2)}
                            </Typography>
                        </Box>
                        
                        <IconButton onClick={nextBundle} disabled={bundles.length <= 1}>
                            <ArrowForwardIosIcon />
                        </IconButton>
                    </Stack>

                    <Box display="flex" flexWrap="wrap" justifyContent="center" mx={-1} rowGap={2} mb={4}>
                        {bundles[currentBundleIndex].items.map((item, idx) => (
                            <Box width={{ xs: '100%', sm: '50%', md: '25%' }} px={1} key={idx}>
                                {item.product ? (
                                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 4 } }}>
                                        <CardMedia
                                            component="img"
                                            height="200"
                                            image={item.product.image}
                                            alt={item.product.name}
                                            sx={{ objectFit: 'cover' }}
                                        />
                                        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
                                            <Typography variant="caption" color="primary" sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
                                                {item.type}
                                            </Typography>
                                            <Typography variant="subtitle1" fontWeight="bold" noWrap>
                                                {item.product.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" mt="auto">
                                                ${item.product.price.toFixed(2)}
                                            </Typography>
                                            <Button 
                                                size="small" 
                                                variant="outlined" 
                                                startIcon={<AddShoppingCartIcon fontSize="small"/>}
                                                sx={{ mt: 1, textTransform: 'none' }}
                                                onClick={() => addSingleItemToCart(item.product)}
                                            >
                                                Add Item
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <Box border={1} borderColor="divider" borderRadius={1} p={2} height={200} display="flex" alignItems="center" justifyContent="center">
                                        <Typography color="text.secondary">Item not available</Typography>
                                    </Box>
                                )}
                            </Box>
                        ))}
                    </Box>

                    <Box display="flex" justifyContent="center">
                        <Button 
                            variant="contained" 
                            color="secondary"
                            size="large"
                            startIcon={<ShoppingBagIcon />}
                            onClick={() => addBundleToCart(bundles[currentBundleIndex])}
                            sx={{ borderRadius: 8, px: 4, textTransform: 'none', fontWeight: 'bold' }}
                        >
                            Add Full Outfit to Cart
                        </Button>
                    </Box>
                </Box>
            )}
        </Box>
    );
}
