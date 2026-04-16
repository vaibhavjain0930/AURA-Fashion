import CategoryTemplate from "@/components/Product/CategoryTemplate";
import { fetchCategoryProducts } from "@/lib/data/products";
import { notFound } from "next/navigation";

// Valid categories and subcategories
const VALID_CATEGORIES = ["men", "women", "kids"];
const VALID_SUBCATEGORIES = ["clothing", "footwear", "accessories"];

interface PageProps {
  params: Promise<{
    category: string;
    subcategory: string;
  }>;
}

export default async function SubcategoryPage({ params }: PageProps) {
  const { category, subcategory } = await params;

  // Validate routes
  if (!VALID_CATEGORIES.includes(category) || !VALID_SUBCATEGORIES.includes(subcategory)) {
    notFound();
  }

  // Fetch real images dynamically (cached isomorphic fetch)
  const products = await fetchCategoryProducts(category, subcategory);

  const title = `${category}'s ${subcategory}`;
  const description = `Explore our curated collection of premium ${category}'s ${subcategory}. Featuring the latest trends, essential basics, and statement pieces designed to elevate your style.`;

  return <CategoryTemplate title={title} description={description} products={products} />;
}
