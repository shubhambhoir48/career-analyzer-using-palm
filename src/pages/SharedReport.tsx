import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { PalmAnalysisResult } from "@/types/palm-analysis";
import { AnalysisResults } from "@/components/AnalysisResults";
import { Footer } from "@/components/Footer";
import { Loader2, AlertCircle, Hand } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SharedReport() {
  const { shareId } = useParams<{ shareId: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<{
    selected_role: string;
    compatibility_score: number;
    verdict: string;
    palm_line_analysis: PalmAnalysisResult["palmLineAnalysis"];
    personality_traits: string[];
    strengths: string[];
    weaknesses: string[];
    alternative_roles: PalmAnalysisResult["alternativeRoles"];
    astrological_reasoning: string;
    behavioral_analysis: PalmAnalysisResult["behavioralAnalysis"];
    workplace_dynamics: PalmAnalysisResult["workplaceDynamics"];
    career_growth: PalmAnalysisResult["careerGrowth"];
    work_capabilities: PalmAnalysisResult["workCapabilities"];
    job_change_analysis: PalmAnalysisResult["jobChangeAnalysis"];
    created_at: string;
  } | null>(null);

  useEffect(() => {
    async function fetchReport() {
      if (!shareId) {
        setError("Invalid share link");
        setLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from("palm_reports")
          .select("*")
          .eq("share_id", shareId)
          .single();

        if (fetchError) {
          console.error("Fetch error:", fetchError);
          setError("Report not found");
          return;
        }

        if (data) {
          setReport({
            selected_role: data.selected_role,
            compatibility_score: data.compatibility_score,
            verdict: data.verdict,
            palm_line_analysis: data.palm_line_analysis as unknown as PalmAnalysisResult["palmLineAnalysis"],
            personality_traits: data.personality_traits,
            strengths: data.strengths,
            weaknesses: data.weaknesses,
            alternative_roles: data.alternative_roles as unknown as PalmAnalysisResult["alternativeRoles"],
            astrological_reasoning: data.astrological_reasoning,
            behavioral_analysis: data.behavioral_analysis as unknown as PalmAnalysisResult["behavioralAnalysis"],
            workplace_dynamics: data.workplace_dynamics as unknown as PalmAnalysisResult["workplaceDynamics"],
            career_growth: data.career_growth as unknown as PalmAnalysisResult["careerGrowth"],
            work_capabilities: data.work_capabilities as unknown as PalmAnalysisResult["workCapabilities"],
            job_change_analysis: data.job_change_analysis as unknown as PalmAnalysisResult["jobChangeAnalysis"],
            created_at: data.created_at,
          });
        }
      } catch (err) {
        console.error("Error fetching report:", err);
        setError("Failed to load report");
      } finally {
        setLoading(false);
      }
    }

    fetchReport();
  }, [shareId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading report...</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="p-8 max-w-md text-center space-y-4">
          <AlertCircle className="w-16 h-16 mx-auto text-destructive" />
          <h1 className="text-2xl font-display font-bold">Report Not Found</h1>
          <p className="text-muted-foreground">
            {error || "This report may have been removed or the link is invalid."}
          </p>
          <Link to="/">
            <Button className="gap-2">
              <Hand className="w-4 h-4" />
              Create Your Own Analysis
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const analysisResult: PalmAnalysisResult = {
    compatibilityScore: report.compatibility_score,
    verdict: report.verdict as PalmAnalysisResult["verdict"],
    palmLineAnalysis: report.palm_line_analysis,
    personalityTraits: report.personality_traits,
    strengths: report.strengths,
    weaknesses: report.weaknesses,
    alternativeRoles: report.alternative_roles,
    astrologicalReasoning: report.astrological_reasoning,
    behavioralAnalysis: report.behavioral_analysis,
    workplaceDynamics: report.workplace_dynamics,
    careerGrowth: report.career_growth,
    workCapabilities: report.work_capabilities,
    jobChangeAnalysis: report.job_change_analysis,
  };

  return (
    <>
      <Helmet>
        <title>Palm Analysis Report - {report.selected_role} | Hasta Rekha</title>
        <meta
          name="description"
          content={`Palm analysis report for ${report.selected_role} role with ${report.compatibility_score}% compatibility score.`}
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-gradient-mystic text-white py-8">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Hand className="w-8 h-8" />
              <span className="text-2xl font-display font-bold">Hasta Rekha</span>
            </div>
            <p className="text-white/80">Palm Analysis Report</p>
            <p className="text-sm text-white/60 mt-2">
              Generated on {new Date(report.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </header>

        {/* Content */}
        <main className="container mx-auto px-4 py-8">
          <AnalysisResults
            result={analysisResult}
            selectedRole={report.selected_role}
            onReset={() => {}}
            isSharedView={true}
          />

          {/* CTA */}
          <div className="mt-12 text-center">
            <Card className="p-8 bg-gradient-warm border-primary/20">
              <h2 className="text-2xl font-display font-bold mb-4">
                Want to discover your own career destiny?
              </h2>
              <p className="text-muted-foreground mb-6">
                Get your personalized palm analysis based on ancient Indian palmistry
              </p>
              <Link to="/">
                <Button size="lg" className="gap-2 bg-gradient-mystic hover:opacity-90">
                  <Hand className="w-5 h-5" />
                  Analyze Your Palm
                </Button>
              </Link>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
