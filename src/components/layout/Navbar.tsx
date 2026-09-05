"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, Heart, ShoppingCart, ChevronDown, Menu, X } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useEffect, useState } from "react";
import CartDrawer from "@/components/cart/CartDrawer";
import { createClient } from "@/lib/supabase/client";

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
        {/* Mobile Menu Button & Logo */}
        <div className="flex items-center gap-4 lg:gap-0">
          <button 
            className="lg:hidden text-foreground hover:text-primary transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <Link href="/" className="flex-shrink-0">
            <Image 
              src="/muse-logo.svg" 
              alt="Muse by Kashish Logo" 
              priority
              width={400} 
              height={150} 
              className="w-auto h-16 md:h-24 scale-125 origin-left lg:origin-center"
            />
          </Link>
        </div>

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

      {/* Mobile Menu Drawer */}
      <>
        {/* Backdrop */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 lg:hidden transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
        
        {/* Drawer */}
        <div 
          className={`fixed top-0 left-0 h-full w-[85%] sm:w-[350px] bg-background shadow-2xl z-50 lg:hidden transform transition-transform duration-300 ease-in-out flex flex-col ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="font-serif text-2xl text-heading">Menu</h2>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-foreground/70 hover:text-heading transition-colors rounded-full hover:bg-muted">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
            <nav className="flex flex-col gap-4">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="font-serif text-xl text-heading hover:text-primary transition-colors">Home</Link>
              <div className="space-y-4">
                <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} className="font-serif text-xl text-heading hover:text-primary transition-colors">Shop</Link>
                <div className="pl-4 flex flex-col gap-3 border-l border-border ml-2">
                  {menuData.map(category => (
                    <div key={category.id} className="space-y-2">
                      <Link href={`/shop/${category.slug}`} onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-foreground hover:text-primary transition-colors">
                        {category.name}
                      </Link>
                      {category.subcategories && category.subcategories.length > 0 && (
                        <ul className="pl-3 flex flex-col gap-2 border-l border-border/50 ml-1 mt-2">
                          {category.subcategories.map((sub: any) => (
                            <li key={sub.id}>
                              <Link href={`/shop/${category.slug}/${sub.slug}`} onClick={() => setIsMobileMenuOpen(false)} className="text-sm text-foreground/70 hover:text-primary transition-colors">
                                {sub.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <Link href="/collections" onClick={() => setIsMobileMenuOpen(false)} className="font-serif text-xl text-heading hover:text-primary transition-colors">Collections</Link>
              <Link href="/suits" onClick={() => setIsMobileMenuOpen(false)} className="font-serif text-xl text-heading hover:text-primary transition-colors">Suits</Link>
              <Link href="/new-arrivals" onClick={() => setIsMobileMenuOpen(false)} className="font-serif text-xl text-heading hover:text-primary transition-colors">New Arrivals</Link>
              <Link href="/best-sellers" onClick={() => setIsMobileMenuOpen(false)} className="font-serif text-xl text-heading hover:text-primary transition-colors">Best Sellers</Link>
              <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="font-serif text-xl text-heading hover:text-primary transition-colors">About</Link>
              <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="font-serif text-xl text-heading hover:text-primary transition-colors">Contact</Link>
            </nav>
          </div>
        </div>
      </>
    </header>
  );
}
