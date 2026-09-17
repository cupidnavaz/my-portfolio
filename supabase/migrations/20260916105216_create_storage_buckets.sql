/*
# Create Storage Buckets for File Uploads

1. Storage
- Create a public bucket "images" for avatar, project images, and blog cover images.
- Create a private bucket "documents" for resume and other document files.
2. Policies
- images bucket: public read (anyone can view), authenticated write (only logged-in admin can upload/update/delete).
- documents bucket: authenticated read and write (only logged-in admin can access documents).
3. Notes
- Buckets are created with IF NOT EXISTS for idempotency.
- Policies use storage-specific RLS (storage.objects table).
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- Images bucket: public read, authenticated write
DROP POLICY IF EXISTS "public_read_images" ON storage.objects;
CREATE POLICY "public_read_images" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'images');

DROP POLICY IF EXISTS "auth_insert_images" ON storage.objects;
CREATE POLICY "auth_insert_images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'images');

DROP POLICY IF EXISTS "auth_update_images" ON storage.objects;
CREATE POLICY "auth_update_images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'images') WITH CHECK (bucket_id = 'images');

DROP POLICY IF EXISTS "auth_delete_images" ON storage.objects;
CREATE POLICY "auth_delete_images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'images');

-- Documents bucket: authenticated only
DROP POLICY IF EXISTS "auth_read_documents" ON storage.objects;
CREATE POLICY "auth_read_documents" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'documents');

DROP POLICY IF EXISTS "auth_insert_documents" ON storage.objects;
CREATE POLICY "auth_insert_documents" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'documents');

DROP POLICY IF EXISTS "auth_update_documents" ON storage.objects;
CREATE POLICY "auth_update_documents" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'documents') WITH CHECK (bucket_id = 'documents');

DROP POLICY IF EXISTS "auth_delete_documents" ON storage.objects;
CREATE POLICY "auth_delete_documents" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'documents');