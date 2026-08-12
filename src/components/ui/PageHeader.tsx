import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Breadcrumb {
  label: string;
  href: string;
}

interface PageHeaderProps {
  breadcrumbs: Breadcrumb[];
  title: string;
  subtitle?: string;
}

export default function PageHeader({ breadcrumbs, title, subtitle }: PageHeaderProps) {
  return (
    <div className="flex flex-col items-center text-center mb-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-foreground/60 mb-6 font-medium uppercase tracking-wider">
        {breadcrumbs.map((crumb, idx) => (
          <div key={idx} className="flex items-center gap-2">
            {idx > 0 && <span className="text-border mx-1">/</span>}
            {idx === breadcrumbs.length - 1 ? (
              <span className="text-foreground">{crumb.label}</span>
            ) : (
              <Link href={crumb.href} className="hover:text-primary transition-colors">
                {crumb.label}
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* Title */}
      <h1 className="font-serif text-4xl md:text-5xl text-heading mb-4">{title}</h1>

      {/* Subtitle */}
      {subtitle && (
        <p className="text-foreground/70 text-sm max-w-xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
