-- Create table for storing palm analysis reports
CREATE TABLE public.palm_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  share_id TEXT NOT NULL UNIQUE DEFAULT substring(gen_random_uuid()::text from 1 for 8),
  selected_role TEXT NOT NULL,
  compatibility_score INTEGER NOT NULL,
  verdict TEXT NOT NULL,
  palm_line_analysis JSONB NOT NULL,
  personality_traits TEXT[] NOT NULL,
  strengths TEXT[] NOT NULL,
  weaknesses TEXT[] NOT NULL,
  alternative_roles JSONB NOT NULL,
  astrological_reasoning TEXT NOT NULL,
  -- Extended analysis fields
  behavioral_analysis JSONB NOT NULL,
  workplace_dynamics JSONB NOT NULL,
  career_growth JSONB NOT NULL,
  work_capabilities JSONB NOT NULL,
  job_change_analysis JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.palm_reports ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (anyone can view shared reports)
CREATE POLICY "Anyone can view palm reports" 
ON public.palm_reports 
FOR SELECT 
USING (true);

-- Create policy for public insert (anyone can create reports)
CREATE POLICY "Anyone can create palm reports" 
ON public.palm_reports 
FOR INSERT 
WITH CHECK (true);

-- Create index for faster lookups by share_id
CREATE INDEX idx_palm_reports_share_id ON public.palm_reports(share_id);