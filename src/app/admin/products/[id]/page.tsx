"use client";

import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import ProductForm from "@/components/admin/ProductForm";
import { notFound } from "next/navigation";
import { use } from "react";

export default function AdminEditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchProduct() {
      const { data, error } = await supabase
        .from('products')
        .select('*, product_categories(category_id), product_subcategories(subcategory_id)')
        .eq('id', resolvedParams.id)
        .single();

      if (error || !data) {
        setLoading(false);
        return; // Will just render a not found or empty state
      }

      data.category_ids = data.product_categories?.map((pc: any) => pc.category_id) || [];
      data.subcategory_ids = data.product_subcategories?.map((ps: any) => ps.subcategory_id) || [];

      setProduct(data);
      setLoading(false);
    }
    fetchProduct();
  }, [resolvedParams.id]);

  if (!loading && !product) {
    return (
      <div className="py-12 text-center">
        <h2 className="text-xl font-bold mb-2">Product not found</h2>
        <Link href="/admin/products" className="text-primary hover:underline">
          Return to products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/products"
          className="p-2 text-foreground/50 hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-serif text-3xl text-heading">Edit Product</h1>
          <p className="text-sm text-foreground/70">{loading ? "Loading..." : product?.product_name}</p>
        </div>
      </div>

      {!loading && <ProductForm initialData={product} />}
    </div>
  );
}
