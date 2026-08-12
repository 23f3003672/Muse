"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, Plus, Minus, MessageCircle, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";

export default function ProductDetailClient({ product }: { product: any }) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]?.options[0] || "Standard");
  const [quantity, setQuantity] = useState(1);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(product.images[0] || "");
  
  const cartStore = useCartStore();

  const handleAddToCart = () => {
    cartStore.addItem({
      id: `${product.id}-${selectedVariant}`,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      quantity,
      coverImage: product.images[0] || "",
      variant: { type: product.variants[0]?.type || "Variant", value: selectedVariant }
    });
  };

  const handleWhatsAppOrder = () => {
    handleAddToCart();
    const message = `Hello, I'd like to order:\n1x ${product.name} (${selectedVariant})\nPrice: ₹${product.price}\nLink: https://musebykashish.com/product/${product.slug}`;
    window.open(`https://wa.me/919897110086?text=${encodeURIComponent(message)}`, '_blank');
  };

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
        {/* Left: Image Gallery */}
        <div className="flex flex-col-reverse md:flex-row gap-4">
          <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto hide-scrollbar w-full md:w-20 lg:w-24 shrink-0">
            {product.images.map((img: string, idx: number) => (
              <button 
                key={idx} 
                onClick={() => setSelectedImage(img)}
                className={`aspect-[4/5] w-20 md:w-full bg-muted rounded-sm shrink-0 border transition-colors focus:outline-none relative overflow-hidden ${selectedImage === img ? 'border-primary' : 'border-transparent hover:border-primary/50'}`}
              >
                {img ? (
                  <Image src={img} alt={`${product.name} thumbnail ${idx + 1}`} fill sizes="96px" className="object-cover" />
                ) : (
                  <span className="text-[8px] text-foreground/40 font-serif flex items-center justify-center w-full h-full">Img {idx+1}</span>
                )}
              </button>
            ))}
          </div>
          <div className="flex-1 aspect-[4/5] bg-muted rounded-md relative flex items-center justify-center overflow-hidden">
             {selectedImage ? (
               <Image src={selectedImage} alt={product.name} fill priority sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
             ) : (
               <span className="text-muted-foreground/50 font-serif text-lg tracking-widest">Main Image</span>
             )}
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="flex flex-col pt-2">
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

          {/* Variant Selection */}
          {product.variants[0] && (
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
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <div className="flex items-center border border-border rounded-full h-12">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-5 h-full text-foreground hover:text-primary transition-colors">
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-sm font-medium w-6 text-center">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="px-5 h-full text-foreground hover:text-primary transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            <button 
              onClick={handleAddToCart}
              className="flex-1 h-12 bg-primary text-primary-foreground text-xs font-bold tracking-wider rounded-full hover:bg-primary-hover transition-colors uppercase"
            >
              Add to Cart
            </button>
          </div>

          <button 
            onClick={handleWhatsAppOrder}
            className="w-full h-12 bg-[#25D366] text-white text-xs font-bold tracking-wider rounded-full hover:bg-[#128C7E] transition-colors uppercase flex items-center justify-center gap-2 mb-12"
          >
            <MessageCircle className="w-4 h-4" />
            Order on WhatsApp
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
