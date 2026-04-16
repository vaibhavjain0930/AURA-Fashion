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
        const { product } = body;

        if (!product || !product.name || !product.category) {
            return NextResponse.json(
                { error: "Anchor product information is required" },
                { status: 400 }
            );
        }

        // Fetch a pool of products to build the bundle from
        // Depending on the anchor (women's top), fetch women's bottoms, shoes, accessories
        const targetGender = product.category.toLowerCase().includes("men") ? "men" : "women";

        const [bottoms, shoes, accessories] = await Promise.all([
            fetchCategoryProducts(targetGender, "bottom"),
            fetchCategoryProducts("unisex", "shoes"),
            fetchCategoryProducts(targetGender, "accessories")
        ]);

        const inventory = {
            bottoms: bottoms.slice(0, 5),
            shoes: shoes.slice(0, 5),
            accessories: accessories.slice(0, 5) // Send a small subset to save tokens
        };

        const prompt = `You are an expert fashion stylist.
Your client has selected this anchor product:
Name: ${product.name}
Category: ${product.category}
Color: ${product.color || 'N/A'}

Your task is to build a PERFECT completing outfit from the provided inventory below.
Select EXACTLY ONE bottom, ONE shoe, and ONE accessory that perfectly matches the anchor product's style, color palette, and vibe.

Inventory:
${JSON.stringify(inventory)}

Respond ONLY with a raw JSON array containing exactly 3 string IDs of the chosen items. Do not use markdown blocks.
Example valid output:
["bot-123", "shoe-456", "acc-789"]
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
            config: {
                temperature: 0.2
            }
        });

        const textResponse = response.text || "[]";

        let selectedIds: string[] = [];
        try {
            const cleanedText = textResponse.replace(/```json/g, "").replace(/```/g, "").trim();
            selectedIds = JSON.parse(cleanedText);
        } catch (parseError) {
            console.error("Failed to parse Gemini outfit response:", textResponse);
            // Fallbacks
            selectedIds = [
                inventory.bottoms[0]?.id,
                inventory.shoes[0]?.id,
                inventory.accessories[0]?.id
            ].filter(Boolean) as string[];
        }

        // Hydrate the actual product data for the client
        const allAvailable = [...bottoms, ...shoes, ...accessories];
        const hydratedBundle = selectedIds
            .map(id => allAvailable.find(p => p.id === id))
            .filter(Boolean);

        return NextResponse.json({ items: hydratedBundle });

    } catch (error) {
        console.error("Error building outfit:", error);
        return NextResponse.json(
            { error: "An error occurred while building the outfit" },
            { status: 500 }
        );
    }
}
