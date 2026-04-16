"use client";

import { useState, useRef, useTransition, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/UI/Button";
import Link from "next/link";
import { Upload, X, Camera, RefreshCw, Wand2, Download, Save, Share2, Info } from "lucide-react";
import { processTryOn, analyzeGarment } from "@/lib/gemini";
import { useSearchParams } from "next/navigation";

import toast from "react-hot-toast";

function TryOnContent() {
  const searchParams = useSearchParams();
  const productUrl = searchParams.get('productUrl') || "https://images.unsplash.com/photo-1572804013309-0021b36d0e65?q=80&w=1964&auto=format&fit=crop";
  
  const [photo, setPhoto] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState<string>("");
  const [resultImage, setResultImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
        setResultImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
        setResultImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const [isPending, startTransition] = useTransition();

  const handleTryOn = () => {
    if (!photo) return;
    setIsProcessing(true);
    setAnalysisStatus("Analyzing garment structure...");
    
    startTransition(async () => {
      // 1. Analyze the garment first using Gemini 2.5 Flash
      const metadata = await analyzeGarment(productUrl);
      console.log("Garment Metadata:", metadata);
      
      setAnalysisStatus("Mapping clothing to your body shape...");
      
      // 2. Generate the styling advice using Gemini 2.5 Flash with both images
      const result = await processTryOn(photo, productUrl, metadata);
      setIsProcessing(false);
      
      if (result.success) {
        setResultImage(result.base64Image || photo);
        setAnalysisStatus(result.message || "Advice generated!");
        toast.success("Style advice generated successfully!");
      } else {
        toast.error("Failed to process. Please try again.");
      }
    });
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#121212] text-xs font-semibold uppercase tracking-widest mb-4 text-black dark:text-white">
            <Wand2 className="w-3 h-3 text-[#4285F4]" /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4285F4] via-[#EA4335] to-[#FBBC05]">Powered by Google AI</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Virtual Try-On Room</h1>
          <p className="text-gray-500 max-w-xl mx-auto font-light">
            Upload a clear, full-body photo of yourself to see how our clothing looks on your unique body type and skin tone.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          
          {/* Upload & Source Image Area */}
          <div className="space-y-6">
            <h3 className="text-xl font-serif font-semibold border-b border-gray-200 dark:border-gray-800 pb-4">1. Your Photo</h3>
            
            <AnimatePresence mode="wait">
              {!photo ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full aspect-[3/4] rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 bg-white dark:bg-[#121212] flex flex-col items-center justify-center p-8 text-center cursor-pointer hover:border-black dark:hover:border-white transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                    <Upload className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="font-semibold mb-2">Click to Upload or Drag & Drop</h4>
                  <p className="text-sm text-gray-500 max-w-xs">
                    For best results, upload a well-lit, front-facing photo against a plain background.
                  </p>
                  <input 
                    type="file" 
                    accept="image/*" 
                    hidden 
                    ref={fileInputRef} 
                    onChange={handlePhotoUpload}
                  />
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 shadow-lg"
                >
                  <img src={photo} alt="Uploaded" className="w-full h-full object-cover" />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white text-black transition-colors"
                    >
                      <Camera className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => { setPhoto(null); setResultImage(null); }}
                      className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white text-black transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Selected Garment View */}
            <div className="p-4 bg-white dark:bg-[#121212] rounded-xl border border-gray-200 dark:border-gray-800 flex items-center gap-4">
              <img src={productUrl} className="w-16 h-20 rounded-md object-cover bg-gray-100" alt="Selected Product" />
              <div className="flex-1">
                <span className="text-xs uppercase tracking-widest text-gray-500">Selected Item</span>
                <h4 className="font-semibold text-sm line-clamp-1">AURA Premium Product</h4>
                <div className="flex items-center gap-1 mt-1 text-xs text-blue-500 bg-blue-50 dark:bg-blue-900/20 w-max px-2 py-0.5 rounded">
                    <Info className="w-3 h-3 text-[#4285F4]" />
                    <span className="font-medium">AI Vision Review Ready</span>
                </div>
              </div>
              <Link href="/women/clothing" className="text-xs underline text-gray-500 hover:text-black dark:hover:text-white">Change</Link>
            </div>
          </div>

          {/* Results Area */}
          <div className="space-y-6 flex flex-col h-full">
            <h3 className="text-xl font-serif font-semibold border-b border-gray-200 dark:border-gray-800 pb-4">2. The Result</h3>
            
            <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#121212] flex-1 flex flex-col items-center justify-center">
              
              {!photo && !isProcessing && !resultImage && (
                <div className="text-center p-8 opacity-50">
                  <Wand2 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Upload a photo to see the magic</p>
                </div>
              )}

              {photo && !isProcessing && !resultImage && (
                <div className="absolute inset-x-0 bottom-8 px-8 z-10">
                  <Button 
                    size="lg" 
                    className="w-full shadow-2xl bg-gradient-to-r from-[#4285F4] via-[#EA4335] to-[#FBBC05] hover:opacity-90 border-none before:hidden text-white"
                    onClick={handleTryOn}
                  >
                    <Wand2 className="w-5 h-5 mr-2 text-white" /> Get AI Stylist Advice
                  </Button>
                </div>
              )}

              {isProcessing && (
                <div className="absolute inset-0 z-20 bg-white/90 dark:bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 mb-6"
                  >
                    <RefreshCw className="w-full h-full text-[#FBBC05]" />
                  </motion.div>
                  <h4 className="font-serif text-xl mb-2">AI Stylist is working...</h4>
                  <p className="text-sm text-gray-500">{analysisStatus}</p>
                  
                  {/* Progress Bar Mock */}
                  <div className="w-64 h-1 bg-gray-200 dark:bg-gray-800 rounded-full mt-8 overflow-hidden">
                    <motion.div 
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 3, ease: "linear" }}
                      className="h-full bg-gradient-to-r from-[#4285F4] via-[#EA4335] to-[#34A853]"
                    />
                  </div>
                </div>
              )}

              {resultImage && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 z-10 group bg-white dark:bg-[#121212] flex flex-col"
                >
                  <div className="flex-1 overflow-y-auto p-6 prose dark:prose-invert prose-sm max-w-none">
                     {/* Try to format the markdown somewhat nicely, or just show text for now */}
                     <div className="mb-4">
                        <img src={resultImage} alt="Your Photo" className="w-24 h-24 object-cover rounded-full border-2 border-primary mx-auto shadow-md" />
                     </div>
                     <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                      {analysisStatus}
                     </div>
                  </div>
                  
                  {/* Result Actions */}
                  <div className="p-4 bg-gray-50 dark:bg-black/50 border-t border-gray-200 dark:border-gray-800 flex gap-4">
                    <Button variant="outline" className="flex-1 flex gap-2" onClick={() => {setResultImage(null); setAnalysisStatus("");}}>
                      <RefreshCw className="w-4 h-4" /> Start Over
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function TryOnPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-32 text-center">Loading AI Try-On Studio...</div>}>
      <TryOnContent />
    </Suspense>
  );
}
