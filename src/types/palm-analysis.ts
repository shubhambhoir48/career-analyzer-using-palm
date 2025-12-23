export interface PalmAnalysisResult {
  compatibilityScore: number;
  verdict: "Highly Suitable" | "Suitable" | "Moderately Suitable" | "Less Suitable" | "Not Recommended";
  palmLineAnalysis: {
    heartLine: { observation: string; interpretation: string };
    headLine: { observation: string; interpretation: string };
    lifeLine: { observation: string; interpretation: string };
    fateLine: { observation: string; interpretation: string };
    sunLine: { observation: string; interpretation: string };
    mercuryLine: { observation: string; interpretation: string };
  };
  personalityTraits: string[];
  strengths: string[];
  weaknesses: string[];
  alternativeRoles: Array<{
    role: string;
    compatibility: number;
    reason: string;
  }>;
  astrologicalReasoning: string;
}

export interface AnalysisResponse {
  success: boolean;
  analysis: PalmAnalysisResult;
  selectedRole: string;
  error?: string;
}

export const JOB_ROLES = {
  corporate: [
    { id: "Manager", label: "Manager", icon: "👔" },
    { id: "Software Developer", label: "Software Developer", icon: "💻" },
    { id: "Sales Executive", label: "Sales Executive", icon: "📊" },
    { id: "HR Professional", label: "HR Professional", icon: "🤝" },
    { id: "Finance Analyst", label: "Finance Analyst", icon: "📈" },
    { id: "Marketing Specialist", label: "Marketing Specialist", icon: "📣" },
    { id: "Operations Manager", label: "Operations Manager", icon: "⚙️" },
  ],
  industrySpecific: [
    { id: "Doctor", label: "Doctor", icon: "🩺" },
    { id: "Lawyer", label: "Lawyer", icon: "⚖️" },
    { id: "Engineer", label: "Engineer", icon: "🔧" },
    { id: "Teacher", label: "Teacher", icon: "📚" },
    { id: "Artist", label: "Artist", icon: "🎨" },
    { id: "Entrepreneur", label: "Entrepreneur", icon: "🚀" },
    { id: "Researcher", label: "Researcher", icon: "🔬" },
    { id: "Consultant", label: "Consultant", icon: "💼" },
  ],
} as const;
