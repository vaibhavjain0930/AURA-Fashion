import HomeClient from "@/components/HomeClient";
import { fetchCategoryProducts } from "@/lib/data/products";

export default async function Home() {
  // Fetch dynamic categories utilizing Unsplash
  const womenData = await fetchCategoryProducts("women", "clothing");
  const menData = await fetchCategoryProducts("men", "clothing");
  const kidsData = await fetchCategoryProducts("kids", "clothing");

  // Format into Categories arrays
  const categories = [
    { 
      name: "Women", 
      image: womenData[2]?.image || "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070", 
      href: "/women/clothing" 
    },
    { 
      name: "Men", 
      image: menData[2]?.image || "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1974", 
      href: "/men/clothing" 
    },
    { 
      name: "Kids", 
      image: kidsData[2]?.image || "https://images.unsplash.com/photo-1514090259020-7e0f8f895fb4?q=80&w=2070", 
      href: "/kids/clothing" 
    }
  ];

  // Snag top 4 trendy items globally from fetched datasets
  const trendingItems = [
    womenData[0],
    womenData[1],
    menData[0],
    menData[1]
  ].filter(Boolean);

  return <HomeClient categories={categories} trendingItems={trendingItems} />;
}
