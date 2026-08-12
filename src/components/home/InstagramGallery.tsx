import { Camera } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function InstagramGallery() {
  const supabase = await createClient();
  const { data: settingsData } = await supabase.from('storefront_settings').select('*');
  
  let instagramFeed = Array(5).fill({ image_url: "", post_url: "" });
  
  if (settingsData) {
    const feedRow = settingsData.find(row => row.key === 'instagram_feed_data');
    if (feedRow && feedRow.value) {
      try {
        const parsed = JSON.parse(feedRow.value);
        if (Array.isArray(parsed) && parsed.length === 5) {
          instagramFeed = parsed;
        }
      } catch (e) {}
    }
  }

  return (
    <section className="py-16">
      <div className="text-center mb-10">
        <h2 className="font-serif text-3xl text-heading mb-2">@musebykashish</h2>
        <p className="text-foreground/70 text-sm">Tag us on the feed to get featured.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-0">
        {instagramFeed.map((item, index) => {
          const hasImage = !!item.image_url;
          const targetUrl = item.post_url || "https://instagram.com/musebykashish";
          
          return (
            <Link key={index} href={targetUrl} target="_blank" className="group relative aspect-square bg-muted overflow-hidden block">
              {hasImage ? (
                <img 
                  src={item.image_url} 
                  alt={`Instagram ${index + 1}`} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
              ) : (
                <div className="absolute inset-0 bg-[#e4dcd3] flex items-center justify-center text-muted-foreground/50 transition-transform duration-700 group-hover:scale-110">
                  <span className="font-serif text-sm">Post {index + 1}</span>
                </div>
              )}
              
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors flex items-center justify-center">
                <Camera className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
