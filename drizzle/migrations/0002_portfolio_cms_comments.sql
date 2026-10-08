ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS tags TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE public.skills ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'General';

CREATE TABLE public.timeline_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kind TEXT NOT NULL DEFAULT 'experience',
  title TEXT NOT NULL,
  organization TEXT,
  period TEXT,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.timeline_items TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.timeline_items TO authenticated;
GRANT ALL ON public.timeline_items TO service_role;
ALTER TABLE public.timeline_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read timeline" ON public.timeline_items FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin manage timeline" ON public.timeline_items FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read settings" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin manage settings" ON public.site_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.project_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  comment TEXT NOT NULL,
  approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX project_comments_project_idx ON public.project_comments (project_id, created_at DESC);
GRANT SELECT, INSERT ON public.project_comments TO anon, authenticated;
GRANT UPDATE, DELETE ON public.project_comments TO authenticated;
GRANT ALL ON public.project_comments TO service_role;
ALTER TABLE public.project_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read approved comments" ON public.project_comments FOR SELECT TO anon, authenticated USING (approved = true OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Anyone can submit pending comment" ON public.project_comments FOR INSERT TO anon, authenticated
  WITH CHECK (approved = false AND char_length(btrim(name)) BETWEEN 2 AND 60 AND char_length(btrim(comment)) BETWEEN 3 AND 1000);
CREATE POLICY "Admin update comments" ON public.project_comments FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admin delete comments" ON public.project_comments FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE OR REPLACE FUNCTION public.guard_project_comment()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public.has_role(auth.uid(),'admin') THEN RETURN NEW; END IF;
  NEW.name := btrim(regexp_replace(NEW.name, '<[^>]*>', '', 'g'));
  NEW.comment := btrim(regexp_replace(NEW.comment, '<[^>]*>', '', 'g'));
  NEW.approved := false;
  NEW.created_at := now();
  IF NEW.comment ~* '(https?://|www\.)' AND (SELECT count(*) FROM regexp_matches(NEW.comment, 'https?://', 'g')) > 1 THEN
    RAISE EXCEPTION 'Too many links in comment';
  END IF;
  IF EXISTS (SELECT 1 FROM public.project_comments WHERE comment = NEW.comment AND created_at > now() - interval '1 day') THEN
    RAISE EXCEPTION 'Duplicate comment';
  END IF;
  IF (SELECT count(*) FROM public.project_comments WHERE lower(name) = lower(NEW.name) AND created_at > now() - interval '10 minutes') >= 3 THEN
    RAISE EXCEPTION 'Please wait before commenting again';
  END IF;
  IF (SELECT count(*) FROM public.project_comments WHERE created_at > now() - interval '1 hour') >= 40 THEN
    RAISE EXCEPTION 'Comments are temporarily paused';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER project_comment_guard BEFORE INSERT ON public.project_comments FOR EACH ROW EXECUTE FUNCTION public.guard_project_comment();