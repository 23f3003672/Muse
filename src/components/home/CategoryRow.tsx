import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function CategoryRow() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('display_order', { ascending: true });

  if (!categories || categories.length === 0) return null;

  return (
    <section className="container mx-auto px-4 md:px-8 py-12">
      <div className="flex justify-between items-end mb-10 border-b border-border pb-4">
        <div>
          <h2 className="font-serif text-3xl text-heading mb-1">Shop by Category</h2>
          <p className="text-foreground/70 text-sm">Find your focus.</p>
        </div>
        <Link href="/collections" className="text-xs font-bold tracking-widest uppercase text-heading hover:text-primary transition-colors pb-1">
          View All
        </Link>
      </div>

      <div className="flex justify-between items-center overflow-x-auto pb-8 snap-x hide-scrollbar gap-6 md:gap-4">
        {categories.map((cat) => (
          <Link key={cat.id} href={`/shop?category=${cat.slug}`} className="flex flex-col items-center gap-4 group snap-center shrink-0 w-32 md:w-auto md:flex-1">
            <div className="w-28 h-28 md:w-36 md:h-36 lg:w-44 lg:h-44 rounded-full bg-[#f0eae1] border border-border/50 group-hover:border-primary transition-colors flex items-center justify-center overflow-hidden">
               {cat.image_url ? (
                 <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
               ) : (
                 <span className="text-[10px] text-foreground/40 font-serif">Img</span>
               )}
            </div>
            <span className="font-serif text-lg text-heading group-hover:text-primary transition-colors">{cat.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
