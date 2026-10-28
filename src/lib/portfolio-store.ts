import type { Tables } from '@/integrations/supabase/types';
import { type ContentTable, triggerPortfolioSync } from '@/hooks/use-portfolio';

export const INITIAL_PORTFOLIO_DATA: {
  site_settings: Tables<'site_settings'>[];
  projects: Tables<'projects'>[];
  skills: Tables<'skills'>[];
  certifications: Tables<'certifications'>[];
  timeline_items: Tables<'timeline_items'>[];
} = {
  site_settings: [
    { key: 'hero_name', value: 'Abel Kebede', updated_at: new Date().toISOString() },
    { key: 'hero_role', value: 'Cybersecurity Student', updated_at: new Date().toISOString() },
    { key: 'hero_intro', value: 'A cybersecurity student from Ethiopia exploring how systems work, how they break, and how to protect them. I learn by building projects, running hands-on labs, and solving real problems.', updated_at: new Date().toISOString() },
    { key: 'about', value: 'Abel Kebede is a cybersecurity student and technology learner from Ethiopia. My journey started with curiosity about how computers and networks function, which grew into a passion for security and software development. I learn independently through hands-on projects, online courses, and practical experimentation — building tools, completing labs, and studying how systems can be secured. I believe the best way to understand technology is to build it, test it, and sometimes break it.', updated_at: new Date().toISOString() },
    { key: 'status', value: 'Open to internships & learning opportunities', updated_at: new Date().toISOString() },
    { key: 'languages', value: 'Amharic, Tigrigna, English', updated_at: new Date().toISOString() },
    { key: 'currently_learning', value: 'Network security, Python scripting, Linux administration, and web development with React.', updated_at: new Date().toISOString() },
    { key: 'footer_banner', value: 'ALWAYS LEARNING. ALWAYS BUILDING.', updated_at: new Date().toISOString() },
    { key: 'github_url', value: 'https://github.com/abelkm99', updated_at: new Date().toISOString() },
    { key: 'linkedin_url', value: 'https://www.linkedin.com/in/abel-ks', updated_at: new Date().toISOString() },
    { key: 'telegram_url', value: 'https://t.me/avebina7', updated_at: new Date().toISOString() },
    { key: 'whatsapp_url', value: 'https://wa.me/251912345678', updated_at: new Date().toISOString() }, // Added default WhatsApp URL
    { key: 'contact_email', value: 'ks.avebina7@gmail.com', updated_at: new Date().toISOString() },
    { key: 'profile_image', value: 'https://i.pravatar.cc/300?img=11', updated_at: new Date().toISOString() }, // Default profile image
    { key: 'cv_url', value: '/cv.pdf', updated_at: new Date().toISOString() }, // Default downloadable CV
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'Network Traffic Analyzer with Suricata',
      discipline: 'Cybersecurity',
      description: 'Built a network traffic monitoring setup using Suricata to detect suspicious activity on a local network. Configured rules to flag common attack patterns and analyzed logs to understand traffic behavior.',
      tags: ['Suricata', 'Networking', 'IDS', 'Linux'],
      image_url: null,
      link_url: null,
      sort_order: 0,
      status: 'completed',
      coming_soon: false,
      is_visible: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 'proj-2',
      title: 'SIEM Lab with Wazuh',
      discipline: 'Cybersecurity',
      description: 'Set up a Wazuh SIEM environment to collect and analyze security events from multiple sources. Practiced writing detection rules, investigating alerts, and generating security reports.',
      tags: ['Wazuh', 'SIEM', 'Log Analysis', 'Security'],
      image_url: null,
      link_url: null,
      sort_order: 1,
      status: 'completed',
      coming_soon: false,
      is_visible: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 'proj-3',
      title: 'Python Port Scanner & Packet Tool',
      discipline: 'Security Tool',
      description: 'Developed a Python-based port scanning and packet inspection tool using Scapy. Explored network reconnaissance techniques and practiced reading raw packet data to understand network protocols.',
      tags: ['Python', 'Scapy', 'Networking', 'Scripting'],
      image_url: null,
      link_url: null,
      sort_order: 2,
      status: 'completed',
      coming_soon: false,
      is_visible: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 'proj-4',
      title: 'Personal Portfolio Website',
      discipline: 'Web Development',
      description: 'Designed and built a portfolio website using React, TypeScript, and Tailwind CSS. Implemented a custom CMS with Supabase, a contact form with Telegram integration, and a cybersecurity-themed animated background.',
      tags: ['React', 'TypeScript', 'Tailwind', 'Supabase'],
      image_url: null,
      link_url: null,
      sort_order: 3,
      status: 'completed',
      coming_soon: false,
      is_visible: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 'proj-5',
      title: 'Packet Capture & Analysis Lab',
      discipline: 'Cybersecurity',
      description: 'Practiced capturing and analyzing network packets using Wireshark and tcpdump. Studied protocol behavior, identified anomalies, and documented findings in structured lab reports.',
      tags: ['Wireshark', 'tcpdump', 'Networking', 'Analysis'],
      image_url: null,
      link_url: null,
      sort_order: 4,
      status: 'in_progress',
      coming_soon: false,
      is_visible: true,
      created_at: new Date().toISOString(),
    },
  ],
  skills: [
    { id: 'skill-1', name: 'Python Scripting', category: 'Security', level: 75, sort_order: 0, is_visible: true, coming_soon: false, created_at: new Date().toISOString() },
    { id: 'skill-2', name: 'Linux Administration', category: 'Security', level: 70, sort_order: 1, is_visible: true, coming_soon: false, created_at: new Date().toISOString() },
    { id: 'skill-3', name: 'Network Security', category: 'Security', level: 72, sort_order: 2, is_visible: true, coming_soon: false, created_at: new Date().toISOString() },
    { id: 'skill-4', name: 'Suricata / IDS', category: 'Security', level: 65, sort_order: 3, is_visible: true, coming_soon: false, created_at: new Date().toISOString() },
    { id: 'skill-5', name: 'Wazuh / SIEM', category: 'Security', level: 60, sort_order: 4, is_visible: true, coming_soon: false, created_at: new Date().toISOString() },
    { id: 'skill-6', name: 'Wireshark', category: 'Security', level: 68, sort_order: 5, is_visible: true, coming_soon: false, created_at: new Date().toISOString() },
    { id: 'skill-7', name: 'Scapy', category: 'Security', level: 62, sort_order: 6, is_visible: true, coming_soon: false, created_at: new Date().toISOString() },
    { id: 'skill-8', name: 'HTML & CSS', category: 'Development', level: 78, sort_order: 7, is_visible: true, coming_soon: false, created_at: new Date().toISOString() },
    { id: 'skill-9', name: 'React & TypeScript', category: 'Development', level: 55, sort_order: 8, is_visible: true, coming_soon: false, created_at: new Date().toISOString() },
    { id: 'skill-10', name: 'Video Editing', category: 'Creative', level: 70, sort_order: 9, is_visible: true, coming_soon: false, created_at: new Date().toISOString() },
    { id: 'skill-11', name: 'Photo Editing', category: 'Creative', level: 68, sort_order: 10, is_visible: true, coming_soon: false, created_at: new Date().toISOString() },
    { id: 'skill-12', name: 'Computer Networks', category: 'General', level: 75, sort_order: 11, is_visible: true, coming_soon: false, created_at: new Date().toISOString() },
  ],
  certifications: [
    { id: 'cert-1', title: 'DISH Computer Science Level 1', issuer: 'DISH', date: '2023', credential_url: '', image_url: '/certificates/dish-cs.svg', sort_order: 0, is_visible: true, coming_soon: false, created_at: new Date().toISOString() },
    { id: 'cert-2', title: 'Cybersecurity Fundamentals', issuer: 'Self-study', date: '2024', credential_url: '', image_url: '/certificates/cyber-fundamentals.svg', sort_order: 1, is_visible: true, coming_soon: false, created_at: new Date().toISOString() },
    { id: 'cert-3', title: 'Networking Essentials', issuer: 'Self-study', date: '2024', credential_url: '', image_url: '/certificates/networking-essentials.svg', sort_order: 2, is_visible: true, coming_soon: false, created_at: new Date().toISOString() },
  ],
  timeline_items: [
    { id: 'time-1', kind: 'education', title: 'Computer Science Studies', organization: 'Self-directed & Online', period: 'Ongoing', description: 'Continuing to study computer science independently through online courses, hands-on labs, and personal projects after interruptions to formal education.', sort_order: 0, is_visible: true, created_at: new Date().toISOString() },
    { id: 'time-2', kind: 'education', title: 'DISH Computer Science Level 1 Training', organization: 'DISH', period: '2023', description: 'Completed foundational computer science training covering programming concepts, problem-solving, and basic technology skills.', sort_order: 1, is_visible: true, created_at: new Date().toISOString() },
    { id: 'time-3', kind: 'experience', title: 'ICT Club Leadership', organization: 'School ICT Club', period: '2022 – 2023', description: 'Led the ICT club, organizing technology activities and helping peers learn about computers, networking, and digital skills.', sort_order: 2, is_visible: true, created_at: new Date().toISOString() },
    { id: 'time-4', kind: 'education', title: 'Ethiopian National Exam', organization: 'Ethiopia', period: 'Completed', description: 'Completed the Ethiopian national examination as part of secondary education.', sort_order: 3, is_visible: true, created_at: new Date().toISOString() },
    { id: 'time-5', kind: 'learning', title: 'Cybersecurity Hands-on Labs', organization: 'Self-directed', period: 'Ongoing', description: 'Running personal security labs: setting up IDS/IPS with Suricata, SIEM with Wazuh, packet analysis with Wireshark, and Python-based security tools.', sort_order: 4, is_visible: true, created_at: new Date().toISOString() },
    { id: 'time-6', kind: 'learning', title: 'Web Development', organization: 'Self-directed', period: 'Ongoing', description: 'Learning React, TypeScript, and modern web development by building real projects including this portfolio website.', sort_order: 5, is_visible: true, created_at: new Date().toISOString() },
    { id: 'time-7', kind: 'experience', title: 'Photo & Video Editing', organization: 'Self-directed', period: '2021 – Ongoing', description: 'Developed creative skills in photo and video editing, working on personal projects and learning visual storytelling alongside technical studies.', sort_order: 6, is_visible: true, created_at: new Date().toISOString() },
  ],
};

const STORAGE_PREFIX = 'portfolio_cms_table_';

export function getLocalTableData<T extends ContentTable>(table: T): Tables<T>[] {
  if (typeof window === 'undefined') return (INITIAL_PORTFOLIO_DATA[table] || []) as Tables<T>[];
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${table}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as Tables<T>[];
    }
  } catch (e) {
    console.error(`Failed to read local data for ${table}:`, e);
  }
  const initial = (INITIAL_PORTFOLIO_DATA[table] || []) as Tables<T>[];
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${table}`, JSON.stringify(initial));
  } catch {
    // Ignore storage quota or access errors in restricted environments
  }
  return initial;
}

export function setLocalTableData<T extends ContentTable>(table: T, data: Tables<T>[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${table}`, JSON.stringify(data));
    triggerPortfolioSync(table);
  } catch (e) {
    console.error(`Failed to store local data for ${table}:`, e);
  }
}