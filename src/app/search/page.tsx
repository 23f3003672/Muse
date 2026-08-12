"use client";

import { useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import FilterChips from "@/components/ui/FilterChips";
import ProductCard from "@/components/ui/ProductCard";

const products = [
  { id: "1", name: "Antique Peacock Earrings", slug: "antique-peacock-earrings", price: 1299, originalPrice: 1599, badge: "NEW" as const, image: "", category: "Earrings" },
  { id: "2", name: "Lotus Kundan Necklace", slug: "lotus-kundan-necklace", price: 2499, originalPrice: 2899, badge: "BESTSELLER" as const, image: "", category: "Necklaces" },
  { id: "3", name: "Minimal Pearl Studs", slug: "minimal-pearl-studs", price: 899, badge: "NEW" as const, image: "", category: "Earrings" },
  { id: "4", name: "Rose Gold Bangle Set", slug: "rose-gold-bangle-set", price: 1899, originalPrice: 2200, badge: "BESTSELLER" as const, image: "", category: "Bangles" },
  { id: "5", name: "Emerald Drop Ring", slug: "emerald-drop-ring", price: 1099, badge: "NEW" as const, image: "", category: "Rings" },
  { id: "6", name: "Temple Choker", slug: "temple-choker", price: 3499, badge: "BESTSELLER" as const, image: "", category: "Necklaces" },
  { id: "7", name: "Silver Ghungroo Anklet", slug: "silver-ghungroo-anklet", price: 1299, badge: "NEW" as const, image: "", category: "Anklets" },
  { id: "8", name: "Polki Statement Earrings", slug: "polki-statement-earrings", price: 2199, badge: "BESTSELLER" as const, image: "", category: "Earrings" },
];

const categories = ["All", "Earrings", "Necklaces", "Rings", "Bangles", "Anklets"];

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 md:px-8 py-12 md:py-16">
      <PageHeader 
        title="Search" 
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Search", href: "/search" }
        ]} 
      />

      <div className="max-w-2xl mx-auto mb-12 relative">
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for earrings, necklaces, collections..."
          className="w-full border-b border-border bg-transparent py-4 pl-12 pr-24 text-lg text-heading placeholder:text-foreground/40 focus:outline-none focus:border-primary transition-colors"
        />
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
        <button className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-primary text-primary-foreground text-xs font-bold tracking-widest uppercase rounded-full hover:bg-primary-hover transition-colors">
          Search
        </button>
      </div>

      <FilterChips 
        categories={categories} 
        activeCategory={activeCategory} 
        onSelect={setActiveCategory} 
      />

      <div className="flex justify-between items-center py-4 border-b border-border mb-8">
        <span className="text-sm text-foreground/70">Showing {filteredProducts.length} results</span>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 text-foreground/60">
          No products found matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product.id}
              id={product.id}
              name={product.name}
              slug={product.slug}
              price={product.price}
              originalPrice={product.originalPrice}
              image={product.image}
              badge={product.badge}
            />
          ))}
        </div>
      )}
    </div>
  );
}
