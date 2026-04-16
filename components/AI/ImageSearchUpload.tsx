"use client";

import React, { useState, useRef } from 'react';
import { 
    Box, 
    Typography, 
    Button, 
    Card, 
    CardMedia, 
    CardContent, 
    Grid,
    CircularProgress,
    Chip,
    Paper
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { useCartStore } from '@/store/cartStore';

interface ProductInfo {
    id: string;
    name: string;
    price: number;
    image: string;
    size: string[];
    color: string;
    category?: string;
}

export default function ImageSearchUpload() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<ProductInfo[]>([]);
    const [analysis, setAnalysis] = useState<any>(null);
    const [error, setError] = useState('');
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { addItem } = useCartStore();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Ensure it's an image
        if (!file.type.startsWith('image/')) {
            setError('Please upload a valid image file.');
            return;
        }

        // Convert to base64
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            setSelectedImage(base64String);
            setResults([]);
            setAnalysis(null);
            setError('');
        };
        reader.readAsDataURL(file);
    };

    const handleSearch = async () => {
        if (!selectedImage) return;

        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/image-search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imageBase64: selectedImage })
            });

            const data = await response.json();
            
            if (data.error) throw new Error(data.error);

            setAnalysis(data.analysis);
            setResults(data.results || []);

        } catch (err: any) {
            setError(err.message || 'Failed to search by image.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = (product: ProductInfo) => {
        const sizeToUse = product.size && product.size.length > 0 ? product.size[0] : 'M';
        addItem({
            id: `${product.id}-${sizeToUse}-${product.color}`,
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            size: sizeToUse,
            color: product.color,
            quantity: 1
        });
        alert(`Added ${product.name} to cart!`);
    };

    return (
        <Paper elevation={0} sx={{ p: 4, borderRadius: 3, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
            <Box textAlign="center" mb={4}>
                <Typography variant="h4" fontWeight="bold" gutterBottom display="flex" alignItems="center" justifyContent="center" gap={1}>
                    <AutoAwesomeIcon color="primary" fontSize="large" /> Visual Search
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Upload a photo of an outfit you love, and our AI will find similar items in our catalog.
                </Typography>
            </Box>

            <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={4} alignItems="flex-start">
                <Box width={{ xs: '100%', md: '41.666%' }}>
                    <Box 
                        sx={{ 
                            border: '2px dashed', 
                            borderColor: selectedImage ? 'primary.main' : 'grey.300',
                            borderRadius: 2,
                            p: 3,
                            textAlign: 'center',
                            bgcolor: selectedImage ? 'action.selected' : 'background.default',
                            transition: 'all 0.3s',
                            position: 'relative'
                        }}
                    >
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />

                        {selectedImage ? (
                            <Box>
                                <img 
                                    src={selectedImage} 
                                    alt="Uploaded preview" 
                                    style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain', borderRadius: '8px' }}
                                />
                                <Box mt={2}>
                                    <Button variant="outlined" size="small" onClick={() => fileInputRef.current?.click()} sx={{ mr: 1 }}>
                                        Change Image
                                    </Button>
                                    <Button 
                                        variant="contained" 
                                        color="primary" 
                                        onClick={handleSearch}
                                        disabled={loading}
                                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AutoAwesomeIcon />}
                                    >
                                        Find Similar
                                    </Button>
                                </Box>
                            </Box>
                        ) : (
                            <Box py={6}>
                                <CloudUploadIcon sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                    Upload an image here
                                </Typography>
                                <Button 
                                    variant="contained" 
                                    onClick={() => fileInputRef.current?.click()}
                                    sx={{ mt: 2, borderRadius: 8, px: 4 }}
                                >
                                    Browse Files
                                </Button>
                            </Box>
                        )}
                    </Box>

                    {error && (
                        <Typography color="error" mt={2} textAlign="center">{error}</Typography>
                    )}
                </Box>

                <Box width={{ xs: '100%', md: '58.333%' }}>
                    {loading ? (
                        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%" minHeight="300px">
                            <CircularProgress size={60} thickness={2} sx={{ mb: 3 }} />
                            <Typography variant="h6" color="text.secondary">Analyzing image context...</Typography>
                            <Typography variant="body2" color="text.secondary">Detecting colors, style, and clothing types</Typography>
                        </Box>
                    ) : results.length > 0 ? (
                        <Box>
                            <Box mb={3} display="flex" alignItems="center" gap={1} flexWrap="wrap">
                                <Typography variant="subtitle1" fontWeight="bold" mr={1}>Detected:</Typography>
                                {analysis?.category && <Chip label={analysis.category} color="primary" variant="outlined" size="small" />}
                                {analysis?.color && <Chip label={analysis.color} sx={{ bgcolor: analysis.color, color: ['white', 'black', 'yellow'].includes(analysis.color.toLowerCase()) ? 'black' : 'white' }} size="small" />}
                                {analysis?.style && <Chip label={analysis.style} variant="outlined" size="small" />}
                            </Box>

                            <Typography variant="h6" mb={2}>Top Matches</Typography>
                            <Box display="flex" flexWrap="wrap" mx={-1} rowGap={2}>
                                {results.map((product) => (
                                    <Box width={{ xs: '50%', sm: '33.333%' }} px={1} key={product.id}>
                                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                            <CardMedia
                                                component="img"
                                                height="180"
                                                image={product.image}
                                                alt={product.name}
                                                sx={{ objectFit: 'cover' }}
                                            />
                                            <CardContent sx={{ flexGrow: 1, p: 1.5, pb: '12px !important' }}>
                                                <Typography variant="caption" color="text.secondary" display="block" textTransform="uppercase">
                                                    {product.category}
                                                </Typography>
                                                <Typography variant="body2" fontWeight="bold" noWrap>
                                                    {product.name}
                                                </Typography>
                                                <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                                                    <Typography variant="body2" color="primary" fontWeight="bold">
                                                        ${product.price}
                                                    </Typography>
                                                    <Button 
                                                        size="small" 
                                                        sx={{ minWidth: 0, p: 0.5 }}
                                                        onClick={() => handleAddToCart(product)}
                                                    >
                                                        <ShoppingBagIcon fontSize="small" />
                                                    </Button>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    ) : (
                        <Box display="flex" alignItems="center" justifyContent="center" height="100%" minHeight="300px" border={1} borderColor="divider" borderRadius={2} bgcolor="background.default">
                            <Typography color="text.secondary">Matches will appear here</Typography>
                        </Box>
                    )}
                </Box>
            </Box>
        </Paper>
    );
}
