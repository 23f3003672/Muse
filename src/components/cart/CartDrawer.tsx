"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, ShoppingBag, Plus, Minus, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const [mounted, setMounted] = useState(false);
  const cartStore = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle WhatsApp Checkout
  const handleCheckout = () => {
    let message = "Hello muse by Kashish,\n\nI would like to place an order.\n\nProducts:\n";
    
    cartStore.items.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n`;
      message += `SKU: ${item.id}\n`;
      if (item.variant) {
        message += `Variant: ${item.variant.value}\n`;
      }
      message += `Quantity: ${item.quantity}\n`;
      message += `Price: ₹${item.price.toLocaleString('en-IN')}\n`;
      message += `Link: https://musebykashish.com/product/${item.slug}\n\n`;
    });

    message += `Cart Total: ₹${cartStore.getCartTotal().toLocaleString('en-IN')}\n\n`;
    message += "Please confirm availability and share the payment details. Thank you.";

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/919897110086?text=${encodedMessage}`, '_blank');
  };

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-background shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-serif text-2xl text-heading">Cart</h2>
          <button onClick={onClose} className="p-2 text-foreground/70 hover:text-heading transition-colors rounded-full hover:bg-muted">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col">
          {cartStore.items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 text-foreground/60">
              <ShoppingBag className="w-12 h-12 stroke-[1]" />
              <p className="text-sm">Your cart is empty</p>
              <button onClick={onClose} className="mt-4 px-8 py-2 border border-border text-xs uppercase tracking-wider rounded-full hover:border-primary hover:text-primary transition-colors text-heading">
                Keep shopping
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {cartStore.items.map((item) => (
                <div key={item.id} className="flex gap-4 border-b border-border/50 pb-6 last:border-0 last:pb-0">
                  <div className="w-20 h-24 bg-muted rounded-sm flex items-center justify-center text-[10px] text-muted-foreground shrink-0 overflow-hidden relative">
                     {/* Image Placeholder */}
                     <span className="opacity-50 font-serif">Img</span>
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <Link href={`/product/${item.slug}`} onClick={onClose} className="font-serif text-lg text-heading leading-tight hover:text-primary transition-colors">
                          {item.name}
                        </Link>
                        <button onClick={() => cartStore.removeItem(item.id)} className="text-foreground/40 hover:text-destructive transition-colors p-1 -mr-1">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      {item.variant && (
                        <p className="text-xs text-foreground/70 mt-1">{item.variant.type}: {item.variant.value}</p>
                      )}
                      <p className="text-sm font-medium text-foreground mt-2">₹{item.price.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center border border-border rounded-full overflow-hidden">
                        <button onClick={() => cartStore.updateQuantity(item.id, item.quantity - 1)} className="p-1.5 px-3 text-foreground/70 hover:bg-muted hover:text-heading transition-colors">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-medium w-4 text-center">{item.quantity}</span>
                        <button onClick={() => cartStore.updateQuantity(item.id, item.quantity + 1)} className="p-1.5 px-3 text-foreground/70 hover:bg-muted hover:text-heading transition-colors">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartStore.items.length > 0 && (
          <div className="p-6 border-t border-border bg-surface">
            <div className="flex justify-between items-center mb-6">
              <span className="font-serif text-lg text-heading">Subtotal</span>
              <span className="font-serif text-xl font-medium text-heading">₹{cartStore.getCartTotal().toLocaleString('en-IN')}</span>
            </div>
            <p className="text-xs text-foreground/60 mb-6 text-center">Shipping & taxes calculated at checkout</p>
            <button 
              onClick={handleCheckout}
              className="w-full py-4 bg-[#25D366] text-white text-xs font-bold tracking-wider rounded-full hover:bg-[#128C7E] transition-colors uppercase flex items-center justify-center gap-2"
            >
              Order on WhatsApp
            </button>
          </div>
        )}
      </div>
    </>
  );
}
