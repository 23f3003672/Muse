"use client";

import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ProductForm from "@/components/admin/ProductForm";
import { createClient } from "@/lib/supabase/client";

export default function AdminEditSuitPage({ params }: { params: { id: string } }) {
  const [initialData, setInitialData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchSuit() {
      const { data, error } = await supabase
        .from('products')
        .select('*, product_categories(category_id), product_subcategories(subcategory_id)')
        .eq('id', params.id)
        .single();

      if (data) {
        // Transform relational data for the form
        data.category_ids = data.product_categories?.map((pc: any) => pc.category_id) || [];
        data.subcategory_ids = data.product_subcategories?.map((ps: any) => ps.subcategory_id) || [];
        setInitialData(data);
      }
      setLoading(false);
    }
    fetchSuit();
  }, [params.id, supabase]);

  if (loading) {
    return <div className="p-8 text-center text-foreground/50 animate-pulse">Loading suit details...</div>;
  }

  if (!initialData) {
    return <div className="p-8 text-center text-red-500">Suit not found.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/suits"
          className="p-2 text-foreground/50 hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-serif text-3xl text-heading">Edit Suit</h1>
          <p className="text-sm text-foreground/70">Update details for {initialData.product_name}</p>
        </div>
      </div>

      <ProductForm initialData={initialData} productType="suit" />
    </div>
  );
}
