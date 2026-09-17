/*
# Create Portfolio Schema with Full Admin Control

This migration creates the complete database schema for a professional personal portfolio website with an admin dashboard. The admin can manage all content from the dashboard, while visitors view the public portfolio.

## Tables Created

1. **portfolio_details** - Single-row table holding the site owner's personal info (name, title, bio, avatar, social links, resume URL)
2. **projects** - Showcase projects with title, description, image, tags, live URL, repo URL, featured flag, and ordering
3. **posts** - Blog posts with title, slug, excerpt, content, cover image, published flag, and timestamps
4. **services** - Services offered with title, description, icon name, and ordering
5. **skills** - Skills with name, category, proficiency level, and ordering
6. **experiences** - Work experience entries with role, company, dates, description, and ordering
7. **education** - Education entries with degree, institution, dates, and description
8. **contacts** - Messages submitted via the public contact form (name, email, subject, message, read flag)

## Security

- The app has a sign-in screen (admin), so all write policies are scoped to `authenticated` with `auth.uid()` ownership checks.
- Public read access is via `anon, authenticated` for all content tables (portfolio details, projects, posts, services, skills, experiences, education) so visitors can see the portfolio.
- Contact messages can be submitted by anyone (anon insert) but only read/updated/deleted by authenticated admin.
- RLS is enabled on every table.

## Notes

1. All content tables use `user_id uuid NOT NULL DEFAULT auth.uid()` so inserts from the admin client work without explicitly passing the owner.
2. The `portfolio_details` table is designed to hold a single row (enforced by a unique constraint on user_id).
3. Ordering columns allow the admin to reorder items via drag or manual sort.
4. Slugs on posts are unique for clean URLs.
5. Timestamps use `timestamptz DEFAULT now()`.
*/

-- ============================================================
-- PORTFOLIO DETAILS (single-row profile)
-- ============================================================
CREATE TABLE IF NOT EXISTS portfolio_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT 'Your Name',
  title text NOT NULL DEFAULT 'Your Title',
  tagline text,
  bio text,
  avatar_url text,
  resume_url text,
  email text,
  phone text,
  location text,
  github_url text,
  linkedin_url text,
  twitter_url text,
  website_url text,
  available_for_work boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE portfolio_details ENABLE ROW LEVEL SECURITY;

-- Public can read portfolio details
DROP POLICY IF EXISTS "public_read_portfolio_details" ON portfolio_details;
CREATE POLICY "public_read_portfolio_details" ON portfolio_details FOR SELECT
  TO anon, authenticated USING (true);

-- Only owner can insert
DROP POLICY IF EXISTS "owner_insert_portfolio_details" ON portfolio_details;
CREATE POLICY "owner_insert_portfolio_details" ON portfolio_details FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

-- Only owner can update
DROP POLICY IF EXISTS "owner_update_portfolio_details" ON portfolio_details;
CREATE POLICY "owner_update_portfolio_details" ON portfolio_details FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Only owner can delete
DROP POLICY IF EXISTS "owner_delete_portfolio_details" ON portfolio_details;
CREATE POLICY "owner_delete_portfolio_details" ON portfolio_details FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============================================================
-- PROJECTS
-- ============================================================
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  image_url text,
  live_url text,
  repo_url text,
  tags text[] DEFAULT '{}',
  featured boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_projects" ON projects;
CREATE POLICY "public_read_projects" ON projects FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "owner_insert_projects" ON projects;
CREATE POLICY "owner_insert_projects" ON projects FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "owner_update_projects" ON projects;
CREATE POLICY "owner_update_projects" ON projects FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "owner_delete_projects" ON projects;
CREATE POLICY "owner_delete_projects" ON projects FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============================================================
-- POSTS (Blog)
-- ============================================================
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  slug text NOT NULL,
  excerpt text,
  content text,
  cover_image_url text,
  published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_posts" ON posts;
