import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { fetchCategoryProducts } from "@/lib/data/products";

const ai = new GoogleGenAI({});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { query } = body;

        if (!query) {
            return NextResponse.json({ error: "Query is required" }, { status: 400 });
        }

        let searchParams = {
            category: "any",
            color: "any",
            occasion: "any",
            maxPrice: 9999
        };

        // If Gemini is available, use it to parse the intent semantically
        if (process.env.GEMINI_API_KEY) {
            const prompt = `You are a smart e-commerce search parser.
Extract search parameters from this user query: "${query}"

Return ONLY a raw JSON object with no markdown formatting.
If a parameter is not mentioned, use "any" (or 9999 for maxPrice).
Categories could be: top, bottom, dress, shoes, accessories. 

Format:
{
  "category": "extracted category or 'any'",
  "color": "extracted color or 'any'",
  "occasion": "extracted occasion (casual, party, formal, etc.) or 'any'",
  "maxPrice": numeric value or 9999
}`;

            try {
                const response = await ai.models.generateContent({
                    model: "gemini-2.0-flash",
                    contents: prompt,
                    config: {
                        temperature: 0.1,
                        responseMimeType: "application/json",
                    }
                });

                const textResponse = response.text || "{}";
                const cleanedText = textResponse.replace(/```json/g, "").replace(/```/g, "").trim();
                searchParams = { ...searchParams, ...JSON.parse(cleanedText) };
            } catch (pluginError) {
                console.warn("Gemini parsing failed, falling back to basic text matching.", pluginError);
            }
        }

        // Fetch a broad set of products to filter against
        // In a real app, this would be a database query using the extracted params
        const [tops, bottoms, dresses, shoes] = await Promise.all([
            fetchCategoryProducts("women", "top"),
            fetchCategoryProducts("women", "bottom"),
            fetchCategoryProducts("women", "dress"),
            fetchCategoryProducts("women", "shoes"),
        ]);

        let allProducts = [...tops, ...bottoms, ...dresses, ...shoes];

        // Apply semantic filters
        let filteredProducts = allProducts.filter(p => {
            let match = true;

            // Basic text matching as a fallback/addition
            const searchStr = `${p.name} ${p.category} ${p.color}`.toLowerCase();
            const queryTokens = query.toLowerCase().split(' ');

            // semantic filtering
            if (searchParams.category !== "any" && !searchStr.includes(searchParams.category.toLowerCase())) {
                match = false;
            }
            if (searchParams.color !== "any" && p.color.toLowerCase() !== searchParams.color.toLowerCase()) {
                match = false;
            }
            if (searchParams.maxPrice < 9999 && p.price > searchParams.maxPrice) {
                match = false;
            }

            // Also ensure some of the literal query words hit if semantic wasn't enough
            if (searchParams.category === "any" && searchParams.color === "any") {
                const hasTokenMatch = queryTokens.some((token: string) => token.length > 2 && searchStr.includes(token));
                if (!hasTokenMatch) match = false;
            }

            return match;
        });

        // Limit results
        filteredProducts = filteredProducts.slice(0, 12);

        return NextResponse.json({
            results: filteredProducts,
            parsedQuery: searchParams
        });

    } catch (error) {
        console.error("Semantic Search Error:", error);
        return NextResponse.json(
            { error: "Search failed." },
            { status: 500 }
        );
    }
}
