import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const jobRoleDescriptions: Record<string, string> = {
  // Corporate Roles
  "Manager": "Leadership, decision-making, team coordination, strategic planning",
  "Software Developer": "Analytical thinking, problem-solving, attention to detail, creativity in technical solutions",
  "Sales Executive": "Communication, persuasion, relationship building, resilience",
  "HR Professional": "Empathy, conflict resolution, organizational skills, people management",
  "Finance Analyst": "Numerical aptitude, attention to detail, analytical thinking, risk assessment",
  "Marketing Specialist": "Creativity, communication, trend awareness, strategic thinking",
  "Operations Manager": "Process optimization, multitasking, leadership, efficiency focus",
  // Industry-Specific Roles
  "Doctor": "Precision, empathy, analytical thinking, patience, dedication",
  "Lawyer": "Logic, argumentation, attention to detail, persuasion, ethics",
  "Engineer": "Problem-solving, technical aptitude, precision, innovation",
  "Teacher": "Patience, communication, empathy, knowledge sharing, adaptability",
  "Artist": "Creativity, emotional expression, intuition, originality",
  "Entrepreneur": "Risk-taking, innovation, leadership, resilience, vision",
  "Researcher": "Curiosity, attention to detail, patience, analytical thinking",
  "Consultant": "Problem-solving, communication, adaptability, strategic thinking"
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
  "strengths": ["<strength1>", "<strength2>", "<strength3>"],
  "weaknesses": ["<weakness1>", "<weakness2>"],
  "alternativeRoles": [
    { "role": "<role1>", "compatibility": <number>, "reason": "<brief reason>" },
    { "role": "<role2>", "compatibility": <number>, "reason": "<brief reason>" },
    { "role": "<role3>", "compatibility": <number>, "reason": "<brief reason>" }
  ],
  "astrologicalReasoning": "<2-3 sentences explaining the traditional Indian astrology principles behind your assessment>"
}

Be detailed but concise. Base your analysis on visible palm characteristics and provide practical, actionable insights.`;

    const userPrompt = `Analyze this palm image for the role of "${selectedRole}".

The key requirements for this role are: ${roleDescription}

Please provide a comprehensive analysis of whether this candidate's palm indicates suitability for this position based on Indian palmistry (Samudrika Shastra) principles.`;

    console.log("Sending request to Lovable AI for palm analysis...");
    console.log("Selected role:", selectedRole);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
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

    console.log("Analysis completed successfully");
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        analysis: analysisResult,
        selectedRole 
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
