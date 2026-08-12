"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, Heart, ShoppingCart, ChevronDown } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useEffect, useState } from "react";
import CartDrawer from "@/components/cart/CartDrawer";
import { createClient } from "@/lib/supabase/client";

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartItems = useCartStore((state) => state.items);
  const [menuData, setMenuData] = useState<any[]>([]);
  
  useEffect(() => {
    setMounted(true);

    const fetchMenu = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('categories')
        .select('*, subcategories(*)')
        .order('display_order', { ascending: true });
        
      if (data) {
        data.forEach(cat => {
          if (cat.subcategories) {
            cat.subcategories.sort((a: any, b: any) => a.display_order - b.display_order);
          }
        });
        setMenuData(data);
      }
    };
    fetchMenu();
  }, []);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image 
            src="/muse-logo.svg" 
            alt="Muse by Kashish Logo" 
            priority
            width={400} 
            height={150} 
            className="w-auto h-16 md:h-24 scale-125 origin-left"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8 h-full">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">Home</Link>
          
          {/* Shop with Mega Menu */}
          <div className="group h-full flex items-center">
            <Link href="/shop" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1 h-full">
              Shop <ChevronDown className="w-4 h-4 opacity-50 group-hover:rotate-180 transition-transform duration-300" />
            </Link>
            
            {/* Mega Menu Full Width Dropdown */}
            <div className="absolute top-20 left-0 w-full bg-surface border-b border-border shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 -translate-y-2 group-hover:translate-y-0 z-50">
              <div className="container mx-auto px-4 md:px-8 py-10">
                <div className="flex flex-wrap gap-12 lg:gap-16">
                  {menuData.map(category => (
                    <div key={category.id} className="space-y-4 min-w-[150px]">
                      <Link href={`/shop/${category.slug}`} className="font-serif text-lg text-heading hover:text-primary transition-colors border-b border-border pb-2 block">
                        {category.name}
                      </Link>
                      <ul className="space-y-2">
                        {category.subcategories?.map((sub: any) => (
                          <li key={sub.id}>
                            <Link href={`/shop/${category.slug}/${sub.slug}`} className="text-sm text-foreground/70 hover:text-primary transition-colors block py-0.5">
                              {sub.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Link href="/collections" className="text-sm font-medium hover:text-primary transition-colors">Collections</Link>
          <Link href="/suits" className="text-sm font-medium hover:text-primary transition-colors">Suits</Link>
          <Link href="/new-arrivals" className="text-sm font-medium hover:text-primary transition-colors">New Arrivals</Link>
          <Link href="/best-sellers" className="text-sm font-medium hover:text-primary transition-colors">Best Sellers</Link>
          <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">About</Link>
          <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">Contact</Link>
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-5">
          <button className="text-foreground hover:text-primary transition-colors" aria-label="Search">
            <Search className="w-5 h-5" />
          </button>
          <Link href="/wishlist" className="text-foreground hover:text-primary transition-colors" aria-label="Wishlist">
            <Heart className="w-5 h-5" />
          </Link>
          <button 
            onClick={() => setIsCartOpen(true)} 
            className="text-foreground hover:text-primary transition-colors relative" 
            aria-label="Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {mounted && cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
}
