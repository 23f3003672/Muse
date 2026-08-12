"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Save, Upload, Link as LinkIcon, Video } from "lucide-react";
import toast from "@/lib/toast";

type VideoGridItem = {
  video_url: string;
  post_url: string;
};

export default function AboutSettingsPage() {
  const [settings, setSettings] = useState({
    about_video_grid: Array(4).fill({ video_url: "", post_url: "" }) as VideoGridItem[]
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const supabase = createClient();

  const [videoFeed, setVideoFeed] = useState<VideoGridItem[]>(Array(4).fill({ video_url: "", post_url: "" }));
  const [videoFiles, setVideoFiles] = useState<(Blob | null)[]>(Array(4).fill(null));
  const [videoPreviews, setVideoPreviews] = useState<string[]>(Array(4).fill(""));
  const videoInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    
    // Fetch settings
    const { data, error } = await supabase.from('storefront_settings').select('*');
    if (data) {
      let initialVideoFeed = Array(4).fill({ video_url: "", post_url: "" });

      data.forEach(row => {
        if (row.key === 'about_video_grid') {
          try {
            const parsed = JSON.parse(row.value);
            if (Array.isArray(parsed) && parsed.length === 4) {
              initialVideoFeed = parsed;
            }
          } catch (e) {}
        }
      });
      setSettings({ about_video_grid: initialVideoFeed });
      setVideoFeed(initialVideoFeed);
    }
    setLoading(false);
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      toast.error("Please select a valid video file.");
      return;
    }

    const newFiles = [...videoFiles];
    newFiles[index] = file;
    setVideoFiles(newFiles);

    const newPreviews = [...videoPreviews];
    newPreviews[index] = URL.createObjectURL(file);
    setVideoPreviews(newPreviews);
  };

  const updatePostUrl = (index: number, url: string) => {
    const newFeed = [...videoFeed];
    newFeed[index] = { ...newFeed[index], post_url: url };
    setVideoFeed(newFeed);
  };

  const removeVideo = (index: number) => {
    const newFeed = [...videoFeed];
    newFeed[index] = { video_url: "", post_url: "" };
    setVideoFeed(newFeed);
    
    const newFiles = [...videoFiles];
    newFiles[index] = null;
    setVideoFiles(newFiles);
    
    const newPreviews = [...videoPreviews];
    newPreviews[index] = "";
    setVideoPreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    let updatedVideoFeed = [...videoFeed];

    // Upload Videos
    for (let i = 0; i < 4; i++) {
      if (videoFiles[i]) {
        const fileExt = (videoFiles[i] as File).name.split('.').pop() || 'mp4';
        const fileName = `${Date.now()}-about-vid-${i}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('product-images-muse')
          .upload(fileName, videoFiles[i]!, { contentType: (videoFiles[i] as File).type });
          
        if (uploadError) {
          toast.error(`Error uploading video ${i + 1}: ` + uploadError.message);
        } else {
          const { data } = supabase.storage.from('product-images-muse').getPublicUrl(fileName);
          updatedVideoFeed[i] = { ...updatedVideoFeed[i], video_url: data.publicUrl };
        }
      }
    }

    // Save to database
    const { error } = await supabase.from('storefront_settings').upsert([
      { key: 'about_video_grid', value: JSON.stringify(updatedVideoFeed) }
    ]);
    
    if (error) {
      toast.error("Failed to save settings: " + error.message);
    } else {
      setSettings({ 
        about_video_grid: updatedVideoFeed
      });
      setVideoFiles(Array(4).fill(null));
      toast.success("About page settings saved successfully!");
    }
    setIsSaving(false);
  };

  if (loading) {
    return <div className="p-8 text-center text-foreground/50">Loading settings...</div>;
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="font-serif text-3xl text-heading mb-1">About Page Settings</h1>
        <p className="text-sm text-foreground/70">Manage the content and media on your About page.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        
        {/* Video Grid Settings */}
        <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
          <h2 className="font-serif text-xl text-heading mb-4 border-b border-border pb-2">Video Banner Grid</h2>
          <p className="text-sm text-foreground/70 mb-6">Upload 4 short videos (e.g., Instagram Reels) that will loop silently side-by-side. Provide the Instagram URL to make them clickable.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[0, 1, 2, 3].map((index) => {
              const currentUrl = videoPreviews[index] || videoFeed[index].video_url;
              return (
                <div key={index} className="space-y-3">
                  <div className="relative aspect-[9/16] bg-muted rounded-md border border-border overflow-hidden flex items-center justify-center group">
                    {currentUrl ? (
                      <video 
                        src={currentUrl} 
                        className="w-full h-full object-cover" 
                        autoPlay 
                        muted 
                        loop 
                        playsInline
                      />
                    ) : (
                      <div className="flex flex-col items-center text-foreground/40">
                        <Video className="w-8 h-8 mb-2 opacity-50" />
                        <span className="text-xs">Video {index + 1}</span>
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-3">
                      <input
                        type="file"
                        accept="video/mp4,video/quicktime,video/webm"
                        className="hidden"
                        ref={(el) => { videoInputRefs.current[index] = el; }}
                        onChange={(e) => handleVideoChange(e, index)}
                      />
                      <button 
                        type="button"
                        onClick={() => videoInputRefs.current[index]?.click()}
                        className="bg-white text-heading text-sm px-4 py-2 rounded-full font-medium hover:scale-105 transition-transform shadow-lg flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4" /> Upload
                      </button>
                      {currentUrl && (
                        <button 
                          type="button"
                          onClick={() => removeVideo(index)}
                          className="text-white text-xs hover:underline mt-2"
                        >
                          Remove Video
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="relative mt-2">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                      <LinkIcon className="h-3 w-3 text-foreground/40" />
                    </div>
                    <input
                      type="url"
                      placeholder="Instagram Reel URL"
                      value={videoFeed[index].post_url}
                      onChange={(e) => updatePostUrl(index, e.target.value)}
                      className="w-full pl-8 pr-2 py-2 bg-background border border-border rounded-md text-xs text-foreground placeholder:text-foreground/30 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4 pb-12">
          <button 
            type="submit" 
            disabled={isSaving}
            className="flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground text-sm font-bold tracking-wider rounded-md hover:bg-primary-hover transition-colors uppercase disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Saving..." : "Save About Settings"}
          </button>
        </div>

      </form>
    </div>
  );
}
