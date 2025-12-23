import { Hand } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Hand className="w-5 h-5 text-primary" />
            <span className="font-display font-semibold">PalmVeda</span>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Based on Samudrika Shastra • Ancient Indian Palmistry Wisdom
          </p>
          <p className="text-xs text-muted-foreground">
            For informational purposes only
          </p>
        </div>
      </div>
    </footer>
  );
}
