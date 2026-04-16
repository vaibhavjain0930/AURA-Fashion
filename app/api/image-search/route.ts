import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { fetchCategoryProducts } from "@/lib/data/products";

const ai = new GoogleGenAI({});

export async function POST(req: Request) {
    try {
        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: "GEMINI_API_KEY is not configured." },
                { status: 500 }
            );
        }

        const body = await req.json();
        const { imageBase64 } = body;

        if (!imageBase64) {
            return NextResponse.json(
                { error: "Image is required" },
                { status: 400 }
            );
        }

        // 1. Analyze the uploaded image using Gemini Vision
        const prompt = `Analyze this uploaded clothing image.
Return ONLY a raw JSON object with no markdown.
Extract these details to help find similar items in our catalog:
{
  "category": "top, bottom, dress, shoes, or accessories",
  "color": "dominant color",
  "style": "casual, formal, sporty, elegant, etc.",
  "keywords": ["keyword1", "keyword2", "pattern name if any"]
}`;

        // Extract base64 data and mime type
        const matches = imageBase64.match(/^data:(.+);base64,(.*)$/);
        let mimeType = "image/jpeg";
        let base64Data = imageBase64;

        if (matches && matches.length === 3) {
            mimeType = matches[1];
            base64Data = matches[2];
        } else if (imageBase64.includes(",")) {
            base64Data = imageBase64.split(",")[1];
        }

        const analysisResponse = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: [
                prompt,
                { inlineData: { data: base64Data, mimeType } }
            ],
            config: {
                temperature: 0.1
            }
        });

        const textResponse = analysisResponse.text || "{}";
        let analysis;
        try {
            const cleanedText = textResponse.replace(/```json/g, "").replace(/```/g, "").trim();
            analysis = JSON.parse(cleanedText);
        } catch (e) {
            console.error("Failed to parse visual analysis:", textResponse);
            return NextResponse.json({ error: "Could not analyze the image clearly." }, { status: 400 });
        }

        // 2. Fetch products to compare against (in a real app, do an embedding/vector search)
        // Here we map the broad category to our Unsplash fetchers
        let genderStr = "women"; // default fallback
        if (analysis.style?.toLowerCase().includes("men")) genderStr = "men";

        let targetCategory = "top";
        if (analysis.category) {
            const cat = analysis.category.toLowerCase();
            if (cat.includes("bottom") || cat.includes("pant") || cat.includes("skirt")) targetCategory = "bottom";
            else if (cat.includes("dress")) targetCategory = "dress";
            else if (cat.includes("shoe") || cat.includes("footwear")) targetCategory = "shoes";
            else if (cat.includes("access")) targetCategory = "accessories";
        }

        const potentialMatches = await fetchCategoryProducts(genderStr, targetCategory);

        // 3. Filter and score matches based on analysis
        const scoredProducts = potentialMatches.map(product => {
            let score = 0;
            const searchStr = `${product.name} ${product.color} ${product.category}`.toLowerCase();

            // Color match is very important for visual search
            if (analysis.color && searchStr.includes(analysis.color.toLowerCase())) {
                score += 3;
            }

            // Keywords match
            if (analysis.keywords && Array.isArray(analysis.keywords)) {
                analysis.keywords.forEach((kw: string) => {
                    if (searchStr.includes(kw.toLowerCase())) score += 1;
                });
            }

            return { product, score };
        });

        // Sort by score descending and take top 8
        const topMatches = scoredProducts
            .sort((a, b) => b.score - a.score)
            .map(item => item.product)
            .slice(0, 8);

        return NextResponse.json({
            analysis,
            results: topMatches
        });

    } catch (error) {
        console.error("Error in image search:", error);
        return NextResponse.json(
            { error: "An error occurred during image search" },
            { status: 500 }
        );
    }
}
