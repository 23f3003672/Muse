"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import toast from "@/lib/toast";

interface ProductFormProps {
  initialData?: any;
  productType?: 'jewelry' | 'suit';
}

export default function ProductForm({ initialData, productType = 'jewelry' }: ProductFormProps) {
  const router = useRouter();
  const supabase = createClient();
  
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    product_name: "",
    slug: "",
    sku: "",
    price: 0,
    discount_price: 0,
    stock_quantity: 0,
    availability: true,
    new_arrival: false,
    best_seller: false,
    description: "",
    material: "",
    care_instructions: "",
    category_ids: [] as string[],
    subcategory_ids: [] as string[],
    collection_id: "",
    cover_image: "",
    product_type: productType
  });

  const [imageFile, setImageFile] = useState<Blob | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchSubcategories() {
      if (formData.category_ids.length > 0) {
        const { data } = await supabase.from('subcategories').select('id, name').in('category_id', formData.category_ids);
        if (data) {
          setSubcategories(data);
          // Clean up any selected subcategories that don't belong to the newly selected categories
          const validSubIds = data.map(s => s.id);
          setFormData(prev => ({
            ...prev,
            subcategory_ids: prev.subcategory_ids.filter(id => validSubIds.includes(id))
          }));
        }
      } else {
        setSubcategories([]);
        setFormData(prev => ({ ...prev, subcategory_ids: [] }));
      }
    }
    fetchSubcategories();
  }, [formData.category_ids.join(','), supabase]);

  useEffect(() => {
    async function fetchData() {
      const [catsRes, colsRes] = await Promise.all([
        supabase.from('categories').select('id, name'),
        supabase.from('collections').select('id, name')
      ]);

      if (catsRes.data) setCategories(catsRes.data);
      if (colsRes.data) setCollections(colsRes.data);
      
      if (initialData) {
        setFormData({
          product_name: initialData.product_name || "",
          slug: initialData.slug || "",
          sku: initialData.sku || "",
          price: initialData.price || 0,
          discount_price: initialData.discount_price || 0,
          stock_quantity: initialData.stock_quantity || 0,
          availability: initialData.availability ?? true,
          new_arrival: initialData.new_arrival || false,
          best_seller: initialData.best_seller || false,
          description: initialData.description || "",
          material: initialData.material || "",
          care_instructions: initialData.care_instructions || "",
          category_ids: initialData.category_ids || [],
          subcategory_ids: initialData.subcategory_ids || [],
          collection_id: initialData.collection_id || "",
          cover_image: initialData.cover_image || "",
          product_type: initialData.product_type || productType
        });
      }
      setLoading(false);
    }
    fetchData();
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (name === 'product_name' && !initialData) {
      setFormData(prev => ({ 
        ...prev, 
        product_name: value,
        slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      }));
    }
  };

  const handleCategoryToggle = (id: string) => {
    setFormData(prev => {
      const newIds = prev.category_ids.includes(id) 
        ? prev.category_ids.filter(c => c !== id) 
        : [...prev.category_ids, id];
      return { ...prev, category_ids: newIds };
    });
  };

  const handleSubcategoryToggle = (id: string) => {
    setFormData(prev => {
      const newIds = prev.subcategory_ids.includes(id) 
        ? prev.subcategory_ids.filter(c => c !== id) 
        : [...prev.subcategory_ids, id];
      return { ...prev, subcategory_ids: newIds };
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                setImageFile(blob);
                setImagePreview(URL.createObjectURL(blob));
              }
            },
            "image/webp",
            0.8
          );
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Clean up empty foreign keys
    const submitData = { ...formData };
    const categoryIds = submitData.category_ids;
    const subcategoryIds = submitData.subcategory_ids;
    delete (submitData as any).category_ids;
    delete (submitData as any).subcategory_ids;

    if (!submitData.collection_id) delete (submitData as any).collection_id;
    if (!submitData.discount_price) delete (submitData as any).discount_price;

    if (imageFile) {
      const fileName = `${Date.now()}-${formData.slug || 'product'}.webp`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product-images-muse')
        .upload(fileName, imageFile, {
          contentType: 'image/webp',
          upsert: false
        });
        
      if (uploadError) {
        console.error(uploadError);
        toast.error("Error uploading image: " + uploadError.message);
        setIsSaving(false);
        return;
      }
      
      const { data: publicUrlData } = supabase.storage
        .from('product-images-muse')
        .getPublicUrl(fileName);
        
      submitData.cover_image = publicUrlData.publicUrl;
    }

    let productId = initialData?.id;

    if (initialData?.id) {
      const { error } = await supabase.from('products').update(submitData).eq('id', initialData.id);
      if (error) {
        console.error(error);
        toast.error("Error saving product: " + error.message);
        setIsSaving(false);
        return;
      }
      toast.success("Product updated successfully!");
    } else {
      const { data, error } = await supabase.from('products').insert([submitData]).select('id').single();
      if (error) {
        console.error(error);
        toast.error("Error creating product: " + error.message);
        setIsSaving(false);
        return;
      }
      productId = data.id;
      toast.success("Product created successfully!");
    }

    // Now update junction tables
    if (productId) {
      // 1. Delete existing associations
      await supabase.from('product_categories').delete().eq('product_id', productId);
      await supabase.from('product_subcategories').delete().eq('product_id', productId);
      
      // 2. Insert new associations
      if (categoryIds.length > 0) {
        await supabase.from('product_categories').insert(
          categoryIds.map(cid => ({ product_id: productId, category_id: cid }))
        );
      }
      if (subcategoryIds.length > 0) {
        await supabase.from('product_subcategories').insert(
          subcategoryIds.map(sid => ({ product_id: productId, subcategory_id: sid }))
        );
      }
    }

    if (productType === 'suit') {
      router.push('/admin/suits');
    } else {
      router.push('/admin/products');
    }
    setIsSaving(false);
  };

  if (loading) {
    return <div className="p-8 text-center text-foreground/50 animate-pulse">Loading form data...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-surface border border-border p-6 rounded-xl shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Basic Info */}
        <div className="space-y-4 md:col-span-2">
          <h3 className="font-serif text-xl border-b border-border pb-2">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-heading uppercase tracking-wider mb-2">Product Name</label>
              <input required name="product_name" value={formData.product_name} onChange={handleChange} className="w-full px-4 py-2 bg-background border border-border rounded-md" />
            </div>
            <div>
              <label className="block text-xs font-bold text-heading uppercase tracking-wider mb-2">Slug</label>
              <input required name="slug" value={formData.slug} onChange={handleChange} className="w-full px-4 py-2 bg-background border border-border rounded-md" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-heading uppercase tracking-wider mb-2">Description</label>
            <textarea name="description" rows={4} value={formData.description} onChange={handleChange} className="w-full px-4 py-2 bg-background border border-border rounded-md" />
          </div>

          <div>
            <label className="block text-xs font-bold text-heading uppercase tracking-wider mb-2">Product Image</label>
            <div className="flex items-center gap-4">
              {imagePreview ? (
                <div className="relative w-24 h-24 rounded-md overflow-hidden bg-muted border border-border">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              ) : formData.cover_image ? (
                <div className="relative w-24 h-24 rounded-md overflow-hidden bg-muted border border-border">
                  <img src={formData.cover_image} alt="Current" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-md bg-muted border border-border flex items-center justify-center text-xs text-foreground/50">
                  No Image
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                ref={fileInputRef}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 border border-border rounded-md text-sm font-medium hover:bg-muted transition-colors"
              >
                {imagePreview || formData.cover_image ? "Change Image" : "Upload Image"}
              </button>
            </div>
            <p className="text-[10px] text-foreground/50 mt-1">Image will automatically be converted to WebP format before upload.</p>
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="space-y-4">
          <h3 className="font-serif text-xl border-b border-border pb-2">Pricing & Inventory</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-heading uppercase tracking-wider mb-2">Price (₹)</label>
              <input required type="number" name="price" value={formData.price} onChange={handleChange} className="w-full px-4 py-2 bg-background border border-border rounded-md" />
            </div>
            <div>
              <label className="block text-xs font-bold text-heading uppercase tracking-wider mb-2">Discount Percentage (%)</label>
              <input type="number" name="discount_price" value={formData.discount_price || ''} onChange={handleChange} className="w-full px-4 py-2 bg-background border border-border rounded-md" />
            </div>
            <div>
              <label className="block text-xs font-bold text-heading uppercase tracking-wider mb-2">Final Sale Price (₹)</label>
              <div className="w-full px-4 py-2 bg-muted border border-border rounded-md text-foreground/70 font-medium">
                {formData.discount_price ? Math.round(formData.price * (1 - formData.discount_price / 100)) : formData.price}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-heading uppercase tracking-wider mb-2">SKU</label>
              <input required name="sku" value={formData.sku} onChange={handleChange} className="w-full px-4 py-2 bg-background border border-border rounded-md" />
            </div>
            <div>
              <label className="block text-xs font-bold text-heading uppercase tracking-wider mb-2">Stock Qty</label>
              <input required type="number" name="stock_quantity" value={formData.stock_quantity} onChange={handleChange} className="w-full px-4 py-2 bg-background border border-border rounded-md" />
            </div>
          </div>
        </div>

        {/* Organization */}
        <div className="space-y-4 md:col-span-2">
          <h3 className="font-serif text-xl border-b border-border pb-2">Organization & Details</h3>
          
          {productType === 'jewelry' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Categories */}
              <div className="bg-background border border-border p-4 rounded-md">
                <label className="block text-xs font-bold text-heading uppercase tracking-wider mb-3 border-b border-border pb-2">Categories (Select multiple)</label>
                <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                  {categories.map(c => (
                    <label key={c.id} className="flex items-center gap-2 cursor-pointer p-1.5 hover:bg-muted rounded transition-colors">
                      <input 
                        type="checkbox" 
                        checked={formData.category_ids.includes(c.id)} 
                        onChange={() => handleCategoryToggle(c.id)}
                        className="w-4 h-4 accent-primary" 
                      />
                      <span className="text-sm">{c.name}</span>
                    </label>
                  ))}
                  {categories.length === 0 && <span className="text-xs text-foreground/50">No categories found.</span>}
                </div>
              </div>

              {/* Subcategories */}
              <div className="bg-background border border-border p-4 rounded-md">
                <label className="block text-xs font-bold text-heading uppercase tracking-wider mb-3 border-b border-border pb-2">Subcategories (Select multiple)</label>
                <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                  {subcategories.map(s => (
                    <label key={s.id} className="flex items-center gap-2 cursor-pointer p-1.5 hover:bg-muted rounded transition-colors">
                      <input 
                        type="checkbox" 
                        checked={formData.subcategory_ids.includes(s.id)} 
                        onChange={() => handleSubcategoryToggle(s.id)}
                        className="w-4 h-4 accent-primary" 
                      />
                      <span className="text-sm">{s.name}</span>
                    </label>
                  ))}
                  {subcategories.length === 0 && (
                    <span className="text-xs text-foreground/50">
                      {formData.category_ids.length > 0 ? "No subcategories found for selected categories." : "Select at least one category first."}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-xs font-bold text-heading uppercase tracking-wider mb-2">Collection</label>
              <select name="collection_id" value={formData.collection_id} onChange={handleChange} className="w-full px-4 py-2 bg-background border border-border rounded-md">
                <option value="">Select Collection...</option>
                {collections.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-heading uppercase tracking-wider mb-2">Material</label>
              <input name="material" value={formData.material} onChange={handleChange} className="w-full px-4 py-2 bg-background border border-border rounded-md" />
            </div>
            <div>
              <label className="block text-xs font-bold text-heading uppercase tracking-wider mb-2">Care</label>
              <input name="care_instructions" value={formData.care_instructions} onChange={handleChange} className="w-full px-4 py-2 bg-background border border-border rounded-md" />
            </div>
          </div>
        </div>

        {/* Status Flags */}
        <div className="space-y-4 md:col-span-2">
          <h3 className="font-serif text-xl border-b border-border pb-2">Status & Badges</h3>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="availability" checked={formData.availability} onChange={handleChange} className="w-4 h-4 accent-primary" />
              <span className="text-sm font-medium">Active (Visible in store)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="new_arrival" checked={formData.new_arrival} onChange={handleChange} className="w-4 h-4 accent-primary" />
              <span className="text-sm font-medium">New Arrival</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="best_seller" checked={formData.best_seller} onChange={handleChange} className="w-4 h-4 accent-primary" />
              <span className="text-sm font-medium">Best Seller</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-6 border-t border-border">
        <button type="button" onClick={() => router.back()} className="px-6 py-3 text-sm font-medium hover:bg-muted rounded-md transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={isSaving} className="px-8 py-3 bg-primary text-primary-foreground text-xs font-bold tracking-wider rounded-md hover:bg-primary-hover transition-colors uppercase disabled:opacity-50">
          {isSaving ? "Saving..." : (initialData ? "Save Changes" : "Create Product")}
        </button>
      </div>
    </form>
  );
}
