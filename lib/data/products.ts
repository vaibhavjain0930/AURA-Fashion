import { Product } from "@/components/Product/CategoryTemplate";

// Unsplash Access Key for production
// Set this in .env.local as UNSPLASH_ACCESS_KEY
const UNSPLASH_CLIENT_ID = process.env.UNSPLASH_ACCESS_KEY || process.env.UNSPLASH_ACCESS_KEY_2;

const SEED_PRICES = [29.99, 45.00, 89.99, 120.00, 15.50, 65.00, 210.00, 54.99];
const SIZES = ["S", "M", "L", "XL"];
const COLORS = ["Black", "White", "Navy", "Beige", "Olive"];

// Helper to generate a deterministic random number based on a string seed
function seededRandom(seed: string) {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    const x = Math.sin(hash++) * 10000;
    return x - Math.floor(x);
}

export async function fetchCategoryProducts(category: string, subcategory: string): Promise<Product[]> {
    try {
        // Construct a search query that will yield good fashion results
        const query = `${category} fashion ${subcategory}`.toLowerCase();

        // We request 30 items to ensure we can meet the 20+ requirement easily even if some results are bad
        const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=30&orientation=portrait&client_id=${UNSPLASH_CLIENT_ID}`;

        const res = await fetch(url, { next: { revalidate: 3600 } }); // Cache for 1 hour

        if (!res.ok) {
            console.log(`Using mock fallback for ${category} ${subcategory} due to Unsplash API error.`);
            return generateMockFallback(category, subcategory, 30);
        }

        const data = await res.json();
        const results = data.results || [];
        if (!results || results.length < 20) {
            // If Unsplash somehow returns very few or fails, supplement with fallback
            const fallback = generateMockFallback(category, subcategory, 20 - results.length);
            return [...mapUnsplashToProducts(results, category, subcategory), ...fallback];
        }

        return mapUnsplashToProducts(results, category, subcategory);

    } catch (error) {
        console.error("Error in fetchCategoryProducts:", error);
        return generateMockFallback(category, subcategory);
    }
}

function mapUnsplashToProducts(unsplashData: any[], category: string, subcategory: string): Product[] {
    return unsplashData.map((photo: any) => {
        const urlSeed = photo.id;
        // Generate pseudo-random consistent attributes based on the photo ID
        const price = SEED_PRICES[Math.floor(seededRandom(urlSeed + "price") * SEED_PRICES.length)];
        const color = COLORS[Math.floor(seededRandom(urlSeed + "color") * COLORS.length)];

        return {
            id: photo.id,
            // Use the photo description or a generic name if missing
            name: photo.alt_description
                ? photo.alt_description.split(' ').slice(0, 5).join(' ').replace(/(^\w{1})|(\s+\w{1})/g, (letter: string) => letter.toUpperCase())
                : `${category.charAt(0).toUpperCase() + category.slice(1)} Premium ${subcategory.charAt(0).toUpperCase() + subcategory.slice(1)}`,
            price: price,
            image: photo.urls?.regular || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
            category: category,
            subcategory: subcategory,
            color: color,
            size: SIZES,
            rating: (seededRandom(urlSeed + "rating") * 2 + 3).toFixed(1), // Random rating between 3.0 and 5.0
            reviews: Math.floor(seededRandom(urlSeed + "reviews") * 200) + 10
        } as any; // Cast temporarily since we added rating/reviews and subcategory which need to be added to the interface
    });
}

function generateMockFallback(category: string, subcategory: string, count: number = 24): Product[] {
    // Robust categorical fallback generator
    let fallbackImages = [];
    
    if (subcategory.toLowerCase().includes('footwear') || subcategory.toLowerCase() === 'shoes') {
        fallbackImages = [
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
            "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80",
            "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80",
            "https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=800&q=80",
            "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80",
            "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&q=80",
            "https://images.unsplash.com/photo-1620926830740-410c55fbc72b?w=800&q=80",
            "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800&q=80"
        ];
    } else if (subcategory.toLowerCase().includes('accessories') || subcategory.toLowerCase().includes('bag') || subcategory.toLowerCase().includes('jewelry')) {
        fallbackImages = [
            "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
            "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=800&q=80",
            "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800&q=80",
            "https://images.unsplash.com/photo-1590736704728-f4730bb30770?w=800&q=80",
            "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80",
            "https://images.unsplash.com/photo-1599643477874-5c866f59b685?w=800&q=80",
            "https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=800&q=80",
            "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80"
        ];
    } else { // Clothing default
        fallbackImages = [
            "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
            "https://images.unsplash.com/photo-1434389678278-be43e4ff94e6?w=800&q=80",
            "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&q=80",
            "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&q=80",
            "https://images.unsplash.com/photo-1550614000-4b95d4668ba4?w=800&q=80",
            "https://images.unsplash.com/photo-1495385794356-15371f348c31?w=800&q=80",
            "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800&q=80",
            "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80"
        ];
    }

    return Array.from({ length: count }).map((_, i) => ({
        id: `mock-${category}-${subcategory}-${i}`,
        name: `AURA Signature ${subcategory} ${i + 1}`,
        price: SEED_PRICES[i % SEED_PRICES.length],
        image: fallbackImages[i % fallbackImages.length],
        category: category,
        subcategory: subcategory,
        color: COLORS[i % COLORS.length],
        size: SIZES,
        rating: (4.0 + (i % 10) / 10).toFixed(1),
        reviews: 20 + i * 5
    } as any));
}
