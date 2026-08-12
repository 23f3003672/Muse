"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Edit, Trash2, Search, Tag, Image as ImageIcon } from "lucide-react";
import toast from "@/lib/toast";
import AdminModal from "@/components/admin/AdminModal";

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const supabase = createClient();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    display_order: 0,
    image_url: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [imageFile, setImageFile] = useState<Blob | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .order('display_order', { ascending: true });
      
    if (data) {
      setCollections(data);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this collection? Products in this collection will not be deleted.")) {
      const { error } = await supabase.from('collections').delete().eq('id', id);
      if (error) {
        toast.error("Failed to delete collection: " + error.message);
      } else {
        toast.success("Collection deleted");
        fetchCollections();
      }
    }
  };

  const openModal = (collection?: any) => {
    setImageFile(null);
    setImagePreview("");
    if (collection) {
      setEditingId(collection.id);
      setFormData({
        name: collection.name,
        slug: collection.slug,
        display_order: collection.display_order || 0,
        image_url: collection.image_url || "",
      });
    } else {
      setEditingId(null);
      setFormData({
        name: "",
        slug: "",
        display_order: 0,
        image_url: "",
      });
    }
    setErrorMsg("");
    setIsModalOpen(true);
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
    
    const submitData = { ...formData };
    
    if (imageFile) {
      const fileName = `${Date.now()}-collection-${formData.slug || 'img'}.webp`;
      const { error: uploadError } = await supabase.storage
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
        
      submitData.image_url = publicUrlData.publicUrl;
    }
    
    let saveError;
    if (editingId) {
      const { error } = await supabase.from('collections').update(submitData).eq('id', editingId);
      saveError = error;
      if (!saveError) toast.success("Collection updated!");
    } else {
      const { error } = await supabase.from('collections').insert([submitData]);
      saveError = error;
      if (!saveError) toast.success("Collection created!");
    }
    
    
    if (saveError) {
      console.error(saveError);
      setErrorMsg(saveError.message || "Failed to save collection.");
      toast.error("Failed to save collection: " + saveError.message);
    } else {
      setIsModalOpen(false);
      fetchCollections();
    }
    
    setIsSaving(false);
  };

  const filteredCollections = collections.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl text-heading mb-1">Collections</h1>
          <p className="text-sm text-foreground/70">Manage curated collections (e.g., Bridal Bliss).</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-xs font-bold tracking-wider rounded-full hover:bg-primary-hover transition-colors uppercase shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Collection
        </button>
      </div>

      <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-border flex justify-between items-center bg-background/50">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
            <input 
              type="text" 
              placeholder="Search collections..." 
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
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4">Display Order</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-sm text-foreground/50">
                    Loading collections...
                  </td>
                </tr>
              ) : filteredCollections.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-foreground/50">
                      <Tag className="w-12 h-12 mb-3 stroke-[1]" />
                      <p>No collections found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCollections.map((collection) => (
                  <tr key={collection.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-heading">
                      {collection.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground/70">{collection.slug}</td>
                    <td className="px-6 py-4 text-sm text-foreground/70">{collection.display_order}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openModal(collection)}
                          className="p-2 text-foreground/50 hover:text-primary transition-colors rounded-md hover:bg-primary/10"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(collection.id)}
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
        title={editingId ? "Edit Collection" : "Add Collection"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm font-medium">
              {errorMsg}
            </div>
          )}
          <div>
            <label className="block text-xs font-bold text-heading uppercase tracking-wider mb-2">Name</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')})}
              className="w-full px-4 py-2 bg-background border border-border rounded-md focus:outline-none focus:border-primary transition-colors"
              placeholder="e.g. Bridal Bliss"
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
              placeholder="e.g. bridal-bliss"
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
          <div>
            <label className="block text-xs font-bold text-heading uppercase tracking-wider mb-2">Collection Image</label>
            <div className="flex items-center gap-4">
              {imagePreview ? (
                <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted border border-border shrink-0">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              ) : formData.image_url ? (
                <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted border border-border shrink-0">
                  <img src={formData.image_url} alt="Current" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-md bg-muted border border-border flex items-center justify-center text-[10px] text-foreground/50 shrink-0">
                  No Img
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" ref={fileInputRef} />
              <button type="button" onClick={() => fileInputRef.current?.click()} className="px-3 py-1.5 border border-border rounded-md text-xs font-medium hover:bg-muted transition-colors">
                {imagePreview || formData.image_url ? "Change Image" : "Upload Image"}
              </button>
            </div>
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
              disabled={isSaving}
              className="px-5 py-2.5 bg-primary text-primary-foreground text-xs font-bold tracking-wider rounded-md hover:bg-primary-hover transition-colors uppercase disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Collection"}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
