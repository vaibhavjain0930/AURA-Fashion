import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

// In a real application, you would run this via a cron job or background worker
// to pre-generate tags for new products and save them to the database.
// For this demo, we'll build an endpoint that can be called to generate tags on the fly.

export async function POST(req: Request) {
    try {
        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: "GEMINI_API_KEY is not configured." },
                { status: 500 }
            );
        }

        const body = await req.json();
        const { product } = body;

        if (!product || !product.name || !product.category) {
            return NextResponse.json(
                { error: "Product information (name, category) is required" },
                { status: 400 }
            );
        }

        const prompt = `You are an AI fashion merchandiser.
Analyze this product and generate 1-3 catchy, highly relevant promotional or stylistic tags.

Product Details:
Name: ${product.name}
Category: ${product.category}
Subcategory: ${product.subcategory || 'N/A'}
Color: ${product.color || 'N/A'}

Rules for tags:
1. Keep them short (1-3 words max).
2. Examples: "Trending 🔥", "Wedding Special 💍", "Summer Collection ☀️", "Office Wear 💼", "Streetwear", "Bestseller".
3. Include a relevant emoji if appropriate.
4. Only return a raw JSON array of strings (no markdown blocks, no other text).

Expected Output Format:
["Tag 1 🌟", "Tag 2 💫"]
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
            config: {
                temperature: 0.4,
                responseMimeType: "application/json",
            }
        });

        const textResponse = response.text || "[]";

        try {
            const cleanedText = textResponse.replace(/```json/g, "").replace(/```/g, "").trim();
            const tags = JSON.parse(cleanedText);

            return NextResponse.json({ tags });

        } catch (parseError) {
            console.error("Failed to parse Gemini tags response:", textResponse);

            // Fallback tags if parsing fails but we still want to show something
            const fallbackTags = [];
            if (product.name.toLowerCase().includes('dress')) fallbackTags.push('Trending 🔥');
            else fallbackTags.push('New Arrival ✨');

            return NextResponse.json({ tags: fallbackTags });
        }

    } catch (error) {
        console.error("Error generating tags:", error);
        return NextResponse.json(
            { error: "An error occurred while generating tags" },
            { status: 500 }
        );
    }
}
