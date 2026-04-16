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
        const { gender, occasion, season, budget } = body;

        if (!gender || !occasion || !season || !budget) {
            return NextResponse.json(
                { error: "Missing required fields: gender, occasion, season, budget" },
                { status: 400 }
            );
        }

        // 1. Fetch random catalog items to serve as our "inventory" for Gemini to pick from
        // We fetch a mix of tops, bottoms, and footwear for the specific gender
        const [tops, bottoms, footwear, accessories] = await Promise.all([
            fetchCategoryProducts(gender.toLowerCase(), "top"),
            fetchCategoryProducts(gender.toLowerCase(), "bottom"),
            fetchCategoryProducts(gender.toLowerCase(), "shoes"),
            fetchCategoryProducts(gender.toLowerCase(), "accessories")
        ]);

        const inventory = {
            tops: tops.slice(0, 10).map(p => ({ id: p.id, name: p.name, price: p.price, color: p.color })),
            bottoms: bottoms.slice(0, 10).map(p => ({ id: p.id, name: p.name, price: p.price, color: p.color })),
            footwear: footwear.slice(0, 10).map(p => ({ id: p.id, name: p.name, price: p.price, color: p.color })),
            accessories: accessories.slice(0, 5).map(p => ({ id: p.id, name: p.name, price: p.price, color: p.color }))
        };

        const prompt = `You are an expert AI Fashion Stylist.
A user has requested outfit recommendations with the following preferences:
- Gender: ${gender}
- Occasion: ${occasion}
- Season: ${season}
- Target Budget: ${budget}

Here is the available inventory:
${JSON.stringify(inventory, null, 2)}

Task:
Create 3 distinct recommended outfit bundles from the inventory provided.
Each bundle MUST include exactly 1 Top, 1 Bottom, 1 Footwear, and optionally 1 Accessory.
Ensure the items style well together for the ${occasion} occasion and ${season} season.
Ensure the total price of each bundle is reasonably close to or under the ${budget} budget.

Return ONLY a raw JSON array of 3 objects with no markdown formatting.
Each object must have this structure:
{
  "bundleName": "Catchy name for the outfit",
  "description": "Short explanation of why this works",
  "totalPrice": 123.45,
  "items": [
    { "type": "top", "id": "item_id_here" },
    { "type": "bottom", "id": "item_id_here" },
    { "type": "footwear", "id": "item_id_here" },
    { "type": "accessory", "id": "item_id_here" } // optional
  ]
}`;

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
            config: {
                temperature: 0.7,
                responseMimeType: "application/json",
            }
        });

        const textResponse = response.text || "[]";

        try {
            const bundles = JSON.parse(textResponse);

            // Re-hydrate the bundles with full product details
            const allProducts = [...tops, ...bottoms, ...footwear, ...accessories];

            const hydratedBundles = bundles.map((bundle: any) => {
                const hydratedItems = bundle.items.map((item: any) => {
                    const product = allProducts.find(p => p.id === item.id);
                    return {
                        ...item,
                        product: product || null
                    };
                }).filter((item: any) => item.product !== null); // Remove if not found

                // Recalculate true price based on actual products found
                const truePrice = hydratedItems.reduce((sum: number, item: any) => sum + item.product.price, 0);

                return {
                    ...bundle,
                    totalPrice: truePrice,
                    items: hydratedItems
                };
            });

            return NextResponse.json({ bundles: hydratedBundles });

        } catch (parseError) {
            console.error("Failed to parse Gemini outfit response:", textResponse);
            return NextResponse.json({ error: "Failed to generate valid outfits. Please try again." }, { status: 500 });
        }

    } catch (error) {
        console.error("Error generating outfit recommendations:", error);
        return NextResponse.json(
            { error: "An error occurred while generating recommendations" },
            { status: 500 }
        );
    }
}
