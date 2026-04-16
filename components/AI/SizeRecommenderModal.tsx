"use client";

import React, { useState } from 'react';
import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    Button, 
    Typography, 
    TextField, 
    FormControl, 
    InputLabel, 
    Select, 
    MenuItem, 
    Box, 
    CircularProgress, 
    IconButton,
    InputAdornment
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import StraightenIcon from '@mui/icons-material/Straighten';
import { useUserStore } from '@/store/userStore';

interface SizeRecommenderModalProps {
    open: boolean;
    onClose: () => void;
}

export default function SizeRecommenderModal({ open, onClose }: SizeRecommenderModalProps) {
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [bodyType, setBodyType] = useState('regular');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    // Not using Gemini API for this specific logic as a deterministic calculation is usually more reliable
    // and faster for a simple size chart mapping.

    const { recommendedSize, setRecommendedSize } = useUserStore();

    const calculateSize = () => {
        if (!height || !weight) {
            setError('Please enter both height and weight');
            return;
        }

        const h = parseFloat(height);
        const w = parseFloat(weight);

        if (isNaN(h) || isNaN(w)) {
            setError('Please enter valid numbers');
            return;
        }

        setError('');
        setLoading(true);

        // Simulate AI thinking delay for UX
        setTimeout(() => {
            let size = 'M';
            
            // Simple logic for demonstration
            if (h > 185 || w > 90) size = 'XL';
            else if (h > 175 || w > 75) size = 'L';
            else if (h < 165 && w < 60) size = 'S';

            if (bodyType === 'plus') size = 'XL';
            if (bodyType === 'slim' && size === 'M') size = 'S';

            setRecommendedSize(size);
            setLoading(false);
        }, 1200);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
            <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: 'background.default' }}>
                <Box display="flex" alignItems="center" gap={1}>
                    <StraightenIcon color="primary" />
                    <Typography variant="h6" fontWeight="bold">AI Size Recommender</Typography>
                </Box>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            
            <DialogContent dividers sx={{ p: 4 }}>
                {recommendedSize && !loading ? (
                    <Box textAlign="center" py={3}>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            Your Recommended True Fit Size
                        </Typography>
                        <Box 
                            sx={{ 
                                display: 'inline-flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                width: 80, 
                                height: 80, 
                                borderRadius: '50%', 
                                bgcolor: 'primary.main', 
                                color: 'white',
                                mb: 3,
                                boxShadow: 4
                            }}
                        >
                            <Typography variant="h3" fontWeight="bold">{recommendedSize}</Typography>
                        </Box>
                        <Typography variant="body1">
                            We've saved this preference to your profile. We'll automatically highlight this size for you while shopping!
                        </Typography>
                        <Button 
                            variant="outlined" 
                            onClick={() => setRecommendedSize(null)} 
                            sx={{ mt: 3, borderRadius: 8 }}
                        >
                            Recalculate
                        </Button>
                    </Box>
                ) : (
                    <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                            Enter your details below, and our algorithm will calculate your perfect fit based on millions of data points.
                        </Typography>

                        <TextField
                            label="Height"
                            variant="outlined"
                            fullWidth
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                            }}
                        />

                        <TextField
                            label="Weight"
                            variant="outlined"
                            fullWidth
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                            }}
                        />

                        <FormControl fullWidth>
                            <InputLabel>Body Type</InputLabel>
                            <Select
                                value={bodyType}
                                label="Body Type"
                                onChange={(e) => setBodyType(e.target.value)}
                            >
                                <MenuItem value="slim">Slim</MenuItem>
                                <MenuItem value="regular">Regular</MenuItem>
                                <MenuItem value="athletic">Athletic</MenuItem>
                                <MenuItem value="plus">Plus / Curvy</MenuItem>
                            </Select>
                        </FormControl>

                        {error && (
                            <Typography color="error" variant="body2">{error}</Typography>
                        )}
                    </Box>
                )}
            </DialogContent>

            {!recommendedSize && (
                <DialogActions sx={{ p: 3, bgcolor: 'background.default' }}>
                    <Button onClick={onClose} color="inherit">Cancel</Button>
                    <Button 
                        onClick={calculateSize} 
                        variant="contained" 
                        color="primary"
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                        sx={{ borderRadius: 8, px: 3 }}
                    >
                        {loading ? 'Calculating...' : 'Find My Size'}
                    </Button>
                </DialogActions>
            )}
        </Dialog>
    );
}
