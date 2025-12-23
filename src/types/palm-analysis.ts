export interface BehavioralAnalysis {
  overallBehavior: string;
  emotionalIntelligence: string;
  stressResponse: string;
  adaptability: string;
  decisionMakingStyle: string;
}

export interface WorkplaceDynamics {
  relationshipWithColleagues: string;
  teamworkCapability: string;
  leadershipPotential: string;
  communicationStyle: string;
  conflictResolution: string;
}

export interface CareerGrowth {
  growthPotential: string;
  careerTrajectory: string;
  hurdles: string[];
  successFactors: string[];
  timelineProjection: string;
}

export interface WorkCapabilities {
  bestTaskTypes: string[];
  idealWorkEnvironment: string;
  productivityPeaks: string;
  skillsToLeverage: string[];
  areasOfExcellence: string[];
}

export interface JobChangeAnalysis {
  likelihoodToChange: string;
  reasonsForChange: string[];
  idealNextRole: string;
  retentionFactors: string[];
  loyaltyIndicators: string;
}

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
  // Extended analysis
  behavioralAnalysis: BehavioralAnalysis;
  workplaceDynamics: WorkplaceDynamics;
  careerGrowth: CareerGrowth;
  workCapabilities: WorkCapabilities;
  jobChangeAnalysis: JobChangeAnalysis;
}

export interface AnalysisResponse {
  success: boolean;
  analysis: PalmAnalysisResult;
  selectedRole: string;
  shareId?: string;
  error?: string;
}

