import { PalmAnalysisResult } from "@/types/palm-analysis";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  ArrowRight,
  RotateCcw,
  Download,
  Heart,
  Brain,
  Activity,
  Compass,
  Sun,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AnalysisResultsProps {
  result: PalmAnalysisResult;
  selectedRole: string;
  onReset: () => void;
}

export function AnalysisResults({ result, selectedRole, onReset }: AnalysisResultsProps) {
  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case "Highly Suitable":
        return "bg-success text-success-foreground";
      case "Suitable":
        return "bg-primary text-primary-foreground";
      case "Moderately Suitable":
        return "bg-warning text-warning-foreground";
      case "Less Suitable":
      case "Not Recommended":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-success";
    if (score >= 50) return "text-primary";
    if (score >= 25) return "text-warning";
    return "text-destructive";
  };

  const palmLineIcons = {
    heartLine: Heart,
    headLine: Brain,
    lifeLine: Activity,
    fateLine: Compass,
    sunLine: Sun,
    mercuryLine: MessageCircle,
  };

  const palmLineLabels = {
    heartLine: "Heart Line (Hridaya Rekha)",
    headLine: "Head Line (Mastika Rekha)",
    lifeLine: "Life Line (Jeevan Rekha)",
    fateLine: "Fate Line (Bhagya Rekha)",
    sunLine: "Sun Line (Surya Rekha)",
    mercuryLine: "Mercury Line (Budha Rekha)",
  };

  return (
    <div className="space-y-8">
      {/* Header with Score */}
      <Card className="p-8 bg-gradient-warm border-2 border-primary/20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="text-center lg:text-left">
            <p className="text-sm text-muted-foreground mb-2">Analysis for</p>
            <h2 className="text-3xl font-display font-bold text-foreground">
              {selectedRole}
            </h2>
            <Badge className={cn("mt-3", getVerdictColor(result.verdict))}>
              {result.verdict}
            </Badge>
          </div>
          
          <div className="text-center">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="12"
                  className="text-muted"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="12"
                  strokeDasharray={440}
                  strokeDashoffset={440 - (440 * result.compatibilityScore) / 100}
                  strokeLinecap="round"
                  className={getScoreColor(result.compatibilityScore)}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={cn("text-4xl font-display font-bold", getScoreColor(result.compatibilityScore))}>
                  {result.compatibilityScore}%
                </span>
                <span className="text-sm text-muted-foreground">Match</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Palm Line Analysis */}
      <Card className="p-6">
        <h3 className="text-xl font-display font-semibold mb-6 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-mystic/10 flex items-center justify-center">
            🖐️
          </span>
          Palm Line Analysis
        </h3>
        <div className="grid gap-4">
          {Object.entries(result.palmLineAnalysis).map(([key, value]) => {
            const Icon = palmLineIcons[key as keyof typeof palmLineIcons];
            const label = palmLineLabels[key as keyof typeof palmLineLabels];
            return (
              <div key={key} className="p-4 rounded-lg bg-muted/50 border border-border">
                <div className="flex items-center gap-3 mb-2">
                  <Icon className="w-5 h-5 text-primary" />
                  <h4 className="font-semibold">{label}</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>Observation:</strong> {value.observation}
                </p>
                <p className="text-sm">
                  <strong>Interpretation:</strong> {value.interpretation}
                </p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Personality & Traits */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-gold" />
            Personality Traits
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.personalityTraits.map((trait, index) => (
              <Badge key={index} variant="secondary" className="px-3 py-1">
                {trait}
              </Badge>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              Strengths
            </h3>
            <ul className="space-y-2">
              {result.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                  {strength}
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-warning" />
              Areas of Caution
            </h3>
            <ul className="space-y-2">
              {result.weaknesses.map((weakness, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <XCircle className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
                  {weakness}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      {/* Alternative Roles */}
      <Card className="p-6">
        <h3 className="text-xl font-display font-semibold mb-6 flex items-center gap-2">
          <ArrowRight className="w-5 h-5 text-primary" />
          Alternative Suitable Roles
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {result.alternativeRoles.map((alt, index) => (
            <Card key={index} className="p-4 bg-muted/30">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">{alt.role}</h4>
                <Badge variant="outline" className={getScoreColor(alt.compatibility)}>
                  {alt.compatibility}%
                </Badge>
              </div>
              <Progress value={alt.compatibility} className="h-2 mb-2" />
              <p className="text-sm text-muted-foreground">{alt.reason}</p>
            </Card>
          ))}
        </div>
      </Card>

      {/* Astrological Reasoning */}
      <Card className="p-6 bg-mystic/5 border-mystic/20">
        <h3 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
          <span className="text-xl">✨</span>
          Samudrika Shastra Insight
        </h3>
        <p className="text-muted-foreground italic leading-relaxed">
          "{result.astrologicalReasoning}"
        </p>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
        <Button onClick={onReset} variant="outline" size="lg" className="gap-2">
          <RotateCcw className="w-4 h-4" />
          Analyze Another Palm
        </Button>
        <Button size="lg" className="gap-2 bg-gradient-mystic hover:opacity-90">
          <Download className="w-4 h-4" />
          Download Report
        </Button>
      </div>
    </div>
  );
}
