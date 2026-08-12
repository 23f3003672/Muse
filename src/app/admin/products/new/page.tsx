"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ProductForm from "@/components/admin/ProductForm";

export default function AdminNewProductPage() {
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
          <h1 className="font-serif text-3xl text-heading">Add New Product</h1>
          <p className="text-sm text-foreground/70">Create a new product listing in your store.</p>
        </div>
      </div>

      <ProductForm />
    </div>
  );
}
