import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { fetchCategoryProducts } from "@/lib/data/products";

const ai = new GoogleGenAI({});

export async function POST(req: Request) {
    try {
        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: "GEMINI_API_KEY is not configured.", role: "assistant" },
                { status: 500 }
            );
        }

        const body = await req.json();
        const { message, history } = body;

        if (!message) {
            return NextResponse.json(
                { error: "Message is required" },
                { status: 400 }
            );
        }

        // To make the stylist effective, we give it a sample of our catalog to recommend from
        // In a real app, you'd use a vector DB or search API here based on extracted keywords.
        // For now, we'll fetch a broad sample of products so the AI has context of what we sell.
        const [tops, bottoms, dresses, accessories] = await Promise.all([
            fetchCategoryProducts("women", "top"),
            fetchCategoryProducts("women", "bottom"),
            fetchCategoryProducts("women", "dress"),
            fetchCategoryProducts("unisex", "accessories")
        ]);

        const allProducts = [...tops, ...bottoms, ...dresses, ...accessories].slice(0, 40); // 40 item catalog context
        const catalogContext = allProducts.map(p => ({
            id: p.id,
            name: p.name,
            price: p.price,
            color: p.color,
            category: p.category
        }));

        const systemPrompt = `You are "AURA Stylist", a friendly, trendy, and helpful AI fashion assistant for the AURA Fashion e-commerce platform.
Your goal is to help users find the perfect outfit, answer styling questions, and recommend specific products from our catalog.

Tone: Professional yet conversational, stylish, encouraging. Keep responses relatively concise.

Here is a sample of our current product catalog you can recommend from:
${JSON.stringify(catalogContext, null, 2)}

Instructions:
1. Answer the user's styling question or request naturally.
2. If the user is looking for recommendations, select 1-3 suitable product IDs from the catalog provided that match their request.
3. Return your response in a consistent JSON format so our frontend can render it nicely.

Output Format MUST BE RAW JSON ONLY (no markdown backticks):
{
  "text": "Your conversational response here...",
  "recommendedProductIds": ["id1", "id2"] // Array of up to 3 product IDs from the catalog context. Empty array if none apply.
}`;

        // Format history for Gemini API
        const formattedHistory = history ? history.map((msg: any) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.message }]
        })) : [];

        // Start chat session
        const chat = ai.chats.create({
            model: "gemini-2.0-flash",
            config: {
                systemInstruction: systemPrompt,
                temperature: 0.7,
            }
        });

        // If we have history, we'd ideally pass it to the chat object initialization 
        // using the node sdk, but since the @google/genai sdk syntax for history can vary,
        // we'll append the history as context to the current prompt if needed or just send the message
        // For simplicity in this implementation, we send the prompt directly.

        const responseMsg = await chat.sendMessage({
            message: message
        });

        const responseText = responseMsg.text || "{}";

        try {
            // Strip markdown formatting if any
            const cleanedText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
            const parsedResponse = JSON.parse(cleanedText);

            // Fetch the full product details for the recommended IDs
            const recommendedProducts = parsedResponse.recommendedProductIds
                ? allProducts.filter(p => parsedResponse.recommendedProductIds.includes(p.id))
                : [];

            return NextResponse.json({
                text: parsedResponse.text,
                products: recommendedProducts,
                role: "assistant"
            });

        } catch (parseError) {
            console.error("Failed to parse Stylist JSON response:", responseText);
            // Fallback if the AI just returns plain text instead of JSON
            return NextResponse.json({
                text: responseText,
                products: [],
                role: "assistant"
            });
        }

    } catch (error) {
        console.error("Error in AI Stylist:", error);
        return NextResponse.json(
            { error: "I'm having trouble connecting to my stylist database right now. Please try again later.", role: "assistant" },
            { status: 500 }
        );
    }
}
