import { Loader2, Sparkles } from "lucide-react";

export function AnalyzingLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-8">
      <div className="relative">
        {/* Outer ring */}
        <div className="w-32 h-32 rounded-full border-4 border-primary/20 animate-pulse" />
        
        {/* Inner spinning ring */}
        <div className="absolute inset-0 w-32 h-32 rounded-full border-4 border-transparent border-t-primary animate-spin" />
        
        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-gradient-mystic flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-mystic-foreground animate-pulse" />
          </div>
        </div>
      </div>
      
      <h3 className="text-2xl font-display font-semibold mt-8 mb-3 text-gradient-mystic">
        Analyzing Your Palm
      </h3>
      
      <p className="text-muted-foreground text-center max-w-md">
        Our AI is examining the palm lines and mounts using ancient Samudrika Shastra principles...
      </p>
      
      <div className="flex items-center gap-2 mt-6 text-sm text-muted-foreground">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>This may take 15-30 seconds</span>
      </div>
    </div>
  );
}