export const JOB_ROLES = {
  executive: [
    { id: "CEO", label: "CEO / Managing Director", icon: "👑" },
    { id: "CTO", label: "CTO / Chief Technology Officer", icon: "💡" },
    { id: "CFO", label: "CFO / Chief Financial Officer", icon: "💰" },
    { id: "COO", label: "COO / Chief Operating Officer", icon: "⚙️" },
    { id: "CMO", label: "CMO / Chief Marketing Officer", icon: "📢" },
    { id: "CHRO", label: "CHRO / Chief HR Officer", icon: "👥" },
    { id: "CIO", label: "CIO / Chief Information Officer", icon: "🖥️" },
    { id: "VP", label: "Vice President", icon: "🏛️" },
    { id: "Director", label: "Director", icon: "📋" },
  ],
  management: [
    { id: "General Manager", label: "General Manager", icon: "🎯" },
    { id: "Project Manager", label: "Project Manager", icon: "📊" },
    { id: "Product Manager", label: "Product Manager", icon: "🚀" },
    { id: "Operations Manager", label: "Operations Manager", icon: "⚙️" },
    { id: "HR Manager", label: "HR Manager", icon: "🤝" },
    { id: "Finance Manager", label: "Finance Manager", icon: "💳" },
    { id: "Marketing Manager", label: "Marketing Manager", icon: "📣" },
    { id: "Sales Manager", label: "Sales Manager", icon: "📈" },
    { id: "IT Manager", label: "IT Manager", icon: "🔧" },
    { id: "Quality Manager", label: "Quality Manager", icon: "✅" },
    { id: "Supply Chain Manager", label: "Supply Chain Manager", icon: "🚚" },
  ],
  technology: [
    { id: "Software Engineer", label: "Software Engineer", icon: "💻" },
    { id: "Data Scientist", label: "Data Scientist", icon: "📊" },
    { id: "DevOps Engineer", label: "DevOps Engineer", icon: "🔄" },
    { id: "Cloud Architect", label: "Cloud Architect", icon: "☁️" },
    { id: "Cybersecurity Analyst", label: "Cybersecurity Analyst", icon: "🔒" },
    { id: "UI/UX Designer", label: "UI/UX Designer", icon: "🎨" },
    { id: "Database Administrator", label: "Database Administrator", icon: "🗄️" },
    { id: "QA Engineer", label: "QA Engineer", icon: "🧪" },
    { id: "Technical Lead", label: "Technical Lead", icon: "👨‍💻" },
    { id: "System Administrator", label: "System Administrator", icon: "🖧" },
  ],
  finance: [
    { id: "Accountant", label: "Accountant", icon: "📒" },
    { id: "Financial Analyst", label: "Financial Analyst", icon: "📈" },
    { id: "Investment Banker", label: "Investment Banker", icon: "🏦" },
    { id: "Auditor", label: "Auditor", icon: "🔍" },
    { id: "Tax Specialist", label: "Tax Specialist", icon: "📝" },
    { id: "Treasury Analyst", label: "Treasury Analyst", icon: "💵" },
    { id: "Risk Analyst", label: "Risk Analyst", icon: "⚠️" },
    { id: "Credit Analyst", label: "Credit Analyst", icon: "💳" },
  ],
  sales: [
    { id: "Sales Executive", label: "Sales Executive", icon: "🎯" },
    { id: "Business Development", label: "Business Development", icon: "🤝" },
    { id: "Account Manager", label: "Account Manager", icon: "👤" },
    { id: "Sales Representative", label: "Sales Representative", icon: "📞" },
    { id: "Key Account Manager", label: "Key Account Manager", icon: "⭐" },
    { id: "Territory Manager", label: "Territory Manager", icon: "🗺️" },
  ],
  marketing: [
    { id: "Digital Marketer", label: "Digital Marketer", icon: "📱" },
    { id: "Content Strategist", label: "Content Strategist", icon: "✍️" },
    { id: "SEO Specialist", label: "SEO Specialist", icon: "🔎" },
    { id: "Brand Manager", label: "Brand Manager", icon: "™️" },
    { id: "Social Media Manager", label: "Social Media Manager", icon: "📲" },
    { id: "Marketing Analyst", label: "Marketing Analyst", icon: "📊" },
    { id: "Public Relations", label: "Public Relations", icon: "📰" },
    { id: "Event Manager", label: "Event Manager", icon: "🎪" },
  ],
  humanResources: [
    { id: "HR Generalist", label: "HR Generalist", icon: "👥" },
    { id: "Recruiter", label: "Recruiter / Talent Acquisition", icon: "🔍" },
    { id: "Training Manager", label: "Training & Development", icon: "📚" },
    { id: "Compensation Analyst", label: "Compensation & Benefits", icon: "💰" },
    { id: "Employee Relations", label: "Employee Relations", icon: "🤝" },
    { id: "HR Business Partner", label: "HR Business Partner", icon: "🎯" },
  ],
  operations: [
    { id: "Operations Analyst", label: "Operations Analyst", icon: "📋" },
    { id: "Logistics Coordinator", label: "Logistics Coordinator", icon: "🚛" },
    { id: "Procurement Specialist", label: "Procurement Specialist", icon: "🛒" },
    { id: "Facilities Manager", label: "Facilities Manager", icon: "🏢" },
    { id: "Process Improvement", label: "Process Improvement", icon: "📈" },
    { id: "Warehouse Manager", label: "Warehouse Manager", icon: "📦" },
  ],
  legal: [
    { id: "Corporate Lawyer", label: "Corporate Lawyer", icon: "⚖️" },
    { id: "Legal Counsel", label: "Legal Counsel", icon: "📜" },
    { id: "Compliance Officer", label: "Compliance Officer", icon: "✅" },
    { id: "Contract Manager", label: "Contract Manager", icon: "📄" },
    { id: "Paralegal", label: "Paralegal", icon: "📋" },
  ],
  healthcare: [
    { id: "Doctor", label: "Doctor / Physician", icon: "🩺" },
    { id: "Nurse", label: "Nurse", icon: "💉" },
    { id: "Pharmacist", label: "Pharmacist", icon: "💊" },
    { id: "Medical Administrator", label: "Medical Administrator", icon: "🏥" },
    { id: "Healthcare Consultant", label: "Healthcare Consultant", icon: "📊" },
  ],
  creative: [
    { id: "Graphic Designer", label: "Graphic Designer", icon: "🎨" },
    { id: "Video Producer", label: "Video Producer", icon: "🎬" },
    { id: "Copywriter", label: "Copywriter", icon: "✍️" },
    { id: "Creative Director", label: "Creative Director", icon: "🎯" },
    { id: "Photographer", label: "Photographer", icon: "📷" },
    { id: "Art Director", label: "Art Director", icon: "🖼️" },
  ],
  education: [
    { id: "Teacher", label: "Teacher / Educator", icon: "📚" },
    { id: "Professor", label: "Professor", icon: "🎓" },
    { id: "Corporate Trainer", label: "Corporate Trainer", icon: "👨‍🏫" },
    { id: "Academic Administrator", label: "Academic Administrator", icon: "🏫" },
    { id: "Instructional Designer", label: "Instructional Designer", icon: "📝" },
  ],
  consulting: [
    { id: "Management Consultant", label: "Management Consultant", icon: "💼" },
    { id: "Strategy Consultant", label: "Strategy Consultant", icon: "🎯" },
    { id: "IT Consultant", label: "IT Consultant", icon: "💻" },
    { id: "Financial Consultant", label: "Financial Consultant", icon: "💰" },
    { id: "HR Consultant", label: "HR Consultant", icon: "👥" },
  ],
  entrepreneurship: [
    { id: "Entrepreneur", label: "Entrepreneur / Founder", icon: "🚀" },
    { id: "Startup Founder", label: "Startup Founder", icon: "💡" },
    { id: "Business Owner", label: "Business Owner", icon: "🏪" },
    { id: "Freelancer", label: "Freelancer / Independent", icon: "🎯" },
    { id: "Investor", label: "Investor / VC", icon: "💎" },
  ],
  research: [
    { id: "Research Scientist", label: "Research Scientist", icon: "🔬" },
    { id: "Market Researcher", label: "Market Researcher", icon: "📊" },
    { id: "Data Analyst", label: "Data Analyst", icon: "📈" },
    { id: "Research Associate", label: "Research Associate", icon: "🔍" },
    { id: "Policy Analyst", label: "Policy Analyst", icon: "📋" },
  ],
  customerService: [
    { id: "Customer Success Manager", label: "Customer Success Manager", icon: "🌟" },
    { id: "Support Specialist", label: "Support Specialist", icon: "🎧" },
    { id: "Client Relations", label: "Client Relations", icon: "🤝" },
    { id: "Technical Support", label: "Technical Support", icon: "🔧" },
    { id: "Call Center Manager", label: "Call Center Manager", icon: "📞" },
  ],
} as const;

export const ROLE_CATEGORY_LABELS: Record<string, string> = {
  executive: "Executive Leadership",
  management: "Management",
  technology: "Technology & IT",
  finance: "Finance & Accounting",
  sales: "Sales",
  marketing: "Marketing & Communications",
  humanResources: "Human Resources",
  operations: "Operations & Logistics",
  legal: "Legal & Compliance",
  healthcare: "Healthcare",
  creative: "Creative & Design",
  education: "Education & Training",
  consulting: "Consulting",
  entrepreneurship: "Entrepreneurship",
  research: "Research & Analytics",
  customerService: "Customer Service",
};
