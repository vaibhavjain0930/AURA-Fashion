import CategoryTemplate from "@/components/Product/CategoryTemplate";

const DUMMY_WOMEN_PRODUCTS = [
  {
    id: "w-1",
    name: "Silk Slip Dress",
    price: 189.99,
    image: "https://images.unsplash.com/photo-1572804013309-0021b36d0e65?q=80&w=1964&auto=format&fit=crop",
    category: "Dresses",
    color: "Champagne",
    size: ["S", "M", "L"],
  },
  {
    id: "w-2",
    name: "Oversized Wool Coat",
    price: 299.00,
    image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=1974&auto=format&fit=crop",
    category: "Outerwear",
    color: "Camel",
    size: ["XS", "S", "M"],
  },
  {
    id: "w-3",
    name: "Tailored Trousers",
    price: 125.00,
    image: "https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?q=80&w=1974&auto=format&fit=crop",
    category: "Pants",
    color: "Black",
    size: ["2", "4", "6", "8"],
  },
  {
    id: "w-4",
    name: "Cashmere Turtleneck",
    price: 145.00,
    image: "https://images.unsplash.com/photo-1558236166-419b1af89163?q=80&w=1968&auto=format&fit=crop",
    category: "Sweaters",
    color: "Cream",
    size: ["S", "M", "L", "XL"],
  },
  {
    id: "w-5",
    name: "Pleated Midi Skirt",
    price: 95.00,
    image: "https://images.unsplash.com/photo-1583496661160-c5dcb2241c6d?q=80&w=1974&auto=format&fit=crop",
    category: "Skirts",
    color: "Navy",
    size: ["XS", "S", "M", "L"],
  }
];

export default function WomenCategoryPage() {
  return (
    <CategoryTemplate 
      title="Women's Collection"
      description="Elevate your everyday wardrobe with our carefully curated women's collection. Designed for the modern woman focusing on elegance, comfort, and sustainable luxury."
      products={DUMMY_WOMEN_PRODUCTS}
    />
  );
}
