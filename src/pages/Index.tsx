import { HeroSection } from "@/components/HeroSection";
import { PalmAnalyzer } from "@/components/PalmAnalyzer";
import { Footer } from "@/components/Footer";
import { Helmet } from "react-helmet-async";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>PalmVeda - AI Palm Analysis for Job Suitability | Indian Astrology</title>
        <meta 
          name="description" 
          content="Discover candidate job suitability through AI-powered palm reading based on Samudrika Shastra. Analyze palm lines for career compatibility assessment." 
        />
      </Helmet>
      <div className="min-h-screen flex flex-col bg-background">
        <HeroSection />
        <main className="flex-1">
          <PalmAnalyzer />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
