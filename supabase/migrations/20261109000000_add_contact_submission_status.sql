-- Add status column to contact_submissions for Accept/Decline workflow
ALTER TABLE public.contact_submissions 
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pending';

-- Allow admin users to update submission status (Accept / Decline)
DROP POLICY IF EXISTS "Admin update submissions" ON public.contact_submissions;
CREATE POLICY "Admin update submissions" ON public.contact_submissions 
  FOR UPDATE TO authenticated 
  USING (public.has_role(auth.uid(), 'admin'));
