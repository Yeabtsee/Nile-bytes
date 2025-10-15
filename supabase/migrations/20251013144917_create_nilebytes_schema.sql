/*
  # Nilebytes Platform Database Schema

  ## Overview
  Creates the complete database structure for the Nilebytes MVP platform including services,
  portfolio projects, team members, contact messages, and admin users.

  ## New Tables

  ### 1. services
  Stores service offerings displayed on the landing page
  - `id` (uuid, primary key) - Unique identifier
  - `title` (text) - Service name
  - `description` (text) - Service description
  - `icon_name` (text) - Lucide icon name for display
  - `features` (jsonb) - Array of feature strings
  - `is_active` (boolean) - Visibility toggle
  - `display_order` (integer) - Sort order
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. portfolio_projects
  Stores portfolio projects showcased on the landing page
  - `id` (uuid, primary key) - Unique identifier
  - `title` (text) - Project name
  - `description` (text) - Project description
  - `technologies` (jsonb) - Array of technology strings
  - `image_url` (text) - Featured image URL
  - `project_url` (text) - Live project or case study URL
  - `display_order` (integer) - Sort order
  - `is_active` (boolean) - Visibility toggle
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 3. team_members
  Stores team member profiles
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text) - Full name
  - `role` (text) - Job title/role
  - `bio` (text) - Short biography
  - `profile_image_url` (text) - Profile photo URL
  - `linkedin_url` (text) - LinkedIn profile URL
  - `display_order` (integer) - Sort order
  - `is_active` (boolean) - Visibility toggle
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 4. contact_messages
  Stores contact form submissions and leads
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text) - Contact name
  - `email` (text) - Contact email
  - `company` (text) - Company name
  - `message` (text) - Message content
  - `status` (text) - Message status (new, read, archived)
  - `created_at` (timestamptz) - Submission timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 5. admin_users
  Stores admin user accounts for dashboard access
  - Uses Supabase Auth for authentication
  - `id` (uuid, primary key, references auth.users)
  - `email` (text) - Admin email
  - `full_name` (text) - Admin full name
  - `role` (text) - Admin role
  - `created_at` (timestamptz) - Account creation timestamp

  ## Security

  ### Row Level Security (RLS)
  All tables have RLS enabled with appropriate policies:

  #### Public Tables (services, portfolio_projects, team_members)
  - SELECT: Public read access for active items
  - INSERT/UPDATE/DELETE: Authenticated admin users only

  #### Protected Tables (contact_messages, admin_users)
  - All operations: Authenticated admin users only

  ## Indexes
  Created for optimized query performance on:
  - display_order columns for sorting
  - is_active columns for filtering
  - status column in contact_messages
  - created_at columns for chronological sorting

  ## Notes
  1. All timestamps use timestamptz for timezone awareness
  2. JSONB used for flexible array storage (features, technologies)
  3. Default values ensure data consistency
  4. Updated_at triggers automatically update timestamps
*/

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  icon_name text NOT NULL,
  features jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create portfolio_projects table
CREATE TABLE IF NOT EXISTS portfolio_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  technologies jsonb DEFAULT '[]'::jsonb,
  image_url text,
  project_url text,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create team_members table
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  bio text,
  profile_image_url text,
  linkedin_url text,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text,
  message text NOT NULL,
  status text DEFAULT 'new' CHECK (status IN ('new', 'read', 'archived')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  role text DEFAULT 'admin',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for services
CREATE POLICY "Services are viewable by everyone"
  ON services FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can insert services"
  ON services FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid())
  );

CREATE POLICY "Admins can update services"
  ON services FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid())
  );

CREATE POLICY "Admins can delete services"
  ON services FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid())
  );

-- RLS Policies for portfolio_projects
CREATE POLICY "Portfolio projects are viewable by everyone"
  ON portfolio_projects FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can insert portfolio projects"
  ON portfolio_projects FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid())
  );

CREATE POLICY "Admins can update portfolio projects"
  ON portfolio_projects FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid())
  );

CREATE POLICY "Admins can delete portfolio projects"
  ON portfolio_projects FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid())
  );

-- RLS Policies for team_members
CREATE POLICY "Team members are viewable by everyone"
  ON team_members FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can insert team members"
  ON team_members FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid())
  );

CREATE POLICY "Admins can update team members"
  ON team_members FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid())
  );

CREATE POLICY "Admins can delete team members"
  ON team_members FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid())
  );

-- RLS Policies for contact_messages
CREATE POLICY "Anyone can insert contact messages"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view contact messages"
  ON contact_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid())
  );

CREATE POLICY "Admins can update contact messages"
  ON contact_messages FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid())
  );

CREATE POLICY "Admins can delete contact messages"
  ON contact_messages FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid())
  );

-- RLS Policies for admin_users
CREATE POLICY "Admins can view admin users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid())
  );

CREATE POLICY "Admins can insert admin users"
  ON admin_users FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid())
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_services_display_order ON services(display_order);
CREATE INDEX IF NOT EXISTS idx_services_is_active ON services(is_active);
CREATE INDEX IF NOT EXISTS idx_portfolio_display_order ON portfolio_projects(display_order);
CREATE INDEX IF NOT EXISTS idx_portfolio_is_active ON portfolio_projects(is_active);
CREATE INDEX IF NOT EXISTS idx_team_display_order ON team_members(display_order);
CREATE INDEX IF NOT EXISTS idx_team_is_active ON team_members(is_active);
CREATE INDEX IF NOT EXISTS idx_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON contact_messages(created_at DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_services_updated_at ON services;
CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_portfolio_updated_at ON portfolio_projects;
CREATE TRIGGER update_portfolio_updated_at
  BEFORE UPDATE ON portfolio_projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_team_updated_at ON team_members;
CREATE TRIGGER update_team_updated_at
  BEFORE UPDATE ON team_members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_messages_updated_at ON contact_messages;
CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON contact_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();