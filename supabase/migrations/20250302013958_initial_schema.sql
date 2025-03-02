-- Create tables for Bump app

-- Users table (handled by Supabase Auth, but we'll create a view for easier access)
CREATE VIEW users_view AS
SELECT id, email, raw_user_meta_data->>'username' as username, created_at
FROM auth.users;

-- Places table
CREATE TABLE places (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  google_place_id TEXT,
  lat FLOAT,
  lng FLOAT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Places table (linking users to their favorite places)
CREATE TABLE user_places (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  place_id UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  visibility TEXT NOT NULL CHECK (visibility IN ('public', 'friends', 'private')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, place_id)
);

-- Statuses table (check-ins)
CREATE TABLE statuses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  place_id UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  activity TEXT NOT NULL,
  privacy TEXT NOT NULL CHECK (privacy IN ('all', 'intended', 'specific')),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Meetups table (logged encounters)
CREATE TABLE meetups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  friend_name TEXT NOT NULL,
  place_id UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  was_intentional BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Friends table
CREATE TABLE friends (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  friend_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  intend_to_bump TEXT NOT NULL CHECK (intend_to_bump IN ('off', 'private', 'shared')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, friend_id)
);

-- Settings table
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  availability_start TIME NOT NULL DEFAULT '09:00',
  availability_end TIME NOT NULL DEFAULT '17:00',
  notify_for TEXT NOT NULL CHECK (notify_for IN ('all', 'intended', 'none')),
  do_not_disturb BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create Row Level Security (RLS) policies
-- Places: anyone can read, only authenticated users can insert
ALTER TABLE places ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read places" 
  ON places FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create places" 
  ON places FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

-- User Places: users can only read/write their own records
ALTER TABLE user_places ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own places" 
  ON user_places FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own places" 
  ON user_places FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own places" 
  ON user_places FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own places" 
  ON user_places FOR DELETE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Statuses: users can read friends' statuses and manage their own
ALTER TABLE statuses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all statuses" 
  ON statuses FOR SELECT 
  USING (true);  -- We'll filter in the application logic based on privacy settings

CREATE POLICY "Users can insert their own statuses" 
  ON statuses FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own statuses" 
  ON statuses FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own statuses" 
  ON statuses FOR DELETE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Meetups: users can only read/write their own records
ALTER TABLE meetups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own meetups" 
  ON meetups FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own meetups" 
  ON meetups FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meetups" 
  ON meetups FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own meetups" 
  ON meetups FOR DELETE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Friends: users can only read/write their own records
ALTER TABLE friends ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own friends" 
  ON friends FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own friends" 
  ON friends FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own friends" 
  ON friends FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own friends" 
  ON friends FOR DELETE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Settings: users can only read/write their own records
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own settings" 
  ON settings FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings" 
  ON settings FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings" 
  ON settings FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own settings" 
  ON settings FOR DELETE 
  TO authenticated 
  USING (auth.uid() = user_id); 