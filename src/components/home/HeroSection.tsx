import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function HeroSection() {
  const supabase = await createClient();
  const { data: settingsData } = await supabase.from('storefront_settings').select('*');
  
  let heroImage = "";
  if (settingsData) {
    const heroRow = settingsData.find(row => row.key === 'hero_image');
    if (heroRow) heroImage = heroRow.value;
  }

  return (
    <section className="container mx-auto px-4 md:px-8 py-8 md:py-12">
      <div className="flex flex-col md:flex-row rounded-[2rem] overflow-hidden bg-[#e8e0d5] min-h-[550px]">
        {/* Left Content */}
        <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center items-start text-left space-y-6">
          <p className="text-xs font-semibold tracking-[0.2em] text-[#8a7a6c] uppercase">
            The Festive Edit &middot; 2026
          </p>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-tight text-[#3c3128]">
            Jewelry that <span className="italic text-[#947a61]">tells</span><br />your story
          </h1>
          <p className="text-[#5b4b41] leading-relaxed text-sm md:text-base max-w-md">
            Handpicked artificial jewelry designed for the modern muse — luminous, lightweight, and made to be worn every day or your biggest day.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
            <Link 
              href="/collections/festive-edit-2026" 
              className="px-8 py-3.5 bg-[#947a61] text-white text-xs font-bold tracking-wider rounded-full hover:bg-[#836a54] transition-colors uppercase text-center"
            >
              Shop the Collection
            </Link>
            <Link 
              href="/collections" 
              className="px-8 py-3.5 bg-transparent border border-[#947a61]/30 text-[#5b4b41] text-xs font-bold tracking-wider rounded-full hover:border-[#947a61] transition-colors uppercase text-center"
            >
              Explore Collections
            </Link>
          </div>
        </div>

        {/* Right Image / Pattern */}
        <div 
          className="w-full md:w-1/2 relative flex items-center justify-center min-h-[300px] md:min-h-full overflow-hidden"
          style={!heroImage ? {
            backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 15px, rgba(148, 122, 97, 0.08) 15px, rgba(148, 122, 97, 0.08) 30px)"
          } : {}}
        >
          {heroImage ? (
            <img src={heroImage} alt="Hero Campaign" className="w-full h-full object-cover" />
          ) : (
            <div className="bg-[#f8f5f2]/80 backdrop-blur-sm px-4 py-1.5 rounded-md shadow-sm">
              <span className="font-mono text-xs text-[#8a7a6c]">hero campaign shot</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
