import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";

const collections = [
  { id: "1", name: "Bridal Bliss", slug: "bridal-bliss" },
  { id: "2", name: "Everyday Edit", slug: "everyday-edit" },
  { id: "3", name: "Festive Radiance", slug: "festive-radiance" },
  { id: "4", name: "The Minimal Line", slug: "the-minimal-line" },
];

export default function CollectionsPage() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-12 md:py-16">
      <PageHeader 
        title="Our Collections" 
        subtitle="Curated edits for every chapter of your story—from the everyday glow to the grandest celebrations."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Collections", href: "/collections" }
        ]} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mt-12">
        {collections.map((collection) => (
          <Link 
            key={collection.id} 
            href={`/collections/${collection.slug}`} 
            className="group block relative aspect-video md:aspect-[4/3] bg-muted rounded-md overflow-hidden"
          >
            <div className="absolute inset-0 bg-[#e4dcd3] flex items-center justify-center text-muted-foreground transition-transform duration-700 group-hover:scale-105">
               <span className="font-serif opacity-50 text-xl tracking-wider">{collection.name} Image</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            <div className="absolute bottom-8 left-8 right-8">
              <h3 className="font-serif text-3xl text-white mb-2 tracking-wide">{collection.name}</h3>
              <p className="text-white/80 text-sm underline underline-offset-4 decoration-white/50 group-hover:decoration-white transition-colors uppercase tracking-widest text-xs">Explore Collection</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