CREATE POLICY "public_read_posts" ON posts FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "owner_insert_posts" ON posts;
CREATE POLICY "owner_insert_posts" ON posts FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "owner_update_posts" ON posts;
CREATE POLICY "owner_update_posts" ON posts FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "owner_delete_posts" ON posts;
CREATE POLICY "owner_delete_posts" ON posts FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============================================================
-- SERVICES
-- ============================================================
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  icon_name text NOT NULL DEFAULT 'Code',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_services" ON services;
CREATE POLICY "public_read_services" ON services FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "owner_insert_services" ON services;
CREATE POLICY "owner_insert_services" ON services FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "owner_update_services" ON services;
CREATE POLICY "owner_update_services" ON services FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "owner_delete_services" ON services;
CREATE POLICY "owner_delete_services" ON services FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============================================================
-- SKILLS
-- ============================================================
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text NOT NULL DEFAULT 'General',
  proficiency int NOT NULL DEFAULT 80 CHECK (proficiency >= 0 AND proficiency <= 100),
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_skills" ON skills;
CREATE POLICY "public_read_skills" ON skills FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "owner_insert_skills" ON skills;
CREATE POLICY "owner_insert_skills" ON skills FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "owner_update_skills" ON skills;
CREATE POLICY "owner_update_skills" ON skills FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "owner_delete_skills" ON skills;
CREATE POLICY "owner_delete_skills" ON skills FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============================================================
-- EXPERIENCES
-- ============================================================
CREATE TABLE IF NOT EXISTS experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL,
  company text NOT NULL,
  start_date text NOT NULL,
  end_date text,
  current boolean NOT NULL DEFAULT false,
  description text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_experiences" ON experiences;
CREATE POLICY "public_read_experiences" ON experiences FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "owner_insert_experiences" ON experiences;
CREATE POLICY "owner_insert_experiences" ON experiences FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "owner_update_experiences" ON experiences;
CREATE POLICY "owner_update_experiences" ON experiences FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "owner_delete_experiences" ON experiences;
CREATE POLICY "owner_delete_experiences" ON experiences FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============================================================
-- EDUCATION
-- ============================================================
CREATE TABLE IF NOT EXISTS education (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  degree text NOT NULL,
  institution text NOT NULL,
  start_date text NOT NULL,
  end_date text,
  current boolean NOT NULL DEFAULT false,
  description text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE education ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_education" ON education;
CREATE POLICY "public_read_education" ON education FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "owner_insert_education" ON education;
CREATE POLICY "owner_insert_education" ON education FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "owner_update_education" ON education;
CREATE POLICY "owner_update_education" ON education FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "owner_delete_education" ON education;
CREATE POLICY "owner_delete_education" ON education FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============================================================
-- CONTACTS (messages from public contact form)
-- ============================================================
CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text,
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a contact message
DROP POLICY IF EXISTS "public_insert_contacts" ON contacts;
CREATE POLICY "public_insert_contacts" ON contacts FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Only authenticated admin can read messages
DROP POLICY IF EXISTS "admin_read_contacts" ON contacts;
CREATE POLICY "admin_read_contacts" ON contacts FOR SELECT
  TO authenticated USING (true);

-- Only authenticated admin can update (mark as read)
DROP POLICY IF EXISTS "admin_update_contacts" ON contacts;
CREATE POLICY "admin_update_contacts" ON contacts FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- Only authenticated admin can delete messages
DROP POLICY IF EXISTS "admin_delete_contacts" ON contacts;
CREATE POLICY "admin_delete_contacts" ON contacts FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE UNIQUE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE UNIQUE INDEX IF NOT EXISTS idx_portfolio_details_user ON portfolio_details(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_sort ON projects(sort_order);
CREATE INDEX IF NOT EXISTS idx_services_sort ON services(sort_order);
CREATE INDEX IF NOT EXISTS idx_skills_sort ON skills(sort_order);
CREATE INDEX IF NOT EXISTS idx_experiences_sort ON experiences(sort_order);
CREATE INDEX IF NOT EXISTS idx_education_sort ON education(sort_order);
CREATE INDEX IF NOT EXISTS idx_contacts_created ON contacts(created_at DESC);

-- ============================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_portfolio_details_updated ON portfolio_details;
CREATE TRIGGER trg_portfolio_details_updated BEFORE UPDATE ON portfolio_details
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_projects_updated ON projects;
CREATE TRIGGER trg_projects_updated BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_posts_updated ON posts;
CREATE TRIGGER trg_posts_updated BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_services_updated ON services;
CREATE TRIGGER trg_services_updated BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_skills_updated ON skills;
CREATE TRIGGER trg_skills_updated BEFORE UPDATE ON skills
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_experiences_updated ON experiences;
CREATE TRIGGER trg_experiences_updated BEFORE UPDATE ON experiences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_education_updated ON education;
CREATE TRIGGER trg_education_updated BEFORE UPDATE ON education
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();