"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ProductForm from "@/components/admin/ProductForm";

export default function AdminNewSuitPage() {
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
          <h1 className="font-serif text-3xl text-heading">Add New Suit</h1>
          <p className="text-sm text-foreground/70">Create a new suit listing in your store.</p>
        </div>
      </div>

      <ProductForm productType="suit" />
    </div>
  );
}
