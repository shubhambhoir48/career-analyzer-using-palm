import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { PalmAnalysisResult, AnalysisResponse } from "@/types/palm-analysis";

export function usePalmAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<PalmAnalysisResult | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [shareId, setShareId] = useState<string | null>(null);
  const { toast } = useToast();

  const analyzePalm = useCallback(async (imageBase64: string, role: string) => {
    if (!imageBase64 || !role) {
      toast({
        title: "Missing Information",
        description: "Please upload a palm image and select a job role.",
        variant: "destructive",
      });
      return null;
    }

    setIsAnalyzing(true);
    setResult(null);
    setSelectedRole(role);
    setShareId(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-palm`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageBase64, selectedRole: role }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 429) {
          throw new Error("Rate limit exceeded. Please wait a moment and try again.");
        }
        if (response.status === 402) {
          throw new Error("Service temporarily unavailable. Please try again later.");
        }
        
        throw new Error(errorData.error || "Analysis failed. Please try again.");
      }

      const data: AnalysisResponse = await response.json();

      if (!data.success || !data.analysis) {
        throw new Error(data.error || "Unable to analyze palm. Please try with a clearer image.");
      }

      setResult(data.analysis);
      setShareId(data.shareId || null);
      
      toast({
        title: "Analysis Complete",
        description: `Compatibility score: ${data.analysis.compatibilityScore}%`,
      });

      return data.analysis;
    } catch (error) {
      console.error("Palm analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, [toast]);

  const resetAnalysis = useCallback(() => {
    setResult(null);
    setSelectedRole("");
    setShareId(null);
  }, []);

  return {
    isAnalyzing,
    result,
    selectedRole,
    shareId,
    analyzePalm,
    resetAnalysis,
  };
}
