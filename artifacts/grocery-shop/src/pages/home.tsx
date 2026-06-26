import { motion } from "framer-motion";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ShoppingCart,
  Search,
  Leaf,
  Clock,
  ShieldCheck,
  Truck,
  Plus,
  Minus,
  ArrowRight,
  Menu,
  Star,
  Check,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useListCategories, useListProducts } from "@workspace/api-client-react";

function Navbar() {
  const { count } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-3" : "bg-white py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between gap-4 md:gap-8">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
          <Link href="/" className="flex items-center gap-2">
            <Leaf className="h-8 w-8 text-primary" />
            <span className="font-serif text-2xl font-bold tracking-tight text-foreground">FreshMart</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6 font-medium text-foreground/80">
          <a href="#categories" className="hover:text-primary transition-colors">Categories</a>
          <a href="#deals" className="hover:text-primary transition-colors">Weekly Deals</a>
          <a href="#organic" className="hover:text-primary transition-colors">Organic</a>
          <a href="#about" className="hover:text-primary transition-colors">Our Farm</a>
        </nav>

        <div className="flex-1 max-w-md hidden lg:flex relative">
          <Input
            type="search"
            placeholder="Search for fresh produce..."
            className="w-full pl-10 pr-4 py-2 rounded-full bg-muted/50 border-transparent focus-visible:bg-white"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="outline" className="hidden sm:flex rounded-full">Log In</Button>
          <Button className="relative rounded-full" size="icon" variant="default" data-testid="button-cart">
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-secondary text-secondary-foreground text-xs font-bold h-5 w-5 rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden min-h-[90vh] flex items-center">
      <div className="absolute inset-0 z-0">
        <img src="/images/hero.png" alt="Fresh produce" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-transparent" />
      </div>
      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6 border border-primary/20">
              Farm to door in 24 hours
            </span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            Taste the <span className="text-primary italic">freshness</span> of real food.
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-lg md:text-xl text-foreground/80 mb-8 max-w-lg leading-relaxed">
            We bring the vibrant, sun-drenched farmers market straight to your kitchen. Organic, locally sourced, and bursting with flavor.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="rounded-full text-base h-14 px-8">
              Shop Fresh Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <a href="#deals">
              <Button size="lg" variant="outline" className="rounded-full text-base h-14 px-8 bg-white/50 backdrop-blur-sm w-full sm:w-auto">
                View Weekly Deals
              </Button>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function TrustSignals() {
  const features = [
    { icon: Truck, title: "Same-Day Delivery", desc: "Order by 2PM, get it today" },
    { icon: ShieldCheck, title: "100% Fresh Guarantee", desc: "Not fresh? We'll refund you" },
    { icon: Leaf, title: "Certified Organic", desc: "Pesticide-free local produce" },
    { icon: Clock, title: "24/7 Support", desc: "We're here when you need us" },
  ];
  return (
    <section className="py-12 bg-white border-b border-muted">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {features.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex flex-col items-center text-center p-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const FALLBACK_CATEGORIES = [
  { id: 1, name: "Fresh Fruits", image: "/images/cat-fruits.png", color: "bg-orange-100" },
  { id: 2, name: "Vegetables", image: "/images/cat-veg.png", color: "bg-green-100" },
  { id: 3, name: "Dairy & Eggs", image: "/images/cat-dairy.png", color: "bg-blue-100" },
  { id: 4, name: "Bakery", image: "/images/cat-bakery.png", color: "bg-amber-100" },
  { id: 5, name: "Premium Meat", image: "/images/cat-meat.png", color: "bg-red-100" },
];

function Categories() {
  const { data: apiCategories, isLoading } = useListCategories();
  const categories = (apiCategories && apiCategories.length > 0) ? apiCategories : FALLBACK_CATEGORIES;

  return (
    <section id="categories" className="py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Shop by Category</h2>
            <p className="text-muted-foreground max-w-xl text-lg">Explore our aisles of carefully curated, premium ingredients.</p>
          </div>
          <Button variant="ghost" className="hidden md:flex font-semibold">
            See all categories <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="aspect-[4/3] rounded-2xl bg-muted animate-pulse" />
              ))
            : categories.map((cat, i) => (
                <motion.div key={cat.id} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="group cursor-pointer" data-testid={`card-category-${cat.id}`}>
                  <div className={`relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 ${cat.color} isolate`}>
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-80" />
                    <h3 className="absolute bottom-4 left-4 text-white font-semibold text-lg z-10">{cat.name}</h3>
                  </div>
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
}

const FALLBACK_PRODUCTS = [
  { id: 1, name: "Hass Avocados", image: "/images/prod-avocado.png", price: "4.99", unit: "per pack of 4", badge: "Organic", rating: "5.0", review_count: 42, in_stock: true, is_organic: true, is_featured: true, category_id: null },
  { id: 2, name: "Artisanal Sourdough", image: "/images/prod-bread.png", price: "6.49", unit: "per loaf", badge: "Fresh Baked", rating: "5.0", review_count: 38, in_stock: true, is_organic: false, is_featured: true, category_id: null },
  { id: 3, name: "Farm Fresh Eggs", image: "/images/prod-eggs.png", price: "5.99", unit: "per dozen", badge: "Local", rating: "5.0", review_count: 57, in_stock: true, is_organic: false, is_featured: true, category_id: null },
  { id: 4, name: "Whole Milk", image: "/images/prod-milk.png", price: "3.49", unit: "per glass bottle", badge: "Grass-fed", rating: "5.0", review_count: 29, in_stock: true, is_organic: false, is_featured: true, category_id: null },
];

function ProductCard({ product }: { product: typeof FALLBACK_PRODUCTS[0] }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem({ id: product.id, name: product.name, image: product.image, price: product.price });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="bg-white rounded-2xl p-4 border border-card-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group" data-testid={`card-product-${product.id}`}>
      <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-muted/30">
        {product.badge && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-primary text-xs font-bold px-2.5 py-1 rounded-full z-10 shadow-sm">
            {product.badge}
          </span>
        )}
        <img src={product.image} alt={product.name} className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-1 text-secondary mb-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-3 w-3 fill-current" />
          ))}
          <span className="text-xs text-muted-foreground ml-1">({product.review_count})</span>
        </div>
        <h3 className="font-semibold text-lg text-foreground mb-1">{product.name}</h3>
        <p className="text-sm text-muted-foreground mb-4">{product.unit}</p>
      </div>
      <div className="flex items-center justify-between mt-auto">
        <div className="font-bold text-xl">${parseFloat(product.price).toFixed(2)}</div>
        <Button
          size="sm"
          className={`rounded-full h-10 w-10 p-0 transition-all ${added ? "bg-green-500 text-white" : ""}`}
          onClick={handleAdd}
          data-testid={`button-add-to-cart-${product.id}`}
        >
          {added ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
        </Button>
      </div>
    </div>
  );
}

function Deals() {
  const { data: apiProducts, isLoading } = useListProducts({ featured: true });
  const products = (apiProducts && apiProducts.length > 0) ? apiProducts : FALLBACK_PRODUCTS;

  return (
    <section id="deals" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Weekly Fresh Deals</h2>
            <p className="text-muted-foreground max-w-xl text-lg">In-season goodness at irresistible prices.</p>
          </div>
          <Button variant="outline" className="hidden md:flex font-semibold rounded-full">View All Deals</Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-80 rounded-2xl bg-muted animate-pulse" />
              ))
            : products.map((prod, i) => (
                <motion.div key={prod.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <ProductCard product={prod as typeof FALLBACK_PRODUCTS[0]} />
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
}

function PromoBanner() {
  const [time, setTime] = useState({ days: 2, hrs: 14, min: 45, sec: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => {
        let { days, hrs, min, sec } = prev;
        sec--;
        if (sec < 0) { sec = 59; min--; }
        if (min < 0) { min = 59; hrs--; }
        if (hrs < 0) { hrs = 23; days--; }
        if (days < 0) return prev;
        return { days, hrs, min, sec };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="bg-primary rounded-3xl overflow-hidden relative shadow-2xl">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
          <div className="grid md:grid-cols-2 items-center">
            <div className="p-8 md:p-16 relative z-10 text-primary-foreground">
              <span className="inline-block bg-secondary text-secondary-foreground text-sm font-bold px-3 py-1 rounded-full mb-6">Limited Time Offer</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 leading-tight">
                Get $20 off your first fresh delivery.
              </h2>
              <p className="text-primary-foreground/80 text-lg mb-8 max-w-md">
                Use code <span className="font-mono bg-black/20 px-2 py-1 rounded font-bold">FRESH20</span> at checkout.
              </p>
              <div className="flex gap-4 mb-8">
                {[
                  { label: "Days", val: String(time.days).padStart(2, "0") },
                  { label: "Hrs", val: String(time.hrs).padStart(2, "0") },
                  { label: "Min", val: String(time.min).padStart(2, "0") },
                  { label: "Sec", val: String(time.sec).padStart(2, "0") },
                ].map((t) => (
                  <div key={t.label} className="flex flex-col items-center bg-black/20 backdrop-blur rounded-xl p-3 min-w-[70px]">
                    <span className="text-2xl font-bold">{t.val}</span>
                    <span className="text-xs uppercase tracking-wider opacity-80">{t.label}</span>
                  </div>
                ))}
              </div>
              <Button size="lg" variant="secondary" className="rounded-full font-bold px-8">Claim Offer Now</Button>
            </div>
            <div className="hidden md:block h-full relative">
              <img
                src="/images/cat-fruits.png"
                alt="Fresh fruits"
                className="absolute inset-0 w-full h-full object-cover object-left"
                style={{ WebkitMaskImage: "linear-gradient(to right, transparent, black 30%)" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Newsletter() {
  return (
    <section className="py-24 bg-[#FAF7F2]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <Leaf className="h-12 w-12 text-primary mx-auto mb-6" />
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Freshness in your inbox</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Subscribe for seasonal recipes, farmer stories, and exclusive subscriber-only deals.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <Input type="email" placeholder="Your email address" className="h-14 rounded-full bg-white border-transparent shadow-sm px-6 text-base" required data-testid="input-newsletter-email" />
            <Button size="lg" type="submit" className="h-14 rounded-full px-8" data-testid="button-newsletter-subscribe">Subscribe</Button>
          </form>
          <p className="text-xs text-muted-foreground mt-4">No spam, just fresh food.</p>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-foreground text-white py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-6">
              <Leaf className="h-8 w-8 text-primary" />
              <span className="font-serif text-2xl font-bold tracking-tight">FreshMart</span>
            </Link>
            <p className="text-white/60 mb-6 leading-relaxed">
              Bringing the vibrant, sun-drenched farmers market straight to your kitchen.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6">Shop</h4>
            <ul className="space-y-4 text-white/60">
              {["Fresh Produce", "Organic Dairy", "Artisanal Bakery", "Premium Meat", "Weekly Deals"].map((item) => (
                <li key={item}><a href="#" className="hover:text-white transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6">Company</h4>
            <ul className="space-y-4 text-white/60">
              {["About Us", "Our Farmers", "Sustainability", "Careers", "Contact"].map((item) => (
                <li key={item}><a href="#" className="hover:text-white transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6">Help</h4>
            <ul className="space-y-4 text-white/60">
              {["FAQ", "Shipping & Returns", "Track Order", "Privacy Policy"].map((item) => (
                <li key={item}><a href="#" className="hover:text-white transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">© {new Date().getFullYear()} FreshMart. All rights reserved.</p>
          <div className="flex gap-4">
            {["f", "in", "x"].map((s) => (
              <div key={s} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors">
                <span className="text-white font-serif font-bold">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <TrustSignals />
        <Categories />
        <Deals />
        <PromoBanner />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
