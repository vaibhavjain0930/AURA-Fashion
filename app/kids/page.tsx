import CategoryTemplate from "@/components/Product/CategoryTemplate";

const DUMMY_KIDS_PRODUCTS = [
  {
    id: "k-1",
    name: "Organic Cotton Tee",
    price: 25.00,
    image: "https://images.unsplash.com/photo-1519238263530-99abad67b86e?q=80&w=1968&auto=format&fit=crop",
    category: "Tops",
    color: "Stripe",
    size: ["2T", "3T", "4T", "5T"],
  },
  {
    id: "k-2",
    name: "Denim Overalls",
    price: 45.00,
    image: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?q=80&w=2037&auto=format&fit=crop",
    category: "Bottoms",
    color: "Blue",
    size: ["12M", "18M", "24M", "2T"],
  },
  {
    id: "k-3",
    name: "Puffer Jacket",
    price: 65.00,
    image: "https://images.unsplash.com/photo-1517409951680-e374d7547021?q=80&w=2070&auto=format&fit=crop",
    category: "Outerwear",
    color: "Yellow",
    size: ["3T", "4T", "5T"],
  }
];

export default function KidsCategoryPage() {
  return (
    <CategoryTemplate 
      title="Kids' Collection"
      description="Playful, durable, and comfortable. Find the perfect outfits for your little ones, crafted from premium organic materials."
      products={DUMMY_KIDS_PRODUCTS}
    />
  );
}
