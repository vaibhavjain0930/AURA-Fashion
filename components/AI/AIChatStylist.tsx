"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
    Box, 
    Typography, 
    IconButton, 
    TextField, 
    Paper, 
    Avatar, 
    Card, 
    CardContent, 
    CardMedia, 
    Button,
    CircularProgress,
    Fade,
    Slide
} from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useCartStore } from '@/store/cartStore';

interface ProductInfo {
    id: string;
    name: string;
    price: number;
    image: string;
    size: string[];
    color: string;
}

interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    message: string;
    products?: ProductInfo[];
}

export default function AIChatStylist() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([{
        id: 'initial',
        role: 'assistant',
        message: 'Hi there! 👋 I am the AURA Stylist. Looking for an outfit for a specific occasion, or need fashion advice?'
    }]);
    const [isLoading, setIsLoading] = useState(false);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { addItem } = useCartStore();

    // Auto-scroll to bottom of chat
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen, isLoading]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsgText = input.trim();
        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            message: userMsgText
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            // Prepare history for API
            const history = messages.map(m => ({ role: m.role, message: m.message }));

            const response = await fetch('/api/ai-stylist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsgText, history })
            });

            const data = await response.json();

            if (data.error && !data.text) {
                throw new Error(data.error);
            }

            const aiMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                message: data.text || data.error,
                products: data.products || []
            };

            setMessages(prev => [...prev, aiMsg]);

        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'assistant',
                message: 'Oops! I encountered an error. Please try asking again.'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
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
        <>
            {/* Floating Action Button */}
            <Fade in={!isOpen}>
                <IconButton
                    onClick={() => setIsOpen(true)}
                    color="primary"
                    sx={{
                        position: 'fixed',
                        bottom: 30,
                        right: 30,
                        backgroundColor: 'primary.main',
                        color: 'white',
                        width: 60,
                        height: 60,
                        boxShadow: 4,
                        '&:hover': { backgroundColor: 'primary.dark', transform: 'scale(1.05)' },
                        zIndex: 9999,
                        transition: 'all 0.2s'
                    }}
                >
                    <ChatBubbleOutlineIcon fontSize="large" />
                </IconButton>
            </Fade>

            {/* Chat Window */}
            <Slide direction="up" in={isOpen} mountOnEnter unmountOnExit>
                <Paper
                    elevation={6}
                    sx={{
                        position: 'fixed',
                        bottom: 20,
                        right: { xs: 10, sm: 30 },
                        width: { xs: 'calc(100% - 20px)', sm: 400 },
                        height: { xs: '80vh', sm: 600 },
                        maxHeight: '800px',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 3,
                        overflow: 'hidden',
                        zIndex: 10000,
                        backgroundColor: 'background.paper',
                    }}
                >
                    {/* Header */}
                    <Box sx={{ 
                        p: 2, 
                        bgcolor: 'primary.main', 
                        color: 'white', 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center' 
                    }}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <AutoAwesomeIcon />
                            <Typography variant="h6" fontWeight="bold">AURA Stylist</Typography>
                        </Box>
                        <IconButton size="small" sx={{ color: 'white' }} onClick={() => setIsOpen(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    {/* Chat Messages Area */}
                    <Box sx={{ 
                        flexGrow: 1, 
                        p: 2, 
                        overflowY: 'auto', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: 2,
                        bgcolor: 'background.default'
                    }}>
                        {messages.map((msg) => (
                            <Box 
                                key={msg.id} 
                                sx={{ 
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start'
                                }}
                            >
                                <Box sx={{ 
                                    display: 'flex', 
                                    gap: 1, 
                                    maxWidth: '85%',
                                    flexDirection: msg.role === 'user' ? 'row-reverse' : 'row'
                                }}>
                                    <Avatar 
                                        sx={{ 
                                            bgcolor: msg.role === 'assistant' ? 'primary.main' : 'secondary.main', 
                                            width: 32, 
                                            height: 32 
                                        }}
                                    >
                                        {msg.role === 'assistant' ? <AutoAwesomeIcon fontSize="small" /> : 'U'}
                                    </Avatar>
                                    
                                    <Paper sx={{ 
                                        p: 1.5, 
                                        borderRadius: 2, 
                                        borderTopLeftRadius: msg.role === 'assistant' ? 0 : undefined,
                                        borderTopRightRadius: msg.role === 'user' ? 0 : undefined,
                                        bgcolor: msg.role === 'user' ? 'primary.main' : 'background.paper',
                                        color: msg.role === 'user' ? 'primary.contrastText' : 'text.primary',
                                    }}>
                                        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                                            {msg.message}
                                        </Typography>
                                    </Paper>
                                </Box>

                                {/* Product Recommendations attached to message */}
                                {msg.products && msg.products.length > 0 && (
                                    <Box sx={{ display: 'flex', gap: 1, mt: 1, ml: 5, overflowX: 'auto', maxWidth: '300px', pb: 1 }}>
                                        {msg.products.map(product => (
                                            <Card key={product.id} sx={{ minWidth: 140, maxWidth: 140, flexShrink: 0 }}>
                                                <CardMedia
                                                    component="img"
                                                    height="100"
                                                    image={product.image}
                                                    alt={product.name}
                                                />
                                                <CardContent sx={{ p: 1, pb: "8px !important" }}>
                                                    <Typography variant="caption" noWrap display="block" fontWeight="bold">
                                                        {product.name}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary" display="block">
                                                        ${product.price}
                                                    </Typography>
                                                    <Button 
                                                        size="small" 
                                                        variant="text" 
                                                        fullWidth 
                                                        onClick={() => handleAddToCart(product)}
                                                        sx={{ mt: 0.5, p: 0, minWidth: 'unset', textTransform: 'none' }}
                                                    >
                                                        Add to Cart
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </Box>
                                )}
                            </Box>
                        ))}
                        
                        {isLoading && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                                    <AutoAwesomeIcon fontSize="small" />
                                </Avatar>
                                <CircularProgress size={20} />
                            </Box>
                        )}
                        <div ref={messagesEndRef} />
                    </Box>

                    {/* Input Area */}
                    <Box sx={{ p: 2, bgcolor: 'background.paper', borderTop: 1, borderColor: 'divider' }}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Ask for style advice..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyPress}
                            InputProps={{
                                endAdornment: (
                                    <IconButton color="primary" onClick={handleSend} disabled={!input.trim() || isLoading}>
                                        <SendIcon />
                                    </IconButton>
                                ),
                                sx: { borderRadius: 8, bgcolor: 'background.default' }
                            }}
                            size="small"
                        />
                    </Box>
                </Paper>
            </Slide>
        </>
    );
}
