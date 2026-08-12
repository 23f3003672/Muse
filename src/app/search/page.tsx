import PageHeader from "@/components/ui/PageHeader";
import Link from "next/link";

export default function SearchPage() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-12 md:py-16">
      <PageHeader 
        title="Search" 
        subtitle="Find your perfect piece."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Search", href: "/search" }
        ]} 
      />

      <div className="flex flex-col items-center justify-center text-center py-24 md:py-32 border-t border-border mt-8">
        <h2 className="font-serif text-3xl md:text-4xl text-heading mb-6 tracking-wide">
          Search is Coming Soon
        </h2>
        <p className="text-foreground/70 max-w-md mx-auto text-base md:text-lg leading-relaxed mb-10">
          Our advanced search feature is currently under construction. In the meantime, please explore our shop directly.
        </p>
        <div className="w-16 h-[1px] bg-border mx-auto mb-10"></div>
        <Link href="/shop" className="px-8 py-3 bg-primary text-primary-foreground text-xs font-bold tracking-widest uppercase rounded-full hover:bg-primary-hover transition-colors">
          Shop All Jewelry
        </Link>
      </div>
    </div>
  );
}
