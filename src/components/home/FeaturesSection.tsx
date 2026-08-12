import { Award, Feather, MessageCircle, Truck } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: <Award className="w-6 h-6 text-primary" />,
      title: "Premium Craft",
      description: "Handcrafted intricate designs with attention to detail.",
    },
    {
      icon: <Feather className="w-6 h-6 text-primary" />,
      title: "Lightweight Comfort",
      description: "Designed for the modern muse without a second thought.",
    },
    {
      icon: <MessageCircle className="w-6 h-6 text-primary" />,
      title: "WhatsApp Ordering",
      description: "A simple, personalized ordering experience via WhatsApp.",
    },
    {
      icon: <Truck className="w-6 h-6 text-primary" />,
      title: "Pan-India Delivery",
      description: "Carefully packaged and shipped safely across the country.",
    },
  ];

  return (
    <section className="bg-background py-16 border-t border-b border-border/50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl text-heading mb-2">Why choose muse by Kashish</h2>
          <p className="text-foreground/70 text-sm">Crafted for the woman who owns the room.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="flex flex-col items-center text-center max-w-xs mx-auto">
              <div className="w-16 h-16 rounded-full bg-secondary/30 flex items-center justify-center mb-6 border border-secondary/50">
                {feature.icon}
              </div>
              <h3 className="font-serif text-xl text-heading mb-3">{feature.title}</h3>
              <p className="text-sm text-foreground/80 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
