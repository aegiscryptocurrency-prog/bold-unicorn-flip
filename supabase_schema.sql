-- Table for storing appraisal requests
CREATE TABLE public.appraisal_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Links to Supabase Auth users, nullable for now
    item_name TEXT NOT NULL,
    item_category TEXT NOT NULL,
    item_description TEXT NOT NULL,
    item_history TEXT, -- Optional
    item_condition TEXT NOT NULL,
    image_url TEXT, -- URL to the uploaded image in Supabase Storage
    agreed_terms BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) for appraisal_requests
ALTER TABLE public.appraisal_requests ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own appraisal requests
CREATE POLICY "Users can view their own appraisal requests." ON public.appraisal_requests
  FOR SELECT USING (auth.uid() = user_id);

-- Policy for users to insert their own appraisal requests
CREATE POLICY "Users can insert their own appraisal requests." ON public.appraisal_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Table for storing appraisal results
CREATE TABLE public.appraisal_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID REFERENCES public.appraisal_requests(id) ON DELETE CASCADE, -- Links to the appraisal request
    appraised_value NUMERIC(18, 2) NOT NULL, -- Stores currency value with 2 decimal places
    currency TEXT NOT NULL DEFAULT 'USD',
    quality_assessment TEXT NOT NULL,
    quality_explanation TEXT,
    appraisal_methodology TEXT NOT NULL,
    data_sources TEXT[] NOT NULL DEFAULT '{}', -- Array of text for data sources
    expert_insights TEXT,
    sell_buy_options TEXT[] NOT NULL DEFAULT '{}', -- Array of text for sell/buy options
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) for appraisal_results
ALTER TABLE public.appraisal_results ENABLE ROW LEVEL SECURITY;

-- Policy for users to view appraisal results linked to their requests
CREATE POLICY "Users can view appraisal results for their requests." ON public.appraisal_results
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.appraisal_requests WHERE id = request_id AND user_id = auth.uid()));