/*
# Create admin user and seed portfolio content

1. Admin User
- Create an auth user with email ks.avebina7@gmail.com and password "It'sme@1221"
- Mark email as confirmed so login works immediately
- Assign 'admin' role in user_roles table

2. Seed Content
- Insert 4 sample projects, 8 skills, 4 certifications, 4 timeline items

3. Security
- No schema changes. RLS already in place.
*/

-- ===== Create admin auth user =====
DO $$
DECLARE
  new_user_id uuid;
BEGIN
  SELECT id INTO new_user_id FROM auth.users WHERE email = 'ks.avebina7@gmail.com';
  
  IF new_user_id IS NULL THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_app_meta_data,
      raw_user_meta_data,
      confirmation_token,
      recovery_token,
      email_change_token_new,
      email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'ks.avebina7@gmail.com',
      crypt('It''sme@1221', gen_salt('bf')),
      now(),
      now(),
      now(),
      '{}'::jsonb,
      '{}'::jsonb,
      '',
      '',
      '',
      ''
    )
    RETURNING id INTO new_user_id;
    
    -- email column in auth.identities is generated, so omit it
    INSERT INTO auth.identities (
      id,
      user_id,
      identity_data,
      provider_id,
      provider,
      created_at,
      updated_at
    ) VALUES (
      gen_random_uuid(),
      new_user_id,
      jsonb_build_object('sub', new_user_id::text, 'email', 'ks.avebina7@gmail.com'),
      new_user_id::text,
      'email',
      now(),
      now()
    );
  END IF;
  
  -- Assign admin role
  INSERT INTO public.user_roles (user_id, role)
  SELECT id, 'admin' FROM auth.users WHERE email = 'ks.avebina7@gmail.com'
  ON CONFLICT DO NOTHING;
END $$;

-- ===== Seed Projects =====
INSERT INTO public.projects (title, discipline, description, tags, image_url, link_url, sort_order)
VALUES
  ('Network Packet Analyzer', 'Security Tool', 'A Python-based tool using Scapy to capture and analyze network packets in real-time, with protocol detection and anomaly flagging.', ARRAY['Python', 'Scapy', 'Networking'], NULL, NULL, 0),
  ('SIEM Dashboard with Wazuh', 'Security Lab', 'Configured a Wazuh SIEM stack to collect logs from multiple endpoints, with custom detection rules and alert pipelines.', ARRAY['Wazuh', 'SIEM', 'Linux'], NULL, NULL, 1),
  ('IDS/IPS with Suricata', 'Security Lab', 'Deployed Suricata as an intrusion detection system with custom rule sets and traffic inspection for a lab network.', ARRAY['Suricata', 'IDS', 'Networking'], NULL, NULL, 2),
  ('Personal Portfolio Website', 'Web Development', 'Built a responsive portfolio website with React, Tailwind CSS, and a Supabase-backed CMS for managing content.', ARRAY['React', 'TypeScript', 'Supabase'], NULL, NULL, 3)
ON CONFLICT DO NOTHING;

-- ===== Seed Skills =====
INSERT INTO public.skills (name, category, level, sort_order)
VALUES
  ('Python', 'Programming', 80, 0),
  ('Linux Administration', 'Systems', 75, 1),
  ('Networking', 'Infrastructure', 70, 2),
  ('Scapy', 'Security Tools', 65, 3),
  ('Suricata', 'Security Tools', 60, 4),
  ('Wazuh SIEM', 'Security Tools', 65, 5),
  ('HTML / CSS', 'Web Development', 75, 6),
  ('React', 'Web Development', 60, 7)
ON CONFLICT DO NOTHING;

-- ===== Seed Certifications =====
INSERT INTO public.certifications (title, issuer, date, credential_url, image_url, sort_order)
VALUES
  ('Google Cybersecurity Certificate', 'Coursera', '2025', NULL, NULL, 0),
  ('Networking Essentials', 'Cisco Networking Academy', '2024', NULL, NULL, 1),
  ('Introduction to Cybersecurity', 'Cisco Networking Academy', '2024', NULL, NULL, 2),
  ('Linux Fundamentals', 'IBM SkillsBuild', '2024', NULL, NULL, 3)
ON CONFLICT DO NOTHING;

-- ===== Seed Timeline Items =====
INSERT INTO public.timeline_items (kind, title, organization, period, description, sort_order)
VALUES
  ('learning', 'Cybersecurity Studies', NULL, '2024 — Present', 'Studying network security, Python scripting, Linux administration, and web development through hands-on labs and projects.', 0),
  ('education', 'Google Cybersecurity Certificate', 'Coursera', '2025', 'Completed the Google Cybersecurity Professional Certificate covering security operations, threat analysis, and incident response.', 1),
  ('learning', 'Security Tools Lab Practice', NULL, '2024 — Present', 'Building and configuring security tools including Wazuh SIEM, Suricata IDS, and Scapy-based packet analyzers in a home lab environment.', 2),
  ('learning', 'Web Development with React', NULL, '2024', 'Learning modern web development with React, TypeScript, and Tailwind CSS to build responsive and interactive applications.', 3)
ON CONFLICT DO NOTHING;