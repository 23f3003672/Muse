import { Star } from "lucide-react";

export default function TestimonialsSection() {
  const testimonials = [
    {
      text: "The peacock earrings are even prettier in person. So light! Forget I am wearing them!",
      author: "Ananya S.",
      location: "Mumbai"
    },
    {
      text: "Ordered the bridal set for my sister. She didn't take them off all night. So premium.",
      author: "Sneha R.",
      location: "Delhi"
    },
    {
      text: "Beautiful packaging and the quality feels far above the price. My new go-to brand.",
      author: "Divya M.",
      location: "Bangalore"
    }
  ];

  return (
    <section className="container mx-auto px-4 md:px-8 py-20">
      <div className="text-center mb-16">
        <h2 className="font-serif text-3xl text-heading mb-2">Loved by our muses</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((test, idx) => (
          <div key={idx} className="p-8 border border-border rounded-lg bg-surface flex flex-col">
            <div className="flex gap-1 mb-6 text-primary">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="font-serif text-lg text-heading italic mb-8 flex-1 leading-relaxed">
              "{test.text}"
            </p>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-serif text-sm">
                {test.author.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-heading">{test.author}</p>
                <p className="text-xs text-foreground/70">{test.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
