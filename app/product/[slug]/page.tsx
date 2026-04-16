import { fetchCategoryProducts } from "@/lib/data/products";
import ProductClientView from "@/components/Product/ProductClientView";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;

  // For a real app, this would be `await fetchProductById(slug)`.
  // Since we're using dynamic unsplash data per category, we will fetch a batch and find the matching ID, 
  // or just generate a fresh one if it was deep-linked.
  
  // To simulate this working beautifully without a real DB:
  // We fetch a generic batch across all categories to ensure there's data, or build a fallback product based on the slug.
  const [women, men, kids] = await Promise.all([
     fetchCategoryProducts("women", "clothing"),
     fetchCategoryProducts("men", "clothing"),
     fetchCategoryProducts("kids", "clothing"),
  ]);
  const products = [...women, ...men, ...kids];
  let product = products.find(p => p.id === slug);

  if (!product) {
      // If the user deep links to an ID that rolled out of our 20-item cache, we mock it gracefully
      product = {
          id: slug,
          name: "AURA Premium Selection",
          price: 150.00,
          image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
          category: "Exclusive",
          color: "Black",
          size: ["S", "M", "L"],
          rating: "4.9",
          reviews: 342,
      };
  }

  if (!product) {
      return notFound();
  }

  // Hydrate the single image into an array for the gallery
  const galleryImages = [
      product.image,
      "https://images.unsplash.com/photo-1550614000-4b95d4668ba4?w=800&q=80",
      "https://images.unsplash.com/photo-1434389678278-be43e4ff94e6?w=800&q=80"
  ];

  const fullProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      description: "Crafted from premium materials, this piece drapes beautifully over the body. Featuring thoughtful details and exceptional quality for the ultimate luxury feel. Perfect for elevating your everyday wardrobe.",
      images: galleryImages,
      colors: [product.color || "Black", "White", "Navy"],
      sizes: product.size || ["S", "M", "L"],
      rating: product.rating || 4.5,
      reviews: product.reviews || 120,
      category: product.category || "clothing"
  };

  return <ProductClientView product={fullProduct} />;
}
