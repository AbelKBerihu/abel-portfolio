/*
# Storage policies for portfolio-images bucket

The objects table has RLS enabled but no policies, so no one can upload.
These policies allow:
- Authenticated users to INSERT/UPDATE/DELETE objects in portfolio-images
- Anyone (anon + authenticated) to SELECT (read) public images
*/

-- Allow anyone to read public images
CREATE POLICY "read_portfolio_images"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'portfolio-images');

-- Allow authenticated users to upload images
CREATE POLICY "upload_portfolio_images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'portfolio-images');

-- Allow authenticated users to update their uploads
CREATE POLICY "update_portfolio_images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'portfolio-images')
WITH CHECK (bucket_id = 'portfolio-images');

-- Allow authenticated users to delete images
CREATE POLICY "delete_portfolio_images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'portfolio-images');