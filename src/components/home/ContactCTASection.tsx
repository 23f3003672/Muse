import Link from "next/link";
import { MessageCircle } from "lucide-react";

export default function ContactCTASection() {
  return (
    <section className="container mx-auto px-4 md:px-8 py-16 mb-8">
      <div className="bg-[#4b3e34] rounded-xl p-12 md:p-20 text-center relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
        
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl text-[#f8f5f2] mb-4">
            Have a question or a custom request?
          </h2>
          <p className="text-[#e4dcd3] mb-10 text-sm md:text-base">
            Chat with us directly on WhatsApp for styling advice, order updates, or bulk orders. We usually reply within minutes.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="https://wa.me/919897110086" 
              target="_blank"
              className="flex items-center gap-2 px-8 py-3.5 bg-[#25D366] text-white text-xs font-bold tracking-wider rounded-full hover:bg-[#128C7E] transition-colors uppercase w-full sm:w-auto justify-center"
            >
              <MessageCircle className="w-4 h-4" />
              Chat on WhatsApp
            </Link>
            <Link 
              href="/contact" 
              className="px-8 py-3.5 bg-transparent border border-[#ddd2c7]/30 text-[#f8f5f2] text-xs font-bold tracking-wider rounded-full hover:bg-white/10 transition-colors uppercase w-full sm:w-auto text-center"
            >
              Contact Page
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
