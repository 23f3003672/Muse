"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Megaphone, Save } from "lucide-react";
import toast from "@/lib/toast";

export default function AdminAnnouncementsPage() {
  const [announcement, setAnnouncement] = useState({ id: "", message: "", link_url: "", is_active: false });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchAnnouncement();
  }, []);

  const fetchAnnouncement = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
      
    if (data) {
      setAnnouncement({
        id: data.id,
        message: data.message,
        link_url: data.link_url || "",
        is_active: data.is_active
      });
    }
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    if (announcement.id) {
      // Update
      const { error } = await supabase.from('announcements').update({
        message: announcement.message,
        link_url: announcement.link_url,
        is_active: announcement.is_active
      }).eq('id', announcement.id);

      if (error) {
        toast.error("Failed to update announcement.");
      } else {
        toast.success("Announcement saved successfully.");
      }
    } else {
      // Insert
      const { data, error } = await supabase.from('announcements').insert([{
        message: announcement.message,
        link_url: announcement.link_url,
        is_active: announcement.is_active
      }]).select();
      
      if (error) {
        toast.error("Failed to create announcement.");
      } else if (data && data[0]) {
        setAnnouncement({...announcement, id: data[0].id});
      }
    }
    
    setSaving(false);
    alert("Announcement saved successfully.");
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl text-heading mb-1">Announcements</h1>
          <p className="text-sm text-foreground/70">Manage the global top bar announcement.</p>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl shadow-sm p-6 max-w-2xl">
        {loading ? (
          <div className="text-sm text-foreground/50">Loading settings...</div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-md border border-border/50">
              <Megaphone className="w-5 h-5 text-primary" />
              <div>
                <h3 className="text-sm font-medium text-heading">Storefront Preview</h3>
                <p className="text-xs text-foreground/70">This will appear at the very top of your website.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/70">Announcement Message</label>
                <input 
                  type="text" 
                  value={announcement.message}
                  onChange={(e) => setAnnouncement({...announcement, message: e.target.value})}
                  placeholder="e.g., FLAT 15% OFF | USE CODE: MUSE15" 
                  required
                  className="w-full px-4 py-3 bg-transparent border border-border rounded-md text-sm text-heading placeholder:text-foreground/40 focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/70">Link URL (Optional)</label>
                <input 
                  type="text" 
                  value={announcement.link_url}
                  onChange={(e) => setAnnouncement({...announcement, link_url: e.target.value})}
                  placeholder="e.g., /collections/sale" 
                  className="w-full px-4 py-3 bg-transparent border border-border rounded-md text-sm text-heading placeholder:text-foreground/40 focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <label className="flex items-center gap-3 cursor-pointer mt-2">
                <input 
                  type="checkbox" 
                  checked={announcement.is_active}
                  onChange={(e) => setAnnouncement({...announcement, is_active: e.target.checked})}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary accent-primary"
                />
                <span className="text-sm font-medium text-heading">Enable Announcement Bar</span>
              </label>
            </div>

            <div className="pt-4 border-t border-border">
              <button 
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground text-xs font-bold tracking-wider rounded-full hover:bg-primary-hover transition-colors uppercase disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
