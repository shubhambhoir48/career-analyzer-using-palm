import { useCallback, useState } from "react";
import { Upload, Camera, X, Hand } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  onImageSelect: (base64: string) => void;
  selectedImage: string | null;
  onClear: () => void;
}

export function ImageUpload({ onImageSelect, selectedImage, onClear }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      onImageSelect(base64);
    };
    reader.readAsDataURL(file);
  }, [onImageSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  if (selectedImage) {
    return (
      <Card className="relative overflow-hidden bg-card border-2 border-primary/20">
        <Button
          variant="destructive"
          size="icon"
          className="absolute top-3 right-3 z-10 rounded-full"
          onClick={onClear}
        >
          <X className="w-4 h-4" />
        </Button>
        <div className="aspect-square max-h-80 overflow-hidden flex items-center justify-center bg-muted/50">
          <img
            src={selectedImage}
            alt="Uploaded palm"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="p-4 text-center border-t border-border">
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            <Hand className="w-4 h-4 text-primary" />
            Palm image uploaded successfully
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "relative border-2 border-dashed transition-all duration-300 cursor-pointer",
        isDragging
          ? "border-primary bg-primary/5 scale-[1.02]"
          : "border-border hover:border-primary/50 hover:bg-muted/50"
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <label className="block cursor-pointer">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleInputChange}
        />
        <div className="flex flex-col items-center justify-center py-16 px-8">
          <div className="w-20 h-20 rounded-full bg-gradient-mystic flex items-center justify-center mb-6 animate-float">
            <Upload className="w-10 h-10 text-mystic-foreground" />
          </div>
          <h3 className="text-xl font-display font-semibold mb-2">
            Upload Palm Image
          </h3>
          <p className="text-muted-foreground text-center mb-6 max-w-xs">
            Drag and drop your palm image here, or click to browse
          </p>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" className="gap-2">
              <Upload className="w-4 h-4" />
              Browse Files
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Camera className="w-4 h-4" />
              Take Photo
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-6">
            Supports JPG, PNG, WEBP • Max 10MB
          </p>
        </div>
      </label>
    </Card>
  );
}
