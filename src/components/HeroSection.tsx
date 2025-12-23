import { Hand, Sparkles, Eye } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-warm" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-mystic/10 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }} />
      
      <div className="container relative z-10 mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mystic/10 text-mystic mb-8">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Powered by Samudrika Shastra</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight mb-6">
            <span className="text-gradient-mystic">Vedic Palm Analysis</span>
            <br />
            <span className="text-foreground">for Career Suitability</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground font-body leading-relaxed mb-10 max-w-2xl mx-auto">
            Discover if a candidate's destiny aligns with their desired role through the ancient wisdom of Indian palmistry
          </p>
          
          <div className="flex flex-wrap justify-center gap-8 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Hand className="w-5 h-5 text-primary" />
              <span>AI-Powered Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-mystic" />
              <span>6 Major Palm Lines</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold" />
              <span>Comprehensive Report</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
