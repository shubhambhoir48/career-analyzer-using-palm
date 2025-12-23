import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/ImageUpload";
import { JobRoleSelector } from "@/components/JobRoleSelector";
import { AnalyzingLoader } from "@/components/AnalyzingLoader";
import { AnalysisResults } from "@/components/AnalysisResults";
import { usePalmAnalysis } from "@/hooks/usePalmAnalysis";
import { Sparkles, ChevronRight, ChevronLeft, CreditCard, ExternalLink } from "lucide-react";

// Razorpay Payment Page URL
const RAZORPAY_PAYMENT_PAGE_URL = "https://rzp.io/rzp/CSm4KaL";

export function GenerateReport() {
  const [step, setStep] = useState(1);
  const [palmImage, setPalmImage] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [hasPaid, setHasPaid] = useState(false);
  
  const { isAnalyzing, result, shareId, analyzePalm, resetAnalysis } = usePalmAnalysis();

  const handlePayment = () => {
    if (!RAZORPAY_PAYMENT_PAGE_URL) {
      alert("Payment page URL not configured. Please contact support.");
      return;
    }
    
    // Store current state in sessionStorage before redirecting
    sessionStorage.setItem("palmveda_pending_analysis", JSON.stringify({
      palmImage,
      selectedRole,
    }));
    
    // Redirect to Razorpay Payment Page
    // The payment page should redirect back to /dashboard?payment=success&razorpay_payment_id=xxx
    window.location.href = RAZORPAY_PAYMENT_PAGE_URL;
  };

  const handleAnalyze = async () => {
    if (palmImage && selectedRole) {
      await analyzePalm(palmImage, selectedRole);
    }
  };

  const handleReset = () => {
    setStep(1);
    setPalmImage(null);
    setSelectedRole("");
    setHasPaid(false);
    resetAnalysis();
    sessionStorage.removeItem("palmveda_pending_analysis");
  };

  // Restore state after payment redirect
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentSuccess = urlParams.get("payment") === "success";
    const pending = sessionStorage.getItem("palmveda_pending_analysis");
    
    if (pending && paymentSuccess) {
      try {
        const { palmImage: savedImage, selectedRole: savedRole } = JSON.parse(pending);
        if (savedImage) setPalmImage(savedImage);
        if (savedRole) setSelectedRole(savedRole);
        setStep(3); // Move to payment step
        setHasPaid(true); // Mark as paid
        sessionStorage.removeItem("palmveda_pending_analysis");
      } catch (e) {
        console.error("Failed to restore pending analysis:", e);
      }
    }
  }, []);

  // Show results if available
  if (result) {
    return (
      <Card className="border-2 border-border">
        <CardContent className="pt-6">
          <AnalysisResults
            result={result}
            selectedRole={selectedRole}
            onReset={handleReset}
            shareId={shareId}
          />
        </CardContent>
      </Card>
    );
  }

  // Show analyzing state
  if (isAnalyzing) {
    return (
      <Card className="border-2 border-primary/20">
        <AnalyzingLoader />
      </Card>
    );
  }

  return (
    <Card className="border-2 border-border">
      <CardHeader>
        <CardTitle className="font-display">Generate New Report</CardTitle>
        <CardDescription>
          Upload a palm image and select a job role to get your analysis
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <StepIndicator number={1} label="Upload" isActive={step === 1} isCompleted={step > 1} />
          <div className="w-8 h-0.5 bg-border" />
          <StepIndicator number={2} label="Role" isActive={step === 2} isCompleted={step > 2} />
          <div className="w-8 h-0.5 bg-border" />
          <StepIndicator number={3} label="Pay" isActive={step === 3} isCompleted={step > 3} />
          <div className="w-8 h-0.5 bg-border" />
          <StepIndicator number={4} label="Result" isActive={step === 4} isCompleted={false} />
        </div>

        {/* Step 1: Upload Palm */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-display font-semibold mb-2">Upload Palm Image</h3>
              <p className="text-muted-foreground text-sm">
                Capture or upload a clear image of the palm
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
                className="gap-2"
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Select Role */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-display font-semibold mb-2">Select Job Role</h3>
              <p className="text-muted-foreground text-sm">
                Choose the position for analysis
              </p>
            </div>
            
            <JobRoleSelector
              selectedRole={selectedRole}
              onRoleSelect={setSelectedRole}
            />
            
            <div className="flex justify-between pt-4">
              <Button onClick={() => setStep(1)} variant="outline" className="gap-2">
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={!selectedRole}
                className="gap-2"
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Payment */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-display font-semibold mb-2">Complete Payment</h3>
              <p className="text-muted-foreground text-sm">
                Pay ₹21 to generate your palm analysis report
              </p>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-6 text-center">
              <div className="text-4xl font-display font-bold text-primary mb-2">₹21</div>
              <p className="text-sm text-muted-foreground mb-6">One-time payment per report</p>
              
              {!hasPaid ? (
                <Button
                  onClick={handlePayment}
                  size="lg"
                  className="gap-2 bg-gradient-mystic hover:opacity-90"
                >
                  <CreditCard className="w-5 h-5" />
                  Pay with Razorpay
                  <ExternalLink className="w-4 h-4" />
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="text-success font-semibold">✓ Payment Received</div>
                  <Button
                    onClick={handleAnalyze}
                    size="lg"
                    className="gap-2 bg-gradient-mystic hover:opacity-90"
                  >
                    <Sparkles className="w-5 h-5" />
                    Generate Report
                  </Button>
                </div>
              )}
            </div>
            
            <div className="flex justify-between pt-4">
              <Button onClick={() => setStep(2)} variant="outline" className="gap-2">
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>
            </div>
            
            <p className="text-xs text-center text-muted-foreground">
              Secure payment powered by Razorpay. Your payment information is encrypted.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
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
    <div className="flex flex-col items-center gap-1">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
          isCompleted
            ? "bg-primary text-primary-foreground"
            : isActive
            ? "bg-gradient-mystic text-mystic-foreground ring-2 ring-primary/20"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {isCompleted ? "✓" : number}
      </div>
      <span className={`text-xs ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
        {label}
      </span>
    </div>
  );
}
