"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import Image from "next/image";
import { Plus, Edit, Trash2, Search, MoreVertical, Scissors } from "lucide-react";
import toast from "@/lib/toast";

export default function AdminSuitsPage() {
  const [suits, setSuits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingStockId, setUpdatingStockId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchSuits();
  }, []);

  const fetchSuits = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('id, product_name, sku, price, stock_quantity, availability, cover_image')
      .eq('product_type', 'suit')
      .order('created_at', { ascending: false });
      
    if (data) {
      setSuits(data);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this suit?")) {
      await supabase.from('products').delete().eq('id', id);
      fetchSuits();
    }
  };

  const handleToggleStock = async (id: string, currentStock: number) => {
    const newStock = (currentStock ?? 0) > 0 ? 0 : 1;
    setUpdatingStockId(id);
    const { error } = await supabase
      .from('products')
      .update({ stock_quantity: newStock })
      .eq('id', id);

    setUpdatingStockId(null);
    if (error) {
      toast.error("Failed to update stock: " + error.message);
    } else {
      toast.success(
        newStock === 0 
          ? "Marked as Out of Stock / Sold Out!" 
          : "Marked as In Stock!"
      );
      setSuits(prev => prev.map(s => s.id === id ? { ...s, stock_quantity: newStock } : s));
    }
  };

  const filteredSuits = suits.filter(s => 
    s.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl text-heading mb-1">Suits</h1>
          <p className="text-sm text-foreground/70">Manage your suits inventory.</p>
        </div>
        <Link 
          href="/admin/suits/new" 
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-xs font-bold tracking-wider rounded-full hover:bg-primary-hover transition-colors uppercase shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Suit
        </Link>
      </div>

      <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-border flex justify-between items-center bg-background/50">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
            <input 
              type="text" 
              placeholder="Search by name or SKU..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-surface border border-border rounded-md focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-border text-xs uppercase tracking-widest text-foreground/60 font-semibold">
                <th className="px-6 py-4">Suit Name</th>
                <th className="px-6 py-4">SKU</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sm text-foreground/50">
                    Loading suits...
                  </td>
                </tr>
              ) : filteredSuits.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-foreground/50">
                      <Scissors className="w-12 h-12 mb-3 stroke-[1]" />
                      <p>No suits found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredSuits.map((suit) => (
                  <tr key={suit.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-md overflow-hidden bg-muted border border-border shrink-0">
                          {suit.cover_image ? (
                            <Image 
                              src={suit.cover_image} 
                              alt={suit.product_name} 
                              fill 
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Scissors className="w-4 h-4 text-foreground/40 stroke-[1.5]" />
                            </div>
                          )}
                        </div>
                        <span className="font-medium text-heading">{suit.product_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground/70">{suit.sku}</td>
                    <td className="px-6 py-4 text-sm font-medium">₹{suit.price.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5 items-start">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide ${
                          (suit.stock_quantity ?? 0) > 0
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            (suit.stock_quantity ?? 0) > 0 ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}></span>
                          {(suit.stock_quantity ?? 0) > 0 ? `In Stock (${suit.stock_quantity})` : 'Sold Out (0)'}
                        </span>

                        <button
                          type="button"
                          disabled={updatingStockId === suit.id}
                          onClick={() => handleToggleStock(suit.id, suit.stock_quantity)}
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border transition-all ${
                            (suit.stock_quantity ?? 0) > 0
                              ? 'border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300'
                              : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300'
                          } disabled:opacity-50`}
                          title={(suit.stock_quantity ?? 0) > 0 ? "Mark Out of Stock (0)" : "Mark In Stock (1)"}
                        >
                          {updatingStockId === suit.id
                            ? "Updating..."
                            : (suit.stock_quantity ?? 0) > 0
                            ? "Mark Sold Out"
                            : "Mark In Stock"}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        suit.availability 
                          ? 'bg-green-100 text-green-700 border border-green-200' 
                          : 'bg-red-100 text-red-700 border border-red-200'
                      }`}>
                        {suit.availability ? 'Active' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/admin/suits/${suit.id}`}
                          className="p-2 text-foreground/50 hover:text-primary transition-colors rounded-md hover:bg-primary/10"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(suit.id)}
                          className="p-2 text-foreground/50 hover:text-red-600 transition-colors rounded-md hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
