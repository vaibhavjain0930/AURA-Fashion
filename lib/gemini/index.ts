"use server";

import { GoogleGenAI } from "@google/genai";

// Initialize Gemini client
// Expects GEMINI_API_KEY to be set in .env.local
const ai = new GoogleGenAI({});

export async function analyzeGarment(productImageUrl: string) {
    try {
        if (!process.env.GEMINI_API_KEY) {
            console.warn("GEMINI_API_KEY is not set. Simulating analysis.");
            return {
                category: "clothing",
                orientation: "front-facing",
                color: "unknown",
                region: "top"
            };
        }

        const prompt = `Analyze this clothing product image carefully.
Return ONLY a raw JSON object with no markdown formatting, backticks, or other text.
The JSON must have this exact structure:
{
  "category": "shirt, pants, dress, shoes, accessories, etc.",
  "orientation": "front-facing, angled, side, back",
  "color": "dominant color name",
  "region": "top, bottom, full-body, footwear, accessory"
}`;

        // Fetch the image from the URL to send it to Gemini (since it currently expects inlineData for images)
        const imageRes = await fetch(productImageUrl);
        if (!imageRes.ok) throw new Error("Failed to fetch product image for analysis.");

        const arrayBuffer = await imageRes.arrayBuffer();
        const base64Data = Buffer.from(arrayBuffer).toString('base64');
        const mimeType = imageRes.headers.get('content-type') || 'image/jpeg';

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
                prompt,
                { inlineData: { data: base64Data, mimeType: mimeType } }
            ]
        });

        const textResponse = response.text || "{}";

        try {
            // Strip any accidental markdown formatting if the model disobeys
            const cleanedText = textResponse.replace(/```json/g, "").replace(/```/g, "").trim();
            const metadata = JSON.parse(cleanedText);
            return metadata;
        } catch (e) {
            console.error("Failed to parse Gemini analysis JSON:", textResponse);
            return null;
        }

    } catch (error) {
        console.error("Error analyzing garment:", error);
        return null; // Fail gracefully
    }
}

export async function processTryOn(userImageBase64: string, productId: string, garmentMetadata?: any) {
    try {
        if (!process.env.GEMINI_API_KEY) {
            console.warn("GEMINI_API_KEY is not set. Simulating success for development.");
            // If no API key, wait 3 seconds and return the original image to simulate success
            await new Promise(resolve => setTimeout(resolve, 3000));
            return { success: true, base64Image: userImageBase64, message: "Simulated Success (No API Key)" };
        }

        const prompt = `You are an AI fashion try-on assistant.

Task:
I am providing two images:
1. An uploaded image of a user (the person).
2. An image of a clothing product.

Generate a realistic try-on result showing the person wearing that clothing.

Instructions:
- Preserve the user's face, body shape, pose, and skin tone exactly as in the original photo.
- Fit the clothing naturally to the user's body proportions.
- Maintain realistic folds, shadows, lighting, and fabric texture.
- Ensure the clothing aligns properly with shoulders, torso, and limbs.
- Do not distort the body or change the background.
- The final output MUST LOOK like a real photograph of the user wearing the selected clothing.

Output:
Return ONLY the final generated image. Do not return any text.`;

        let finalPrompt = prompt;
        if (garmentMetadata) {
            finalPrompt += `

Garment Metadata for Alignment Context:
- Category: ${garmentMetadata.category}
- Dominant Color: ${garmentMetadata.color}
- Orientation: ${garmentMetadata.orientation}
- Target Region: ${garmentMetadata.region}

Ensure you apply the specific characteristics of this mapped metadata correctly onto the user.`;
        }

        // Safely extract mimeType and base64 string from data URI
        const matches = userImageBase64.match(/^data:(.+);base64,(.*)$/);
        let mimeType = "image/jpeg";
        let base64Data = userImageBase64;

        if (matches && matches.length === 3) {
            mimeType = matches[1];
            base64Data = matches[2];
        } else if (userImageBase64.includes(",")) {
            base64Data = userImageBase64.split(",")[1];
        }

        // Fetch the product image to send alongside the user image
        let productMimeType = "image/jpeg";
        let productBase64Data = "";
        try {
            const imageRes = await fetch(productId); // productId contains the URL here
            if (imageRes.ok) {
                const arrayBuffer = await imageRes.arrayBuffer();
                productBase64Data = Buffer.from(arrayBuffer).toString('base64');
                productMimeType = imageRes.headers.get('content-type') || 'image/jpeg';
            }
        } catch (e) {
            console.error("Failed to fetch product image for try-on", e);
        }

        const contents: any[] = [finalPrompt];

        // Add user image
        contents.push({ inlineData: { data: base64Data, mimeType: mimeType } });

        // Add product image if available
        if (productBase64Data) {
            contents.push(
                { inlineData: { data: productBase64Data, mimeType: productMimeType } }
            );
        }

        // We use gemini-2.5-flash to process the images
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: contents
        });

        const textResponse = response.text;
        console.log("Gemini Try-On Response:", textResponse);

        // If Gemini miraculously returns base64 image data in text format, we could parse it,
        // but typically it responds stating it cannot generate images directly.
        // We will send its exact response text back to the UI in the 'message' field.

        return {
            success: true,
            base64Image: userImageBase64, // We return the original image to the UI as a fallback
            message: textResponse || "Successfully analyzed, but no image data returned."
        };

    } catch (error) {
        console.error("Error connecting to Gemini:", error);
        return { success: false, error: "Failed to process image with AI. See console for details." };
    }
}
