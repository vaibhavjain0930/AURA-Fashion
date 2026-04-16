import CategoryTemplate from "@/components/Product/CategoryTemplate";

const DUMMY_MEN_PRODUCTS = [
  {
    id: "m-1",
    name: "Classic Oxford Shirt",
    price: 85.00,
    image: "https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?q=80&w=1976&auto=format&fit=crop",
    category: "Shirts",
    color: "White",
    size: ["S", "M", "L", "XL"],
  },
  {
    id: "m-2",
    name: "Selvedge Denim Jeans",
    price: 150.00,
    image: "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?q=80&w=2070&auto=format&fit=crop",
    category: "Pants",
    color: "Indigo",
    size: ["30", "32", "34", "36"],
  },
  {
    id: "m-3",
    name: "Merino Wool Crewneck",
    price: 110.00,
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1972&auto=format&fit=crop",
    category: "Sweaters",
    color: "Charcoal",
    size: ["M", "L", "XL"],
  },
  {
    id: "m-4",
    name: "Minimalist Leather Sneakers",
    price: 195.00,
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1974&auto=format&fit=crop",
    category: "Shoes",
    color: "White",
    size: ["8", "9", "10", "11"],
  }
];

export default function MenCategoryPage() {
  return (
    <CategoryTemplate 
      title="Men's Collection"
      description="Refined essentials and statement pieces. Discover high-quality tailoring, premium casualwear, and modern accessories for the discerning gentleman."
      products={DUMMY_MEN_PRODUCTS}
    />
  );
}
