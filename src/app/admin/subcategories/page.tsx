"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Edit, Trash2, Search, Target } from "lucide-react";
import AdminModal from "@/components/admin/AdminModal";

export default function AdminSubcategoriesPage() {
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const supabase = createClient();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    category_id: "",
    display_order: 0,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [subRes, catRes] = await Promise.all([
      supabase.from('subcategories').select('*, categories(name)').order('display_order', { ascending: true }),
      supabase.from('categories').select('id, name').order('name', { ascending: true })
    ]);
      
    if (subRes.data) setSubcategories(subRes.data);
    if (catRes.data) setCategories(catRes.data);
    
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this subcategory?")) {
      await supabase.from('subcategories').delete().eq('id', id);
      fetchData();
    }
  };

  const openModal = (subcategory?: any) => {
    if (subcategory) {
      setEditingId(subcategory.id);
      setFormData({
        name: subcategory.name,
        slug: subcategory.slug,
        category_id: subcategory.category_id || "",
        display_order: subcategory.display_order || 0,
      });
    } else {
      setEditingId(null);
      setFormData({
        name: "",
        slug: "",
        category_id: categories.length > 0 ? categories[0].id : "",
        display_order: 0,
      });
    }
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    let saveError;
    if (editingId) {
      const { error } = await supabase.from('subcategories').update(formData).eq('id', editingId);
      saveError = error;
    } else {
      const { error } = await supabase.from('subcategories').insert([formData]);
      saveError = error;
    }
    
    
    if (saveError) {
      console.error(saveError);
      setErrorMsg(saveError.message || "Failed to save subcategory.");
    } else {
      setIsModalOpen(false);
      fetchData();
      // Toast notification could be used here
    }
    
    setIsSaving(false);
  };

  const filteredSubcategories = subcategories.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.categories && s.categories.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl text-heading mb-1">Subcategories</h1>
          <p className="text-sm text-foreground/70">Manage subcategories (e.g., Jhumke, Chokers) within parent categories.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-xs font-bold tracking-wider rounded-full hover:bg-primary-hover transition-colors uppercase shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Subcategory
        </button>
      </div>

      <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-border flex justify-between items-center bg-background/50">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
            <input 
              type="text" 
              placeholder="Search subcategories..." 
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
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Parent Category</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-sm text-foreground/50">
                    Loading subcategories...
                  </td>
                </tr>
              ) : filteredSubcategories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-foreground/50">
                      <Target className="w-12 h-12 mb-3 stroke-[1]" />
                      <p>No subcategories found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredSubcategories.map((sub) => (
                  <tr key={sub.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-heading">
                      {sub.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground/70">
                      {sub.categories ? sub.categories.name : "None"}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground/70">{sub.slug}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openModal(sub)}
                          className="p-2 text-foreground/50 hover:text-primary transition-colors rounded-md hover:bg-primary/10"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(sub.id)}
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

      <AdminModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingId ? "Edit Subcategory" : "Add Subcategory"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm font-medium">
              {errorMsg}
            </div>
          )}
          <div>
            <label className="block text-xs font-bold text-heading uppercase tracking-wider mb-2">Parent Category</label>
            <select 
              required
              value={formData.category_id}
              onChange={(e) => setFormData({...formData, category_id: e.target.value})}
              className="w-full px-4 py-2 bg-background border border-border rounded-md focus:outline-none focus:border-primary transition-colors"
            >
              <option value="" disabled>Select a category...</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-heading uppercase tracking-wider mb-2">Name</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')})}
              className="w-full px-4 py-2 bg-background border border-border rounded-md focus:outline-none focus:border-primary transition-colors"
              placeholder="e.g. Jhumke"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-heading uppercase tracking-wider mb-2">Slug</label>
            <input 
              type="text" 
              required
              value={formData.slug}
              onChange={(e) => setFormData({...formData, slug: e.target.value})}
              className="w-full px-4 py-2 bg-background border border-border rounded-md focus:outline-none focus:border-primary transition-colors"
              placeholder="e.g. jhumke"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-heading uppercase tracking-wider mb-2">Display Order</label>
            <input 
              type="number" 
              value={formData.display_order}
              onChange={(e) => setFormData({...formData, display_order: parseInt(e.target.value) || 0})}
              className="w-full px-4 py-2 bg-background border border-border rounded-md focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          
          <div className="pt-4 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              className="px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted rounded-md transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSaving || !formData.category_id}
              className="px-5 py-2.5 bg-primary text-primary-foreground text-xs font-bold tracking-wider rounded-md hover:bg-primary-hover transition-colors uppercase disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Subcategory"}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
