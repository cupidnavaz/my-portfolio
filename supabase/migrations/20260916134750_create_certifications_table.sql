/*
# Create Certifications Table

1. New Tables
- `certifications` — Professional training and certifications entries
  - `id` (uuid, primary key)
  - `user_id` (uuid, not null, defaults to authenticated user)
  - `title` (text, not null) — name of the certification or training
  - `issuer` (text, not null) — organization that issued it
  - `issue_date` (text, not null) — when it was issued
  - `expiry_date` (text, nullable) — when it expires, if applicable
  - `credential_id` (text, nullable) — credential identifier
  - `credential_url` (text, nullable) — link to verify the credential
  - `description` (text, nullable) — additional details
  - `sort_order` (int, default 0) — for ordering
  - `created_at`, `updated_at` (timestamptz)
2. Security
- Enable RLS on `certifications`.
- Public read access (anon, authenticated) so visitors can see certifications.
- Owner-scoped insert/update/delete for authenticated admin.
3. Notes
- `user_id` defaults to `auth.uid()` so inserts from the admin client work without passing it.
- Updated_at trigger included.
*/

CREATE TABLE IF NOT EXISTS certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  issuer text NOT NULL,
  issue_date text NOT NULL,
  expiry_date text,
  credential_id text,
  credential_url text,
  description text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_certifications" ON certifications;
CREATE POLICY "public_read_certifications" ON certifications FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "owner_insert_certifications" ON certifications;
CREATE POLICY "owner_insert_certifications" ON certifications FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "owner_update_certifications" ON certifications;
CREATE POLICY "owner_update_certifications" ON certifications FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "owner_delete_certifications" ON certifications;
CREATE POLICY "owner_delete_certifications" ON certifications FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_certifications_sort ON certifications(sort_order);

DROP TRIGGER IF EXISTS trg_certifications_updated ON certifications;
CREATE TRIGGER trg_certifications_updated BEFORE UPDATE ON certifications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();