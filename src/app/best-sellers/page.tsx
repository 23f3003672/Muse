import PageHeader from "@/components/ui/PageHeader";
import ProductCard from "@/components/ui/ProductCard";

const products = [
  { id: "1", name: "Antique Peacock Earrings", slug: "antique-peacock-earrings", price: 1299, originalPrice: 1599, badge: "NEW" as const, image: "" },
  { id: "2", name: "Lotus Kundan Necklace", slug: "lotus-kundan-necklace", price: 2499, originalPrice: 2899, badge: "BESTSELLER" as const, image: "" },
  { id: "3", name: "Rose Gold Bangle Set", slug: "rose-gold-bangle-set", price: 1899, originalPrice: 2200, badge: "BESTSELLER" as const, image: "" },
  { id: "4", name: "Temple Choker", slug: "temple-choker", price: 3499, badge: "BESTSELLER" as const, image: "" },
  { id: "5", name: "Polki Statement Earrings", slug: "polki-statement-earrings", price: 2199, badge: "BESTSELLER" as const, image: "" },
];

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

      {/* Toolbar */}
      <div className="flex justify-between items-center py-4 border-b border-border mb-8">
        <span className="text-sm text-foreground/70">{products.length} products</span>
        <div className="flex items-center gap-2">
          <span className="text-sm text-foreground/70">Sorted by</span>
          <select className="bg-transparent border-none text-sm text-heading font-medium outline-none cursor-pointer p-0 pr-4">
            <option>Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
        {products.map((product) => (
          <ProductCard 
            key={product.id}
            id={product.id}
            name={product.name}
            slug={product.slug}
            price={product.price}
            originalPrice={product.originalPrice}
            image={product.image}
            badge={product.badge}
          />
        ))}
      </div>
    </div>
  );
}
