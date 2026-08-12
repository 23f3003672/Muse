import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function CollectionRow() {
  const supabase = await createClient();
  const { data: collections } = await supabase
    .from('collections')
    .select('*')
    .order('display_order', { ascending: true })
    .limit(2); // Only showing top 2 collections on the homepage

  if (!collections || collections.length === 0) return null;

  return (
    <section className="container mx-auto px-4 md:px-8 py-16 border-t border-border/50">
      <div className="flex justify-between items-end mb-10 border-b border-border pb-4">
        <div>
          <h2 className="font-serif text-3xl text-heading mb-1">Shop by Collection</h2>
          <p className="text-foreground/70 text-sm">Curated stories for every occasion.</p>
        </div>
        <Link href="/collections" className="text-xs font-bold tracking-widest uppercase text-heading hover:text-primary transition-colors pb-1">
          All Collections
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {collections.map((collection) => (
          <Link key={collection.id} href={`/shop?collection=${collection.slug}`} className="group block relative aspect-video md:aspect-[4/3] bg-muted rounded-md overflow-hidden">
            <div className="absolute inset-0 bg-[#e4dcd3] flex items-center justify-center text-muted-foreground transition-transform duration-700 group-hover:scale-105">
               {collection.image_url ? (
                 <img src={collection.image_url} alt={collection.name} className="w-full h-full object-cover" />
               ) : (
                 <span className="font-serif opacity-50">Collection Image</span>
               )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6">
              <h3 className="font-serif text-3xl text-white mb-2">{collection.name}</h3>
              <p className="text-white/80 text-sm underline underline-offset-4 decoration-white/50 group-hover:decoration-white transition-colors">Explore Collection</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
