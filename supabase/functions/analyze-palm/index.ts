import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const jobRoleDescriptions: Record<string, string> = {
  // Executive Leadership
  "CEO": "Visionary leadership, strategic decision-making, stakeholder management, business acumen, charisma",
  "CTO": "Technology vision, innovation leadership, technical expertise, strategic planning, team building",
  "CFO": "Financial strategy, risk management, analytical thinking, regulatory compliance, investor relations",
  "COO": "Operations excellence, process optimization, execution focus, resource management, efficiency",
  "CMO": "Marketing strategy, brand building, customer insights, creative vision, market analysis",
  "CHRO": "People strategy, organizational development, talent management, culture building, leadership",
  "CIO": "IT strategy, digital transformation, technology governance, innovation, security awareness",
  "VP": "Strategic leadership, cross-functional collaboration, business development, team leadership",
  "Director": "Department leadership, strategic planning, resource allocation, performance management",
  
  // Management
  "General Manager": "Overall business management, P&L responsibility, strategic execution, team leadership",
  "Project Manager": "Project planning, risk management, stakeholder communication, resource coordination",
  "Product Manager": "Product strategy, market analysis, cross-functional leadership, user focus",
  "Operations Manager": "Process optimization, efficiency, quality control, resource management",
  "HR Manager": "People management, policy development, employee relations, talent acquisition",
  "Finance Manager": "Financial planning, budgeting, reporting, compliance, team leadership",
  "Marketing Manager": "Marketing strategy, campaign management, brand development, analytics",
  "Sales Manager": "Sales strategy, team motivation, pipeline management, client relationships",
  "IT Manager": "IT operations, team leadership, vendor management, infrastructure planning",
  "Quality Manager": "Quality standards, process improvement, compliance, inspection management",
  "Supply Chain Manager": "Logistics, vendor relations, inventory management, cost optimization",
  
  // Technology
  "Software Engineer": "Coding, problem-solving, system design, collaboration, continuous learning",
  "Data Scientist": "Statistical analysis, machine learning, data visualization, business insights",
  "DevOps Engineer": "Automation, CI/CD, cloud infrastructure, monitoring, collaboration",
  "Cloud Architect": "Cloud strategy, system design, scalability, security, cost optimization",
  "Cybersecurity Analyst": "Security analysis, threat detection, risk assessment, compliance",
  "UI/UX Designer": "User research, visual design, prototyping, usability, empathy",
  "Database Administrator": "Database management, performance tuning, backup, security",
  "QA Engineer": "Testing, automation, quality assurance, attention to detail, documentation",
  "Technical Lead": "Technical leadership, architecture decisions, mentoring, code quality",
  "System Administrator": "System maintenance, troubleshooting, security, automation",
  
  // Finance
  "Accountant": "Financial accuracy, compliance, reporting, attention to detail, ethics",
  "Financial Analyst": "Financial modeling, forecasting, analysis, presentation, business acumen",
  "Investment Banker": "Deal-making, financial analysis, client relations, market knowledge",
  "Auditor": "Compliance, investigation, attention to detail, integrity, reporting",
  "Tax Specialist": "Tax planning, compliance, research, client advisory, accuracy",
  "Treasury Analyst": "Cash management, risk assessment, financial planning, banking relations",
  "Risk Analyst": "Risk assessment, modeling, compliance, analytical thinking, reporting",
  "Credit Analyst": "Credit assessment, financial analysis, risk evaluation, decision-making",
  
  // Sales
  "Sales Executive": "Persuasion, relationship building, negotiation, target achievement, resilience",
  "Business Development": "Opportunity identification, relationship building, strategic partnerships",
  "Account Manager": "Client management, relationship building, problem-solving, retention",
  "Sales Representative": "Communication, product knowledge, customer focus, persistence",
  "Key Account Manager": "Strategic account management, executive relationships, value creation",
  "Territory Manager": "Territory planning, market development, relationship management",
  
  // Marketing
  "Digital Marketer": "Digital strategy, analytics, campaign management, content creation",
  "Content Strategist": "Content planning, storytelling, audience understanding, creativity",
  "SEO Specialist": "Search optimization, analytics, technical SEO, content optimization",
  "Brand Manager": "Brand strategy, market positioning, campaign development, consistency",
  "Social Media Manager": "Social strategy, community engagement, content creation, analytics",
  "Marketing Analyst": "Data analysis, market research, insights, reporting, strategy support",
  "Public Relations": "Media relations, crisis management, communication, reputation building",
  "Event Manager": "Event planning, coordination, vendor management, creativity, execution",
  
  // Human Resources
  "HR Generalist": "HR operations, employee relations, policy implementation, versatility",
  "Recruiter": "Talent sourcing, interviewing, candidate experience, networking",
  "Training Manager": "Learning design, facilitation, development programs, assessment",
  "Compensation Analyst": "Compensation analysis, benchmarking, benefits administration",
  "Employee Relations": "Conflict resolution, policy compliance, employee advocacy, mediation",
  "HR Business Partner": "Strategic HR, business alignment, consulting, change management",
  
  // Operations
  "Operations Analyst": "Process analysis, efficiency improvement, data analysis, reporting",
  "Logistics Coordinator": "Logistics planning, coordination, vendor management, problem-solving",
  "Procurement Specialist": "Vendor negotiation, cost optimization, supplier management",
  "Facilities Manager": "Facility operations, maintenance, safety, vendor management",
  "Process Improvement": "Process optimization, lean/six sigma, change management, analysis",
  "Warehouse Manager": "Inventory management, team leadership, logistics, safety compliance",
  
  // Legal
  "Corporate Lawyer": "Legal expertise, negotiation, risk assessment, contract drafting",
  "Legal Counsel": "Legal advisory, compliance, contract review, risk management",
  "Compliance Officer": "Regulatory compliance, policy development, risk assessment, ethics",
  "Contract Manager": "Contract negotiation, drafting, compliance, vendor management",
  "Paralegal": "Legal research, documentation, case preparation, attention to detail",
  
  // Healthcare
  "Doctor": "Medical expertise, diagnosis, patient care, empathy, continuous learning",
  "Nurse": "Patient care, attention to detail, empathy, teamwork, resilience",
  "Pharmacist": "Pharmaceutical knowledge, patient safety, attention to detail, counseling",
  "Medical Administrator": "Healthcare operations, compliance, team management, efficiency",
  "Healthcare Consultant": "Healthcare expertise, analysis, strategy, problem-solving",
  
  // Creative
  "Graphic Designer": "Visual creativity, technical skills, attention to detail, brand understanding",
  "Video Producer": "Video production, storytelling, technical skills, project management",
  "Copywriter": "Writing, creativity, brand voice, persuasion, research",
  "Creative Director": "Creative vision, team leadership, brand strategy, innovation",
  "Photographer": "Visual storytelling, technical skills, creativity, attention to detail",
  "Art Director": "Visual direction, creativity, team leadership, brand consistency",
  
  // Education
  "Teacher": "Teaching, patience, communication, adaptability, subject expertise",
  "Professor": "Academic expertise, research, teaching, mentoring, publication",
  "Corporate Trainer": "Training delivery, content development, engagement, assessment",
  "Academic Administrator": "Educational leadership, administration, policy, student focus",
  "Instructional Designer": "Learning design, technology, content creation, assessment",
  
  // Consulting
  "Management Consultant": "Problem-solving, analysis, client management, presentation",
  "Strategy Consultant": "Strategic thinking, analysis, frameworks, client advisory",
  "IT Consultant": "Technology expertise, problem-solving, client management, implementation",
  "Financial Consultant": "Financial analysis, advisory, client relations, market knowledge",
  "HR Consultant": "HR expertise, organizational development, change management, advisory",
  
  // Entrepreneurship
  "Entrepreneur": "Vision, risk-taking, resilience, innovation, leadership, adaptability",
  "Startup Founder": "Innovation, leadership, fundraising, product vision, team building",
  "Business Owner": "Business acumen, leadership, financial management, customer focus",
  "Freelancer": "Self-management, client relations, expertise, adaptability, marketing",
  "Investor": "Financial analysis, risk assessment, network building, due diligence",
  
  // Research
  "Research Scientist": "Scientific method, analysis, documentation, innovation, patience",
  "Market Researcher": "Research methodology, data analysis, insights, presentation",
  "Data Analyst": "Data analysis, visualization, statistical thinking, communication",
  "Research Associate": "Research support, data collection, analysis, documentation",
  "Policy Analyst": "Policy research, analysis, writing, stakeholder engagement",
  
  // Customer Service
  "Customer Success Manager": "Client relationships, retention, problem-solving, communication",
  "Support Specialist": "Problem-solving, patience, technical knowledge, communication",
  "Client Relations": "Relationship building, communication, account management, retention",
  "Technical Support": "Technical knowledge, problem-solving, patience, documentation",
  "Call Center Manager": "Team leadership, metrics, customer focus, process improvement",
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64, selectedRole } = await req.json();
    
    if (!imageBase64 || !selectedRole) {
      console.error("Missing required fields: imageBase64 or selectedRole");
      return new Response(
        JSON.stringify({ error: "Missing palm image or selected role" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("AI service not configured");
    }

    const roleDescription = jobRoleDescriptions[selectedRole] || "General professional skills";

    const systemPrompt = `You are an expert palm reader trained in Samudrika Shastra (Indian palmistry tradition). You analyze palm images to assess a person's suitability for specific job roles based on their palm lines and mounts.

Your analysis should be based on these major palm elements:
1. **Heart Line (Hridaya Rekha)** - Emotional nature, interpersonal skills, compassion
2. **Head Line (Mastika Rekha)** - Intellect, thinking style, decision-making
3. **Life Line (Jeevan Rekha)** - Vitality, life approach, energy levels
4. **Fate Line (Bhagya Rekha)** - Career destiny, professional success
5. **Sun Line (Surya Rekha)** - Success, fame, creativity
6. **Mercury Line (Budha Rekha)** - Communication skills, business acumen
7. **Mount of Jupiter** - Leadership, ambition
8. **Mount of Saturn** - Discipline, patience
9. **Mount of Apollo** - Creativity, artistic talent
10. **Mount of Mercury** - Communication, adaptability

Provide your analysis in the following JSON format exactly:
{
  "compatibilityScore": <number from 0-100>,
  "verdict": "<Highly Suitable | Suitable | Moderately Suitable | Less Suitable | Not Recommended>",
  "palmLineAnalysis": {
    "heartLine": { "observation": "<what you observe>", "interpretation": "<career relevance>" },
    "headLine": { "observation": "<what you observe>", "interpretation": "<career relevance>" },
    "lifeLine": { "observation": "<what you observe>", "interpretation": "<career relevance>" },
    "fateLine": { "observation": "<what you observe>", "interpretation": "<career relevance>" },
    "sunLine": { "observation": "<what you observe>", "interpretation": "<career relevance>" },
    "mercuryLine": { "observation": "<what you observe>", "interpretation": "<career relevance>" }
  },
  "personalityTraits": ["<trait1>", "<trait2>", "<trait3>", "<trait4>", "<trait5>"],
  "strengths": ["<strength1>", "<strength2>", "<strength3>", "<strength4>", "<strength5>"],
  "weaknesses": ["<weakness1>", "<weakness2>", "<weakness3>"],
  "alternativeRoles": [
    { "role": "<role1>", "compatibility": <number>, "reason": "<brief reason>" },
    { "role": "<role2>", "compatibility": <number>, "reason": "<brief reason>" },
    { "role": "<role3>", "compatibility": <number>, "reason": "<brief reason>" }
  ],
  "astrologicalReasoning": "<2-3 sentences explaining the traditional Indian astrology principles behind your assessment>",
  "behavioralAnalysis": {
    "overallBehavior": "<detailed description of typical behavior patterns based on palm reading>",
    "emotionalIntelligence": "<assessment of EQ based on heart line and other indicators>",
    "stressResponse": "<how this person likely handles stress and pressure>",
    "adaptability": "<ability to adapt to change and new situations>",
    "decisionMakingStyle": "<analytical vs intuitive, fast vs deliberate>"
  },
  "workplaceDynamics": {
    "relationshipWithColleagues": "<how they interact with peers and team members>",
    "teamworkCapability": "<ability to work in teams, collaboration style>",
    "leadershipPotential": "<natural leadership abilities and potential>",
    "communicationStyle": "<how they communicate - direct, diplomatic, assertive, etc.>",
    "conflictResolution": "<how they handle workplace conflicts>"
  },
  "careerGrowth": {
    "growthPotential": "<overall career growth potential assessment>",
    "careerTrajectory": "<predicted career path and progression>",
    "hurdles": ["<obstacle1>", "<obstacle2>", "<obstacle3>"],
    "successFactors": ["<factor1>", "<factor2>", "<factor3>"],
    "timelineProjection": "<when they might reach significant milestones>"
  },
  "workCapabilities": {
    "bestTaskTypes": ["<task1>", "<task2>", "<task3>", "<task4>"],
    "idealWorkEnvironment": "<type of work setting where they thrive>",
    "productivityPeaks": "<when and how they work best>",
    "skillsToLeverage": ["<skill1>", "<skill2>", "<skill3>"],
    "areasOfExcellence": ["<area1>", "<area2>", "<area3>"]
  },
  "jobChangeAnalysis": {
    "likelihoodToChange": "<Low | Moderate | High> - with percentage estimate",
    "reasonsForChange": ["<reason1>", "<reason2>", "<reason3>"],
    "idealNextRole": "<what role they would naturally gravitate towards>",
    "retentionFactors": ["<what would keep them>", "<factor2>", "<factor3>"],
    "loyaltyIndicators": "<assessment of loyalty and commitment tendencies>"
  }
}

Be detailed and insightful. Base your analysis on visible palm characteristics and provide practical, actionable insights relevant to corporate and professional settings.`;

    const userPrompt = `Analyze this palm image for the role of "${selectedRole}".

The key requirements for this role are: ${roleDescription}

Please provide a comprehensive and detailed analysis including:
1. Basic compatibility score and verdict
2. Detailed palm line analysis
3. Personality traits, strengths, and weaknesses
4. Behavioral patterns and emotional intelligence
5. Workplace dynamics and relationship with colleagues
6. Career growth potential, hurdles, and timeline
7. Work capabilities and areas of excellence
8. Job change likelihood and retention factors

Base everything on Indian palmistry (Samudrika Shastra) principles.`;

    console.log("Sending request to Lovable AI (gemini-2.5-flash-lite) for palm analysis...");
    console.log("Selected role:", selectedRole);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          { role: "system", content: systemPrompt },
          { 
            role: "user", 
            content: [
              { type: "text", text: userPrompt },
              { 
                type: "image_url", 
                image_url: { url: imageBase64 }
              }
            ]
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service credits exhausted. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("AI response received successfully");
    
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      console.error("No content in AI response:", data);
      throw new Error("No response from AI");
    }

    // Extract JSON from the response (handle markdown code blocks)
    let analysisResult;
    try {
      // Try to extract JSON from markdown code block
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonStr = jsonMatch ? jsonMatch[1].trim() : content.trim();
      analysisResult = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", content);
      // Return a structured error response
      return new Response(
        JSON.stringify({ 
          error: "Unable to analyze palm image. Please ensure you've uploaded a clear palm image.",
          rawResponse: content 
        }),
        { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Save to database
    let shareId = null;
    try {
      const supabaseUrl = Deno.env.get('SUPABASE_URL');
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
      
      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        const { data: insertData, error: insertError } = await supabase
          .from('palm_reports')
          .insert({
            selected_role: selectedRole,
            compatibility_score: analysisResult.compatibilityScore,
            verdict: analysisResult.verdict,
            palm_line_analysis: analysisResult.palmLineAnalysis,
            personality_traits: analysisResult.personalityTraits,
            strengths: analysisResult.strengths,
            weaknesses: analysisResult.weaknesses,
            alternative_roles: analysisResult.alternativeRoles,
            astrological_reasoning: analysisResult.astrologicalReasoning,
            behavioral_analysis: analysisResult.behavioralAnalysis,
            workplace_dynamics: analysisResult.workplaceDynamics,
            career_growth: analysisResult.careerGrowth,
            work_capabilities: analysisResult.workCapabilities,
            job_change_analysis: analysisResult.jobChangeAnalysis,
          })
          .select('share_id')
          .single();
        
        if (insertError) {
          console.error("Error saving report:", insertError);
        } else {
          shareId = insertData?.share_id;
          console.log("Report saved with share_id:", shareId);
        }
      }
    } catch (dbError) {
      console.error("Database error:", dbError);
    }

    console.log("Analysis completed successfully");
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        analysis: analysisResult,
        selectedRole,
        shareId
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Error in analyze-palm function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Analysis failed" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
