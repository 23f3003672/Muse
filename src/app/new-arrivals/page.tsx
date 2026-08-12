import PageHeader from "@/components/ui/PageHeader";
import ProductCard from "@/components/ui/ProductCard";

const products = [
  { id: "1", name: "Antique Peacock Earrings", slug: "antique-peacock-earrings", price: 1299, originalPrice: 1599, badge: "NEW" as const, image: "" },
  { id: "2", name: "Minimal Pearl Studs", slug: "minimal-pearl-studs", price: 899, badge: "NEW" as const, image: "" },
  { id: "3", name: "Emerald Drop Ring", slug: "emerald-drop-ring", price: 1099, badge: "NEW" as const, image: "" },
  { id: "4", name: "Silver Ghungroo Anklet", slug: "silver-ghungroo-anklet", price: 1299, badge: "NEW" as const, image: "" },
];

export default function NewArrivalsPage() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-12 md:py-16">
      <PageHeader 
        title="New Arrivals" 
        subtitle="The freshest pieces to join the muse by Kashish family."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "New Arrivals", href: "/new-arrivals" }
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
