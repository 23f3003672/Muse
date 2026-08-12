import PageHeader from "@/components/ui/PageHeader";
import Link from "next/link";

export default function BestSellersPage() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-12 md:py-16">
      <PageHeader 
        title="Best Sellers" 
        subtitle="The pieces our muses can't stop wearing."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Best Sellers", href: "/best-sellers" }
        ]} 
      />

      <div className="flex flex-col items-center justify-center text-center py-24 md:py-32 border-t border-border mt-8">
        <h2 className="font-serif text-3xl md:text-4xl text-heading mb-6 tracking-wide">
          Coming Soon
        </h2>
        <p className="text-foreground/70 max-w-md mx-auto text-base md:text-lg leading-relaxed mb-10">
          We are currently gathering data to showcase our most loved pieces. Check back shortly!
        </p>
        <div className="w-16 h-[1px] bg-border mx-auto mb-10"></div>
        <Link href="/shop" className="px-8 py-3 bg-primary text-primary-foreground text-xs font-bold tracking-widest uppercase rounded-full hover:bg-primary-hover transition-colors">
          Shop All Jewelry
        </Link>
      </div>
    </div>
  );
}
