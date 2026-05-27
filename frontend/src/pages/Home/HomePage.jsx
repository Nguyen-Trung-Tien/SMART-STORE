import { CreditCard, Headset, RefreshCcw, Truck } from "lucide-react";
import { motion } from "framer-motion";
import { HeroSection } from "@/components/home/HeroSection";
import { CategorySection } from "@/components/home/CategorySection";
import { TrendingProducts } from "@/components/home/TrendingProducts";
import { PromoBanner } from "@/components/home/PromoBanner";
import { NewArrivalSection } from "@/components/home/NewArrivalSection";
import { FeatureSection } from "@/components/home/FeatureSection";
import { Testimonials } from "@/components/home/Testimonials";
import { Newsletter } from "@/components/home/Newsletter";

const categories = [
  {
    name: "Electronics",
    itemCount: 128,
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Fashion",
    itemCount: 96,
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Accessories",
    itemCount: 74,
    image:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Home Living",
    itemCount: 83,
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Sneakers",
    itemCount: 52,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Gadgets",
    itemCount: 67,
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80",
  },
];

const trendingProducts = [
  {
    id: "p1",
    title: "Aero Noise-Canceling Headphones",
    category: "Electronics",
    price: 249,
    originalPrice: 319,
    discount: "-22%",
    rating: 4.9,
    reviewCount: 128,
    isNew: true,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "p2",
    title: "Monarch Leather Weekender",
    category: "Accessories",
    price: 189,
    originalPrice: 240,
    discount: "-18%",
    rating: 4.8,
    reviewCount: 86,
    isNew: false,
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "p3",
    title: "Cloudstep Runner",
    category: "Sneakers",
    price: 164,
    originalPrice: 210,
    discount: "-20%",
    rating: 4.7,
    reviewCount: 204,
    isNew: true,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "p4",
    title: "Luma Desk Lamp",
    category: "Home Living",
    price: 92,
    originalPrice: 120,
    discount: "-15%",
    rating: 4.9,
    reviewCount: 58,
    isNew: false,
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
  },
];

const newArrivals = [
  {
    id: "n1",
    title: "Nova Smart Display",
    category: "Connected Home",
    badge: "Just landed",
    price: 299,
    image:
      "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "n2",
    title: "Studio Knit Set",
    category: "Modern Apparel",
    badge: "Editor pick",
    price: 148,
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "n3",
    title: "Orbit Travel Case",
    category: "Accessories",
    badge: "Travel ready",
    price: 84,
    image:
      "https://images.unsplash.com/photo-1524498250077-390f9e378fc0?auto=format&fit=crop&w=900&q=80",
  },
];

const features = [
  {
    title: "Fast Delivery",
    description: "Reliable fulfillment windows and proactive shipping updates that reduce anxiety after checkout.",
    icon: Truck,
  },
  {
    title: "Secure Payment",
    description: "Trusted payment flows with a clean checkout experience that feels safe on every device.",
    icon: CreditCard,
  },
  {
    title: "Easy Return",
    description: "Flexible returns designed to protect conversion while keeping the post-purchase experience simple.",
    icon: RefreshCcw,
  },
  {
    title: "24/7 Support",
    description: "Always-on support cues that reinforce credibility and help customers move forward with confidence.",
    icon: Headset,
  },
];

const testimonials = [
  {
    name: "Maya Chen",
    role: "Creative Director",
    rating: 5,
    review:
      "The experience feels expensive in the best way. Clean visuals, fast browsing, and product cards that make decisions easy.",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
  },
  {
    name: "Jordan Lewis",
    role: "Product Manager",
    rating: 5,
    review:
      "It hits that rare balance between editorial and conversion-focused. The motion is subtle, polished, and never distracting.",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  },
  {
    name: "Sofia Ramirez",
    role: "Brand Strategist",
    rating: 5,
    review:
      "From hero to footer, every section feels cohesive. It gives premium brand energy while still feeling practical to scale.",
    avatar:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=200&q=80",
  },
];

export default function HomePage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="space-y-16 pb-8 pt-2 md:space-y-24"
    >
      <HeroSection showcaseProducts={[...trendingProducts, ...newArrivals]} />
      <CategorySection categories={categories} />
      <TrendingProducts products={trendingProducts} />
      <PromoBanner />
      <NewArrivalSection items={newArrivals} />
      <FeatureSection features={features} />
      <Testimonials testimonials={testimonials} />
      <Newsletter />
    </motion.div>
  );
}
