export interface CatalogProduct {
  id: string;
  name: string;
  price: string;
  priceRaw: number;
  image: string;
  category: string;
  badge?: string;
  sizes: string[];
  colors: string[];
  description: string;
}

export const CATALOG: CatalogProduct[] = [
  { id: "1",  name: "The Royal Pleat",  price: "₦45,000", priceRaw: 45000, image: "/images/gp-royal-pleat.png",       category: "solid", badge: "Bestseller", sizes: ["XS","S","M","L","XL","2XL"],       colors: ["#6B2D8B"], description: "A regal silhouette with deep front pleats and a wide-leg cut. Crafted from premium suiting fabric for an authoritative presence." },
  { id: "2",  name: "Onyx Statement",   price: "₦38,000", priceRaw: 38000, image: "/images/gp-onyx-statement.png",    category: "solid", badge: "New",        sizes: ["XS","S","M","L","XL","2XL","3XL"], colors: ["#1a1a1a"], description: "Polished and powerful. The Onyx Statement is a solid black trouser designed to command every room you walk into." },
  { id: "3",  name: "Ivory Sovereign",  price: "₦42,000", priceRaw: 42000, image: "/images/gp-ivory-sovereign.png",   category: "solid", badge: "New",        sizes: ["S","M","L","XL"],                  colors: ["#f5f0e8"], description: "Clean ivory tones meet architectural tailoring. A piece for those who understand that restraint is its own form of power." },
  { id: "4",  name: "Sahara Wide",      price: "₦36,000", priceRaw: 36000, image: "/images/gp-sahara-wide.png",       category: "solid", badge: "New",        sizes: ["XS","S","M","L","XL","2XL"],       colors: ["#c4a882"], description: "Earth-toned and effortlessly wide. The Sahara draws from the desert's palette for a grounded, confident stance." },
  { id: "5",  name: "Petal Pleat",      price: "₦40,000", priceRaw: 40000, image: "/images/gp-petal-pleat.png",       category: "solid", badge: "New",        sizes: ["XS","S","M","L","XL","2XL"],       colors: ["#f4a7b9"], description: "Soft pleats in a delicate blush. The Petal brings femininity to power dressing without compromise." },
  { id: "6",  name: "Eden Wide",        price: "₦40,000", priceRaw: 40000, image: "/images/gp-eden-wide.png",         category: "solid", badge: "New",        sizes: ["S","M","L","XL","2XL"],            colors: ["#4CAF50"], description: "A lush, botanical green in a generous wide-leg cut. Dress the power of nature." },
  { id: "7",  name: "Solar Statement",  price: "₦38,000", priceRaw: 38000, image: "/images/gp-solar-statement.png",   category: "solid", badge: "New",        sizes: ["XS","S","M","L","XL"],             colors: ["#FFC107"], description: "Bold amber meets structured tailoring. Wear the sun." },
  { id: "8",  name: "Nude Palazzo",     price: "₦44,000", priceRaw: 44000, image: "/images/gp-nude-palazzo.png",      category: "solid",                      sizes: ["S","M","L","XL","2XL"],            colors: ["#d4b896"], description: "The ultimate understated power. Wide palazzo legs in a nude tone that pairs with everything." },
  { id: "9",  name: "Cacao Wide",       price: "₦44,000", priceRaw: 44000, image: "/images/gp-cacao-wide.png",        category: "solid",                      sizes: ["XS","S","M","L","XL"],             colors: ["#3E1C0D"], description: "Deep cacao brown in a wide silhouette. Rich, grounded, and undeniably powerful." },
  { id: "10", name: "Blush Ultra Wide", price: "₦46,000", priceRaw: 46000, image: "/images/gp-blush-ultra-wide.png",  category: "solid", badge: "New",        sizes: ["S","M","L","XL","2XL","3XL"],      colors: ["#E8A0A0"], description: "An ultra-wide silhouette in a soft blush. Maximum volume, maximum intention." },
  { id: "11", name: "Peach Sovereign",  price: "₦42,000", priceRaw: 42000, image: "/images/gp-peach-sovereign.png",   category: "solid",                      sizes: ["XS","S","M","L","XL"],             colors: ["#FFAB76"], description: "Warm peach tones elevated into a sovereign silhouette. Regal from every angle." },
  { id: "12", name: "Lemon Luxe",       price: "₦40,000", priceRaw: 40000, image: "/images/gp-lemon-luxe.png",        category: "solid", badge: "New",        sizes: ["S","M","L","XL","2XL"],            colors: ["#F9F06B"], description: "Sunshine yellow tailored for confidence. The Lemon Luxe is summer power dressing." },
];

export function getProductById(id: string) {
  return CATALOG.find((p) => p.id === id);
}
