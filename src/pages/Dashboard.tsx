import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/contexts/AuthContext";
import { Hand, FileText, Settings, LogOut, Loader2 } from "lucide-react";
import { GenerateReport } from "@/components/dashboard/GenerateReport";
import { PreviousReports } from "@/components/dashboard/PreviousReports";
import { AccountSettings } from "@/components/dashboard/AccountSettings";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { user, loading, signOut, isAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("generate");

  // Handle payment success redirect
  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    const paymentId = searchParams.get("razorpay_payment_id");
    
    if (paymentStatus === "success" && paymentId) {
      toast({
        title: "Payment Successful!",
        description: "Your payment has been received. You can now generate your report.",
      });
      // Clear the URL params
      navigate("/dashboard", { replace: true });
    }
  }, [searchParams, toast, navigate]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [loading, isAuthenticated, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Dashboard | PalmVeda</title>
        <meta name="description" content="Access your PalmVeda dashboard to generate palm analysis reports and manage your account." />
      </Helmet>

      <div className="min-h-screen bg-gradient-warm">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
              <div className="p-2 rounded-full bg-gradient-mystic">
                <Hand className="w-5 h-5 text-mystic-foreground" />
              </div>
              <span className="font-display text-xl font-semibold">PalmVeda</span>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground hidden sm:block">
                {user.email}
              </span>
              <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container max-w-6xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-display font-semibold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Generate new palm analysis reports and view your history
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="generate" className="gap-2">
                <Hand className="w-4 h-4" />
                <span className="hidden sm:inline">Generate</span>
              </TabsTrigger>
              <TabsTrigger value="reports" className="gap-2">
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Reports</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2">
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="generate">
              <GenerateReport />
            </TabsContent>

            <TabsContent value="reports">
              <PreviousReports />
            </TabsContent>

            <TabsContent value="settings">
              <AccountSettings />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </>
  );
}
