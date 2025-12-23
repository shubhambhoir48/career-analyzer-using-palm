import { PalmAnalysisResult } from "@/types/palm-analysis";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Users,
  TrendingUp,
  Briefcase,
  RefreshCw,
  Share2,
  Copy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { jsPDF } from "jspdf";
import { useToast } from "@/hooks/use-toast";

interface AnalysisResultsProps {
  result: PalmAnalysisResult;
  selectedRole: string;
  onReset: () => void;
  shareId?: string | null;
  isSharedView?: boolean;
}

export function AnalysisResults({ result, selectedRole, onReset, shareId, isSharedView = false }: AnalysisResultsProps) {
  const { toast } = useToast();

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

  const copyShareLink = () => {
    if (shareId) {
      const url = `${window.location.origin}/report/${shareId}`;
      navigator.clipboard.writeText(url);
      toast({
        title: "Link Copied!",
        description: "Share link has been copied to clipboard.",
      });
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - 2 * margin;
    let yPos = 20;

    // Helper function to add wrapped text
    const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 10) => {
      doc.setFontSize(fontSize);
      const lines = doc.splitTextToSize(text, maxWidth);
      doc.text(lines, x, y);
      return y + (lines.length * fontSize * 0.4);
    };

    // Helper function to check page break
    const checkPageBreak = (requiredSpace: number) => {
      if (yPos + requiredSpace > 280) {
        doc.addPage();
        yPos = 20;
      }
    };

    // Title
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("Hasta Rekha - Palm Analysis Report", margin, yPos);
    yPos += 15;

    // Role and Score
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text(`Role: ${selectedRole}`, margin, yPos);
    yPos += 8;
    doc.text(`Compatibility Score: ${result.compatibilityScore}%`, margin, yPos);
    yPos += 8;
    doc.text(`Verdict: ${result.verdict}`, margin, yPos);
    yPos += 15;

    // Palm Line Analysis
    checkPageBreak(60);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Palm Line Analysis", margin, yPos);
    yPos += 10;

    doc.setFont("helvetica", "normal");
    Object.entries(result.palmLineAnalysis).forEach(([key, value]) => {
      checkPageBreak(20);
      const label = palmLineLabels[key as keyof typeof palmLineLabels];
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(label, margin, yPos);
      yPos += 6;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      yPos = addWrappedText(`Observation: ${value.observation}`, margin, yPos, contentWidth, 9);
      yPos += 2;
      yPos = addWrappedText(`Interpretation: ${value.interpretation}`, margin, yPos, contentWidth, 9);
      yPos += 8;
    });

    // Personality Traits
    checkPageBreak(30);
    yPos += 5;
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Personality Traits", margin, yPos);
    yPos += 8;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(result.personalityTraits.join(", "), margin, yPos);
    yPos += 10;

    // Strengths
    checkPageBreak(30);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Strengths", margin, yPos);
    yPos += 8;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    result.strengths.forEach((strength) => {
      doc.text(`• ${strength}`, margin, yPos);
      yPos += 6;
    });
    yPos += 5;

    // Weaknesses
    checkPageBreak(30);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Areas of Caution", margin, yPos);
    yPos += 8;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    result.weaknesses.forEach((weakness) => {
      doc.text(`• ${weakness}`, margin, yPos);
      yPos += 6;
    });
    yPos += 10;

    // Behavioral Analysis
    checkPageBreak(60);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Behavioral Analysis", margin, yPos);
    yPos += 10;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    yPos = addWrappedText(`Overall Behavior: ${result.behavioralAnalysis.overallBehavior}`, margin, yPos, contentWidth);
    yPos += 4;
    yPos = addWrappedText(`Emotional Intelligence: ${result.behavioralAnalysis.emotionalIntelligence}`, margin, yPos, contentWidth);
    yPos += 4;
    yPos = addWrappedText(`Stress Response: ${result.behavioralAnalysis.stressResponse}`, margin, yPos, contentWidth);
    yPos += 4;
    yPos = addWrappedText(`Adaptability: ${result.behavioralAnalysis.adaptability}`, margin, yPos, contentWidth);
    yPos += 4;
    yPos = addWrappedText(`Decision Making: ${result.behavioralAnalysis.decisionMakingStyle}`, margin, yPos, contentWidth);
    yPos += 10;

    // Workplace Dynamics
    checkPageBreak(60);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Workplace Dynamics", margin, yPos);
    yPos += 10;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    yPos = addWrappedText(`Colleague Relations: ${result.workplaceDynamics.relationshipWithColleagues}`, margin, yPos, contentWidth);
    yPos += 4;
    yPos = addWrappedText(`Teamwork: ${result.workplaceDynamics.teamworkCapability}`, margin, yPos, contentWidth);
    yPos += 4;
    yPos = addWrappedText(`Leadership Potential: ${result.workplaceDynamics.leadershipPotential}`, margin, yPos, contentWidth);
    yPos += 4;
    yPos = addWrappedText(`Communication: ${result.workplaceDynamics.communicationStyle}`, margin, yPos, contentWidth);
    yPos += 4;
    yPos = addWrappedText(`Conflict Resolution: ${result.workplaceDynamics.conflictResolution}`, margin, yPos, contentWidth);
    yPos += 10;

    // Career Growth
    checkPageBreak(60);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Career Growth Analysis", margin, yPos);
    yPos += 10;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    yPos = addWrappedText(`Growth Potential: ${result.careerGrowth.growthPotential}`, margin, yPos, contentWidth);
    yPos += 4;
    yPos = addWrappedText(`Career Trajectory: ${result.careerGrowth.careerTrajectory}`, margin, yPos, contentWidth);
    yPos += 4;
    yPos = addWrappedText(`Timeline: ${result.careerGrowth.timelineProjection}`, margin, yPos, contentWidth);
    yPos += 6;
    doc.setFont("helvetica", "bold");
    doc.text("Hurdles:", margin, yPos);
    yPos += 5;
    doc.setFont("helvetica", "normal");
    result.careerGrowth.hurdles.forEach((hurdle) => {
      doc.text(`• ${hurdle}`, margin + 5, yPos);
      yPos += 5;
    });
    yPos += 3;
    doc.setFont("helvetica", "bold");
    doc.text("Success Factors:", margin, yPos);
    yPos += 5;
    doc.setFont("helvetica", "normal");
    result.careerGrowth.successFactors.forEach((factor) => {
      doc.text(`• ${factor}`, margin + 5, yPos);
      yPos += 5;
    });
    yPos += 10;

    // Work Capabilities
    checkPageBreak(50);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Work Capabilities", margin, yPos);
    yPos += 10;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    yPos = addWrappedText(`Ideal Work Environment: ${result.workCapabilities.idealWorkEnvironment}`, margin, yPos, contentWidth);
    yPos += 4;
    yPos = addWrappedText(`Productivity Peaks: ${result.workCapabilities.productivityPeaks}`, margin, yPos, contentWidth);
    yPos += 6;
    doc.text("Best Task Types: " + result.workCapabilities.bestTaskTypes.join(", "), margin, yPos);
    yPos += 6;
    doc.text("Areas of Excellence: " + result.workCapabilities.areasOfExcellence.join(", "), margin, yPos);
    yPos += 10;

    // Job Change Analysis
    checkPageBreak(50);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Job Change Analysis", margin, yPos);
    yPos += 10;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Likelihood to Change: ${result.jobChangeAnalysis.likelihoodToChange}`, margin, yPos);
    yPos += 6;
    yPos = addWrappedText(`Ideal Next Role: ${result.jobChangeAnalysis.idealNextRole}`, margin, yPos, contentWidth);
    yPos += 4;
    yPos = addWrappedText(`Loyalty Indicators: ${result.jobChangeAnalysis.loyaltyIndicators}`, margin, yPos, contentWidth);
    yPos += 6;
    doc.text("Reasons for Potential Change:", margin, yPos);
    yPos += 5;
    result.jobChangeAnalysis.reasonsForChange.forEach((reason) => {
      yPos = addWrappedText(`• ${reason}`, margin + 5, yPos, contentWidth - 10);
      yPos += 2;
    });
    yPos += 5;
    doc.text("Retention Factors:", margin, yPos);
    yPos += 5;
    result.jobChangeAnalysis.retentionFactors.forEach((factor) => {
      yPos = addWrappedText(`• ${factor}`, margin + 5, yPos, contentWidth - 10);
      yPos += 2;
    });
    yPos += 10;

    // Alternative Roles
    checkPageBreak(40);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Alternative Suitable Roles", margin, yPos);
    yPos += 10;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    result.alternativeRoles.forEach((alt) => {
      doc.text(`${alt.role} (${alt.compatibility}%): ${alt.reason}`, margin, yPos);
      yPos += 6;
    });
    yPos += 10;

    // Astrological Reasoning
    checkPageBreak(30);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Samudrika Shastra Insight", margin, yPos);
    yPos += 8;
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    yPos = addWrappedText(result.astrologicalReasoning, margin, yPos, contentWidth);

    // Footer
    doc.addPage();
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Generated by Hasta Rekha - Palm Analysis for Job Suitability", margin, 20);
    doc.text(`Report Date: ${new Date().toLocaleDateString()}`, margin, 28);

    // Save the PDF
    doc.save(`palm-analysis-${selectedRole.toLowerCase().replace(/\s+/g, "-")}.pdf`);

    toast({
      title: "PDF Downloaded",
      description: "Your palm analysis report has been saved.",
    });
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

      {/* Share Button */}
      {shareId && !isSharedView && (
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Share this report</span>
            </div>
            <div className="flex items-center gap-2">
              <code className="text-xs bg-muted px-3 py-1 rounded">
                {window.location.origin}/report/{shareId}
              </code>
              <Button size="sm" variant="outline" onClick={copyShareLink} className="gap-1">
                <Copy className="w-3 h-3" />
                Copy
              </Button>
            </div>
          </div>
        </Card>
      )}

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

      {/* Behavioral Analysis */}
      <Card className="p-6">
        <h3 className="text-xl font-display font-semibold mb-6 flex items-center gap-2">
          <Brain className="w-6 h-6 text-primary" />
          Behavioral Analysis
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <h4 className="font-semibold mb-2">Overall Behavior</h4>
            <p className="text-sm text-muted-foreground">{result.behavioralAnalysis.overallBehavior}</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <h4 className="font-semibold mb-2">Emotional Intelligence</h4>
            <p className="text-sm text-muted-foreground">{result.behavioralAnalysis.emotionalIntelligence}</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <h4 className="font-semibold mb-2">Stress Response</h4>
            <p className="text-sm text-muted-foreground">{result.behavioralAnalysis.stressResponse}</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <h4 className="font-semibold mb-2">Adaptability</h4>
            <p className="text-sm text-muted-foreground">{result.behavioralAnalysis.adaptability}</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50 border border-border md:col-span-2">
            <h4 className="font-semibold mb-2">Decision Making Style</h4>
            <p className="text-sm text-muted-foreground">{result.behavioralAnalysis.decisionMakingStyle}</p>
          </div>
        </div>
      </Card>

      {/* Workplace Dynamics */}
      <Card className="p-6">
        <h3 className="text-xl font-display font-semibold mb-6 flex items-center gap-2">
          <Users className="w-6 h-6 text-primary" />
          Workplace Dynamics
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <h4 className="font-semibold mb-2">Relationship with Colleagues</h4>
            <p className="text-sm text-muted-foreground">{result.workplaceDynamics.relationshipWithColleagues}</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <h4 className="font-semibold mb-2">Teamwork Capability</h4>
            <p className="text-sm text-muted-foreground">{result.workplaceDynamics.teamworkCapability}</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <h4 className="font-semibold mb-2">Leadership Potential</h4>
            <p className="text-sm text-muted-foreground">{result.workplaceDynamics.leadershipPotential}</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <h4 className="font-semibold mb-2">Communication Style</h4>
            <p className="text-sm text-muted-foreground">{result.workplaceDynamics.communicationStyle}</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50 border border-border md:col-span-2">
            <h4 className="font-semibold mb-2">Conflict Resolution</h4>
            <p className="text-sm text-muted-foreground">{result.workplaceDynamics.conflictResolution}</p>
          </div>
        </div>
      </Card>

      {/* Career Growth */}
      <Card className="p-6">
        <h3 className="text-xl font-display font-semibold mb-6 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-primary" />
          Career Growth Analysis
        </h3>
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-success/10 border border-success/20">
            <h4 className="font-semibold mb-2 text-success">Growth Potential</h4>
            <p className="text-sm">{result.careerGrowth.growthPotential}</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <h4 className="font-semibold mb-2">Career Trajectory</h4>
            <p className="text-sm text-muted-foreground">{result.careerGrowth.careerTrajectory}</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <h4 className="font-semibold mb-2">Timeline Projection</h4>
            <p className="text-sm text-muted-foreground">{result.careerGrowth.timelineProjection}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
              <h4 className="font-semibold mb-3 text-warning flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Career Hurdles
              </h4>
              <ul className="space-y-2">
                {result.careerGrowth.hurdles.map((hurdle, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <XCircle className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
                    {hurdle}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-success/10 border border-success/20">
              <h4 className="font-semibold mb-3 text-success flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Success Factors
              </h4>
              <ul className="space-y-2">
                {result.careerGrowth.successFactors.map((factor, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                    {factor}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Card>

      {/* Work Capabilities */}
      <Card className="p-6">
        <h3 className="text-xl font-display font-semibold mb-6 flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-primary" />
          Work Capabilities
        </h3>
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <h4 className="font-semibold mb-2">Ideal Work Environment</h4>
              <p className="text-sm text-muted-foreground">{result.workCapabilities.idealWorkEnvironment}</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <h4 className="font-semibold mb-2">Productivity Peaks</h4>
              <p className="text-sm text-muted-foreground">{result.workCapabilities.productivityPeaks}</p>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <h4 className="font-semibold mb-3">Best Task Types</h4>
            <div className="flex flex-wrap gap-2">
              {result.workCapabilities.bestTaskTypes.map((task, index) => (
                <Badge key={index} variant="secondary">{task}</Badge>
              ))}
            </div>
          </div>
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <h4 className="font-semibold mb-3">Skills to Leverage</h4>
            <div className="flex flex-wrap gap-2">
              {result.workCapabilities.skillsToLeverage.map((skill, index) => (
                <Badge key={index} variant="outline" className="border-primary text-primary">{skill}</Badge>
              ))}
            </div>
          </div>
          <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
            <h4 className="font-semibold mb-3 text-primary">Areas of Excellence</h4>
            <div className="flex flex-wrap gap-2">
              {result.workCapabilities.areasOfExcellence.map((area, index) => (
                <Badge key={index} className="bg-primary">{area}</Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Job Change Analysis */}
      <Card className="p-6">
        <h3 className="text-xl font-display font-semibold mb-6 flex items-center gap-2">
          <RefreshCw className="w-6 h-6 text-primary" />
          Job Change Analysis
        </h3>
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <h4 className="font-semibold mb-2">Likelihood to Change Jobs</h4>
            <p className="text-lg font-medium text-primary">{result.jobChangeAnalysis.likelihoodToChange}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <h4 className="font-semibold mb-2">Ideal Next Role</h4>
              <p className="text-sm text-muted-foreground">{result.jobChangeAnalysis.idealNextRole}</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <h4 className="font-semibold mb-2">Loyalty Indicators</h4>
              <p className="text-sm text-muted-foreground">{result.jobChangeAnalysis.loyaltyIndicators}</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
              <h4 className="font-semibold mb-3 text-warning">Potential Reasons for Change</h4>
              <ul className="space-y-2">
                {result.jobChangeAnalysis.reasonsForChange.map((reason, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <ArrowRight className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-success/10 border border-success/20">
              <h4 className="font-semibold mb-3 text-success">Retention Factors</h4>
              <ul className="space-y-2">
                {result.jobChangeAnalysis.retentionFactors.map((factor, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                    {factor}
                  </li>
                ))}
              </ul>
            </div>
          </div>
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
      {!isSharedView && (
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button onClick={onReset} variant="outline" size="lg" className="gap-2">
            <RotateCcw className="w-4 h-4" />
            Analyze Another Palm
          </Button>
          <Button onClick={downloadPDF} size="lg" className="gap-2 bg-gradient-mystic hover:opacity-90">
            <Download className="w-4 h-4" />
            Download Report
          </Button>
        </div>
      )}
    </div>
  );
}
