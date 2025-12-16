-- User roles enum
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('student', 'admin', 'super_admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Users table (managed by admins, not self-registration)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_id text UNIQUE, -- Links to Clerk authentication
  email text UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  role user_role DEFAULT 'student' NOT NULL,
  created_by uuid REFERENCES users(id), -- Admin who created this user
  is_active boolean DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_created_by ON users(created_by);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS users_updated_at ON users;
CREATE TRIGGER users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Disable RLS for now to allow server-side access
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Delete existing test users if any
DELETE FROM users WHERE email IN (
  'superadmin@liquidacapital.com',
  'admin@liquidacapital.com',
  'student@liquidacapital.com'
);

-- Insert test users (clerk_id will be updated after creating Clerk accounts)
-- Super Admin
INSERT INTO users (id, email, first_name, last_name, role) VALUES
  ('11111111-1111-1111-1111-111111111111', 'superadmin@liquidacapital.com', 'Super', 'Admin', 'super_admin');

-- Admin (created by super admin)
INSERT INTO users (id, email, first_name, last_name, role, created_by) VALUES
  ('22222222-2222-2222-2222-222222222222', 'admin@liquidacapital.com', 'John', 'Manager', 'admin', '11111111-1111-1111-1111-111111111111');

-- Student (created by admin)
INSERT INTO users (id, email, first_name, last_name, role, created_by) VALUES
  ('33333333-3333-3333-3333-333333333333', 'student@liquidacapital.com', 'Jane', 'Learner', 'student', '22222222-2222-2222-2222-222222222222');
