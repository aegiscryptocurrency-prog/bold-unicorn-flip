-- Create the 'profiles' table
CREATE TABLE profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  account_type text CHECK (account_type IN ('collector', 'consumer')) NOT NULL,
  description text,
  looking_for text, -- For collectors
  contact_links jsonb,
  home_address text, -- For consumers
  shipping_address text, -- For consumers
  created_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security for 'profiles'
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own profile
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Policy for users to create their own profile
CREATE POLICY "Users can create their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Policy for users to update their own profile
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create the 'appraisals' table
CREATE TYPE appraisal_status AS ENUM ('pending', 'appraised', 'listed');

CREATE TABLE appraisals (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  item_name text NOT NULL,
  item_description text NOT NULL,
  item_photo_url text NOT NULL,
  status appraisal_status DEFAULT 'pending' NOT NULL,
  appraisal_data jsonb, -- Stores appraisal details (history, quality, value, notes)
  created_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security for 'appraisals'
ALTER TABLE appraisals ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own appraisals
CREATE POLICY "Users can view their own appraisals" ON appraisals
  FOR SELECT USING (auth.uid() = user_id);

-- Policy for users to create appraisals
CREATE POLICY "Users can create appraisals" ON appraisals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy for collectors to update appraisals (e.g., change status to 'appraised')
CREATE POLICY "Collectors can update appraisals" ON appraisals
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND account_type = 'collector')
  );

-- Policy for all authenticated users to view appraised/listed items
CREATE POLICY "All authenticated users can view appraised/listed items" ON appraisals
  FOR SELECT USING (status IN ('appraised', 'listed'));

-- Create the 'interests' table
CREATE TABLE interests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  appraisal_id uuid REFERENCES appraisals(id) ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE (user_id, appraisal_id) -- Ensure a user can only express interest once per appraisal
);

-- Enable Row Level Security for 'interests'
ALTER TABLE interests ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own interests
CREATE POLICY "Users can view their own interests" ON interests
  FOR SELECT USING (auth.uid() = user_id);

-- Policy for users to create interests
CREATE POLICY "Users can create interests" ON interests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy for collectors to view interests in their appraisals
CREATE POLICY "Collectors can view interests in their appraisals" ON interests
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM appraisals WHERE id = appraisal_id AND user_id = auth.uid())
  );