import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: "NEW" | "BESTSELLER";
  slug: string;
}

export default function ProductCard({ id, name, price, originalPrice, image, badge, slug }: ProductCardProps) {
  return (
    <div className="group relative flex flex-col gap-4">
      <Link href={`/product/${slug}`} className="block relative aspect-[4/5] overflow-hidden rounded-md bg-muted">
        {image ? (
          <Image src={image} alt={name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="absolute inset-0 bg-muted flex items-center justify-center text-muted-foreground transition-transform duration-500 group-hover:scale-105">
             <span className="text-xs">Image Placeholder</span>
          </div>
        )}
        
        {badge && (
          <span className="absolute top-2 left-2 z-10 px-2 py-1 bg-secondary text-secondary-foreground text-[10px] font-bold tracking-wider rounded-sm">
            {badge}
          </span>
        )}
      </Link>
      
      <div className="flex flex-col items-center text-center gap-1">
        <Link href={`/product/${slug}`} className="hover:text-primary transition-colors">
          <h3 className="font-serif text-lg text-heading">{name}</h3>
        </Link>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-foreground">₹{price.toLocaleString('en-IN')}</span>
          {originalPrice && (
            <span className="text-foreground/50 line-through text-xs">₹{originalPrice.toLocaleString('en-IN')}</span>
          )}
        </div>
      </div>
      
      <button className="w-full mt-2 py-2.5 rounded-full border border-border text-xs font-medium text-heading hover:border-primary hover:text-primary transition-colors uppercase tracking-wider">
        Add to Cart
      </button>
    </div>
  );
}
