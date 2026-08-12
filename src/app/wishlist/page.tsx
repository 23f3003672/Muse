"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";
import PageHeader from "@/components/ui/PageHeader";
import ProductCard from "@/components/ui/ProductCard";

export default function WishlistPage() {
  const [mounted, setMounted] = useState(false);
  const wishlistItems = useWishlistStore((state) => state.items);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="container mx-auto px-4 md:px-8 py-12 md:py-16 min-h-[70vh] flex flex-col">
      <PageHeader 
        title="Your wishlist" 
        subtitle="Saved pieces, kept close for whenever you're ready."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Wishlist", href: "/wishlist" }
        ]} 
      />

      {wishlistItems.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto text-center mt-12">
          <Heart className="w-12 h-12 stroke-[1] text-foreground/40 mb-6" />
          <h3 className="font-serif text-2xl text-heading mb-2">No saved pieces yet</h3>
          <p className="text-sm text-foreground/70 mb-8">Tap the heart on any product to keep it here.</p>
          <Link 
            href="/shop"
            className="px-8 py-3.5 bg-primary text-primary-foreground text-xs font-bold tracking-wider rounded-full hover:bg-primary-hover transition-colors uppercase"
          >
            Browse Jewelry
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 mt-8">
          {wishlistItems.map((product) => (
            <ProductCard 
              key={product.id}
              id={product.id}
              name={product.name}
              slug={product.slug}
              price={product.price}
              originalPrice={product.originalPrice}
              image={product.image}
            />
          ))}
        </div>
      )}
    </div>
  );
}
