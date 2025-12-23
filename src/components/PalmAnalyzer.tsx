import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ImageUpload } from "./ImageUpload";
import { JobRoleSelector } from "./JobRoleSelector";
import { AnalyzingLoader } from "./AnalyzingLoader";
import { AnalysisResults } from "./AnalysisResults";
import { usePalmAnalysis } from "@/hooks/usePalmAnalysis";
import { Sparkles, ChevronRight, ChevronLeft } from "lucide-react";

export function PalmAnalyzer() {
  const [step, setStep] = useState(1);
  const [palmImage, setPalmImage] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState("");
  
  const { isAnalyzing, result, analyzePalm, resetAnalysis } = usePalmAnalysis();

  const handleAnalyze = async () => {
    if (palmImage && selectedRole) {
      await analyzePalm(palmImage, selectedRole);
    }
  };

  const handleReset = () => {
    setStep(1);
    setPalmImage(null);
    setSelectedRole("");
    resetAnalysis();
  };

  // Show results if available
  if (result) {
    return (
      <section className="py-12 px-4">
        <div className="container max-w-5xl mx-auto">
          <AnalysisResults
            result={result}
            selectedRole={selectedRole}
            onReset={handleReset}
          />
        </div>
      </section>
    );
  }

  // Show analyzing state
  if (isAnalyzing) {
    return (
      <section className="py-12 px-4">
        <div className="container max-w-2xl mx-auto">
          <Card className="border-2 border-primary/20">
            <AnalyzingLoader />
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-4">
      <div className="container max-w-4xl mx-auto">
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <StepIndicator number={1} label="Upload Palm" isActive={step === 1} isCompleted={step > 1} />
          <div className="w-12 h-0.5 bg-border" />
          <StepIndicator number={2} label="Select Role" isActive={step === 2} isCompleted={step > 2} />
          <div className="w-12 h-0.5 bg-border" />
          <StepIndicator number={3} label="Get Results" isActive={step === 3} isCompleted={false} />
        </div>

        {/* Step Content */}
        <Card className="p-6 md:p-8 border-2 border-border">
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-display font-semibold mb-2">
                  Upload Palm Image
                </h2>
                <p className="text-muted-foreground">
                  Capture or upload a clear image of the candidate's palm
                </p>
              </div>
              
              <ImageUpload
                onImageSelect={(base64) => setPalmImage(base64)}
                selectedImage={palmImage}
                onClear={() => setPalmImage(null)}
              />
              
              <div className="flex justify-end pt-4">
                <Button
                  onClick={() => setStep(2)}
                  disabled={!palmImage}
                  size="lg"
                  className="gap-2"
                >
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-display font-semibold mb-2">
                  Select Job Role
                </h2>
                <p className="text-muted-foreground">
                  Choose the position the candidate is applying for
                </p>
              </div>
              
              <JobRoleSelector
                selectedRole={selectedRole}
                onRoleSelect={setSelectedRole}
              />
              
              <div className="flex justify-between pt-4">
                <Button
                  onClick={() => setStep(1)}
                  variant="outline"
                  size="lg"
                  className="gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </Button>
                <Button
                  onClick={handleAnalyze}
                  disabled={!selectedRole}
                  size="lg"
                  className="gap-2 bg-gradient-mystic hover:opacity-90"
                >
                  <Sparkles className="w-4 h-4" />
                  Analyze Palm
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Tips Section */}
        <div className="mt-8 p-6 rounded-lg bg-muted/50 border border-border">
          <h3 className="font-display font-semibold mb-3">📸 Tips for Best Results</h3>
          <ul className="grid md:grid-cols-2 gap-2 text-sm text-muted-foreground">
            <li>• Use good lighting to capture all palm lines clearly</li>
            <li>• Keep the palm flat and fully open</li>
            <li>• Capture the entire palm including fingers</li>
            <li>• Avoid shadows or reflections on the palm</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

interface StepIndicatorProps {
  number: number;
  label: string;
  isActive: boolean;
  isCompleted: boolean;
}

function StepIndicator({ number, label, isActive, isCompleted }: StepIndicatorProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
          isCompleted
            ? "bg-primary text-primary-foreground"
            : isActive
            ? "bg-gradient-mystic text-mystic-foreground ring-4 ring-primary/20"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {isCompleted ? "✓" : number}
      </div>
      <span className={`text-xs font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
        {label}
      </span>
    </div>
  );
}
