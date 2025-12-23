import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ReportEmailRequest {
  email: string;
  fullName?: string;
  selectedRole: string;
  compatibilityScore: number;
  verdict: string;
  shareId: string;
  reportUrl: string;
}

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      return new Response(
        JSON.stringify({ success: false, error: "Email service not configured" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { 
      email, 
      fullName, 
      selectedRole, 
      compatibilityScore, 
      verdict, 
      shareId,
      reportUrl 
    }: ReportEmailRequest = await req.json();

    console.log("Sending report email to:", email);

    const scoreColor = compatibilityScore >= 80 ? "#22c55e" : compatibilityScore >= 60 ? "#f59e0b" : "#ef4444";
    const greeting = fullName ? `Dear ${fullName}` : "Hello";

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: 'Georgia', serif; background-color: #faf9f7; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #7c3aed, #c2410c); padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🖐️ PalmVeda</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0;">Vedic Palm Analysis Report</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 30px;">
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              ${greeting},
            </p>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              Your palm analysis for the role of <strong>${selectedRole}</strong> has been completed!
            </p>
            
            <!-- Score Card -->
            <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
              <p style="color: #6b7280; margin: 0 0 10px; font-size: 14px;">Compatibility Score</p>
              <div style="font-size: 48px; font-weight: bold; color: ${scoreColor};">
                ${compatibilityScore}%
              </div>
            </div>
            
            <!-- Verdict -->
            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
              <p style="color: #92400e; margin: 0; font-size: 14px; font-weight: bold;">Verdict</p>
              <p style="color: #78350f; margin: 8px 0 0; font-size: 15px;">${verdict}</p>
            </div>
            
            <!-- CTA Button -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="${reportUrl}" style="display: inline-block; background: linear-gradient(135deg, #7c3aed, #c2410c); color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: bold; font-size: 16px;">
                View Full Report
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
              Your detailed report includes:
            </p>
            <ul style="color: #6b7280; font-size: 14px; line-height: 1.8;">
              <li>Complete palm line analysis</li>
              <li>Personality traits assessment</li>
              <li>Strengths and areas for improvement</li>
              <li>Career growth predictions</li>
              <li>Alternative role recommendations</li>
            </ul>
            
            <p style="color: #9ca3af; font-size: 12px; margin-top: 30px; text-align: center;">
              Share your report: <a href="${reportUrl}" style="color: #7c3aed;">${reportUrl}</a>
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f3f4f6; padding: 20px; text-align: center;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              © ${new Date().getFullYear()} PalmVeda. Powered by Samudrika Shastra.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Use fetch to call Resend API directly
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "PalmVeda <onboarding@resend.dev>",
        to: [email],
        subject: `Your Palm Analysis Report - ${selectedRole} (${compatibilityScore}% Match)`,
        html: emailHtml,
      }),
    });

    const emailResult = await emailResponse.json();
    
    if (!emailResponse.ok) {
      console.error("Resend API error:", emailResult);
      return new Response(
        JSON.stringify({ success: false, error: emailResult.message || "Failed to send email" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Email sent successfully:", emailResult);

    return new Response(JSON.stringify({ success: true, data: emailResult }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-report-email function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
