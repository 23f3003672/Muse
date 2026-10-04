"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Star, 
  Plus, 
  Minus, 
  MessageCircle, 
  ChevronDown, 
  ChevronUp, 
  Heart,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import toast from "@/lib/toast";

export default function ProductDetailClient({ product }: { product: any }) {
  const isSoldOut = product.inStock === false || (product.stockQuantity !== undefined && product.stockQuantity <= 0);
  const [mounted, setMounted] = useState(false);
  const hasVariants = Boolean(product.variants && product.variants.length > 0 && product.variants[0]?.options?.length > 0);
  const [selectedVariant, setSelectedVariant] = useState(hasVariants ? product.variants[0]?.options[0] : "");
  const [quantity, setQuantity] = useState(1);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  
  // Multiple images handling
  const images: string[] = Array.isArray(product.images) && product.images.length > 0 
    ? product.images.filter(Boolean) 
    : [""];
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const cartStore = useCartStore();
  const wishlistStore = useWishlistStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isWishlisted = mounted ? wishlistStore.isInWishlist(product.id) : false;

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const handleAddToCart = () => {
    if (isSoldOut) {
      toast.error("This piece is currently sold out.");
      return;
    }
    cartStore.addItem({
      id: selectedVariant ? `${product.id}-${selectedVariant}` : product.id,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      quantity,
      coverImage: images[0] || "",
      variant: selectedVariant && product.variants?.[0] ? { type: product.variants[0].type || "Variant", value: selectedVariant } : undefined
    });
    toast.cart({
      name: product.name,
      image: images[0] || "",
      message: "Added to Cart"
    });
  };

  const handleToggleWishlist = () => {
    if (isWishlisted) {
      wishlistStore.removeItem(product.id);
      toast.wishlist({
        name: product.name,
        action: "removed",
        image: images[0] || ""
      });
    } else {
      wishlistStore.addItem({
        id: product.id,
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        originalPrice: product.originalPrice,
        image: images[0] || "",
        inStock: !isSoldOut,
        stockQuantity: product.stockQuantity
      });
      toast.wishlist({
        name: product.name,
        action: "added",
        image: images[0] || ""
      });
    }
  };

  const handleWhatsAppOrder = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.musebykashish.in';
    const variantNote = selectedVariant ? ` (${selectedVariant})` : '';

    if (isSoldOut) {
      const message = `Hello muse by Kashish! I saw this piece on your website: "${product.name}"${variantNote}, but noticed it is currently sold out.\n\nCould you please let me know if it can be custom made or when it will be back in stock?\n\nLink: ${origin}/product/${product.slug}`;
      window.open(`https://wa.me/919897110086?text=${encodeURIComponent(message)}`, '_blank');
      return;
    }

    handleAddToCart();
    const message = `Hello, I'd like to order:\n${quantity}x ${product.name}${variantNote}\nPrice: ₹${product.price}\nLink: ${origin}/product/${product.slug}`;
    window.open(`https://wa.me/919897110086?text=${encodeURIComponent(message)}`, '_blank');
  };

  const currentImage = images[activeImageIndex] || images[0] || "";

  return (
    <>
      <nav className="flex items-center gap-2 text-xs text-foreground/60 mb-8 font-medium uppercase tracking-wider">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span className="text-border mx-1">/</span>
        <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
        <span className="text-border mx-1">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 mb-24">
        {/* Left: Image Gallery & Slider */}
        <div className="flex flex-col-reverse md:flex-row gap-4">
          {/* Thumbnails strip (visible if 2 or more images) */}
          {images.length > 1 && (
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto hide-scrollbar w-full md:w-20 lg:w-24 shrink-0">
              {images.map((img: string, idx: number) => (
                <button 
                  key={idx} 
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`aspect-[4/5] w-20 md:w-full bg-muted rounded-md shrink-0 border-2 transition-all focus:outline-none relative overflow-hidden ${
                    activeImageIndex === idx 
                      ? 'border-primary ring-2 ring-primary/20 scale-[1.02]' 
                      : 'border-transparent opacity-70 hover:opacity-100 hover:border-primary/50'
                  }`}
                  aria-label={`View product image ${idx + 1}`}
                >
                  {img ? (
                    <Image src={img} alt={`${product.name} thumbnail ${idx + 1}`} fill sizes="96px" className="object-cover" />
                  ) : (
                    <span className="text-[8px] text-foreground/40 font-serif flex items-center justify-center w-full h-full">View {idx+1}</span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Main Image with Manual Slider Controls */}
          <div className="flex-1 aspect-[4/5] bg-muted rounded-xl relative flex items-center justify-center overflow-hidden group border border-border/40 shadow-sm">
            {isSoldOut && (
              <div className="absolute top-4 left-4 z-20 pointer-events-none">
                <span className="px-3.5 py-1.5 bg-[#1a1614]/90 text-[#f8f5f2] border border-white/20 backdrop-blur-md text-[11px] font-medium tracking-[0.2em] uppercase rounded-full shadow-lg">
                  Sold Out
                </span>
              </div>
            )}
            {currentImage ? (
              <Image 
                src={currentImage} 
                alt={`${product.name} - View ${activeImageIndex + 1}`} 
                fill 
                priority 
                sizes="(max-width: 768px) 100vw, 50vw" 
                className={`object-cover transition-opacity duration-300 ${isSoldOut ? "opacity-90" : ""}`} 
              />
            ) : (
              <span className="text-muted-foreground/50 font-serif text-lg tracking-widest">Main Image</span>
            )}

            {/* Slider Navigation Buttons (Manual, non-automatic) */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 hover:bg-white text-heading shadow-lg backdrop-blur-sm flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 border border-black/5 z-10"
                  aria-label="Previous product image"
                >
                  <ChevronLeft className="w-5 h-5 text-heading" />
                </button>

                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 hover:bg-white text-heading shadow-lg backdrop-blur-sm flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 border border-black/5 z-10"
                  aria-label="Next product image"
                >
                  <ChevronRight className="w-5 h-5 text-heading" />
                </button>

                {/* Slider Position Badge / Dots */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 z-10">
                  {images.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      type="button"
                      onClick={() => setActiveImageIndex(dotIdx)}
                      className={`h-1.5 rounded-full transition-all ${
                        activeImageIndex === dotIdx ? 'w-4 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70'
                      }`}
                      aria-label={`Go to slide ${dotIdx + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="flex flex-col pt-2">
          {/* Stock Status Badge */}
          <div className="flex items-center gap-2.5 mb-2">
            {isSoldOut ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-[#1a1614] text-[#f8f5f2] border border-black/10 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                Sold Out
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium tracking-wide bg-emerald-50 text-emerald-800 border border-emerald-200/70">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                In Stock
              </span>
            )}
            {isSoldOut ? (
              <span className="text-xs text-foreground/60 font-serif italic">This design has found a home</span>
            ) : product.stockQuantity && product.stockQuantity <= 5 ? (
              <span className="text-xs text-[#c87355] font-medium">Only {product.stockQuantity} remaining</span>
            ) : null}
          </div>

          <h1 className="font-serif text-3xl md:text-4xl text-heading mb-4">{product.name}</h1>
          
          <div className="flex items-end gap-4 mb-4">
            <span className="text-2xl font-medium text-foreground">₹{product.price.toLocaleString('en-IN')}</span>
            {product.originalPrice && (
              <span className="text-foreground/50 line-through text-sm mb-1">₹{product.originalPrice.toLocaleString('en-IN')}</span>
            )}
          </div>
          
          <div className="flex items-center gap-2 mb-8">
            <div className="flex text-primary">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <span className="text-xs text-foreground/70">{product.rating} ({product.reviews} reviews)</span>
          </div>

          <p className="text-sm text-foreground/80 leading-relaxed mb-8">
            {product.description}
          </p>

          {/* Variant Selection (hidden if no variants) */}
          {hasVariants && (
            <div className="mb-8">
              <p className="text-xs font-bold tracking-widest uppercase text-heading mb-3">{product.variants[0].type}: <span className="font-normal text-foreground/70 ml-1">{selectedVariant}</span></p>
              <div className="flex flex-wrap gap-3">
                {product.variants[0].options.map((opt: string) => (
                  <button
                    key={opt}
                    onClick={() => setSelectedVariant(opt)}
                    className={`px-5 py-2 rounded-full text-xs font-medium transition-colors border ${
                      selectedVariant === opt
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border text-foreground hover:border-primary/50"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity and Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className={`flex items-center border border-border rounded-full h-12 ${isSoldOut ? "opacity-40 cursor-not-allowed bg-muted/40" : ""}`}>
              <button 
                disabled={isSoldOut}
                onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                className="px-5 h-full text-foreground hover:text-primary transition-colors disabled:cursor-not-allowed"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-sm font-medium w-6 text-center">{isSoldOut ? 0 : quantity}</span>
              <button 
                disabled={isSoldOut}
                onClick={() => setQuantity(quantity + 1)} 
                className="px-5 h-full text-foreground hover:text-primary transition-colors disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            {isSoldOut ? (
              <button 
                type="button"
                disabled
                aria-disabled="true"
                className="flex-1 h-12 bg-muted/70 text-foreground/45 border border-border/80 text-xs font-bold tracking-wider rounded-full cursor-not-allowed uppercase select-none flex items-center justify-center gap-2"
              >
                Sold Out
              </button>
            ) : (
              <button 
                onClick={handleAddToCart}
                className="flex-1 h-12 bg-primary text-primary-foreground text-xs font-bold tracking-wider rounded-full hover:bg-primary-hover transition-colors uppercase shadow-sm"
              >
                Add to Cart
              </button>
            )}

            <button
              type="button"
              onClick={handleToggleWishlist}
              className={`h-12 w-12 rounded-full border border-border flex items-center justify-center transition-colors shrink-0 ${
                isWishlisted 
                  ? "border-primary bg-primary/10 text-primary" 
                  : "text-foreground hover:border-primary hover:text-primary"
              }`}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
            </button>
          </div>

          {/* Sold Out Luxury Restock Helper */}
          {isSoldOut && (
            <div className="mb-4 p-4 rounded-xl bg-[#eee7e1]/60 border border-border/70 flex flex-col gap-1 text-left">
              <span className="font-serif text-heading text-xs sm:text-sm font-medium">Piece Currently Unavailable</span>
              <p className="text-xs text-foreground/75 leading-relaxed">
                Each muse by Kashish design is produced in exclusive batches. While this piece has sold out, tap below to request a custom remake or discuss similar designs on WhatsApp.
              </p>
            </div>
          )}

          <button 
            onClick={handleWhatsAppOrder}
            className={`w-full h-12 text-xs font-bold tracking-wider rounded-full transition-colors uppercase flex items-center justify-center gap-2 mb-12 shadow-sm ${
              isSoldOut 
                ? "bg-[#5f3f33] hover:bg-[#4a3026] text-white" 
                : "bg-[#25D366] hover:bg-[#128C7E] text-white"
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            {isSoldOut ? "Enquire / Request Restock on WhatsApp" : "Order on WhatsApp"}
          </button>

          {/* Accordions */}
          <div className="border-t border-border">
            <div className="border-b border-border">
              <button 
                onClick={() => setExpandedSection(expandedSection === 'material' ? null : 'material')}
                className="w-full py-4 flex justify-between items-center text-sm font-medium text-heading"
              >
                Material & Dimensions
                {expandedSection === 'material' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {expandedSection === 'material' && (
                <div className="pb-4 text-sm text-foreground/70 leading-relaxed">
                  {product.material}
                  <br /><br />
                  SKU: {product.id}
                </div>
              )}
            </div>
            <div className="border-b border-border">
              <button 
                onClick={() => setExpandedSection(expandedSection === 'care' ? null : 'care')}
                className="w-full py-4 flex justify-between items-center text-sm font-medium text-heading"
              >
                Care Instructions
                {expandedSection === 'care' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {expandedSection === 'care' && (
                <div className="pb-4 text-sm text-foreground/70 leading-relaxed">
                  {product.care}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
