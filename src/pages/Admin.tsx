import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContentEditor } from '@/components/admin/ContentEditor';
import { Inbox } from '@/components/admin/Inbox';
import { ArrowLeft, LogOut, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import type { ContentTable } from '@/hooks/use-portfolio';

const sections: [ContentTable, string][] = [['site_settings', 'Intro & links'], ['projects', 'Projects'], ['skills', 'Skills'], ['certifications', 'Certificates'], ['timeline_items', 'Experience & education']];
export default function Admin() {
  const [access, setAccess] = useState<'loading' | 'signedout' | 'denied' | 'admin'>('loading');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState(''), [password, setPassword] = useState(''), [busy, setBusy] = useState(false);
  useEffect(() => {
    let live = true, version = 0;
    const check = async () => {
      const current = ++version;
      const { data, error } = await supabase.auth.getUser();
      if (!live || version !== current) return;
      if (error || !data.user) { setAccess('signedout'); return; }
      const result = await supabase.rpc('has_role', { _user_id: data.user.id, _role: 'admin' });
      if (live && version === current) setAccess(!result.error && result.data === true ? 'admin' : 'denied');
    };
    check();
    const { data } = supabase.auth.onAuthStateChange(() => { setAccess('loading'); window.setTimeout(check, 0); });
    return () => { live = false; data.subscription.unsubscribe(); };
  }, []);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true);
    const result = mode === 'login' ? await supabase.auth.signInWithPassword({ email, password }) : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/admin` } });
    setBusy(false);
    if (result.error) toast.error(result.error.message); else if (mode === 'signup' && !result.data.session) toast.success('Check your email to confirm your account, then sign in.');
  };
  const google = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth('google', { redirect_uri: `${window.location.origin}/admin` });
    if (result.error) toast.error('Google sign-in could not start. Please try again.');
    setBusy(false);
  };
  return <main className="min-h-screen bg-background px-4 py-10"><div className="mx-auto max-w-6xl"><div className="mb-10 flex flex-wrap items-center justify-between gap-4"><Button variant="ghost" asChild><Link to="/"><ArrowLeft/>Portfolio</Link></Button>{access !== 'signedout' && access !== 'loading' && <Button variant="outline" onClick={() => supabase.auth.signOut()}><LogOut/>Sign out</Button>}</div>{access === 'loading' ? <p role="status">Checking access…</p> : access === 'admin' ? <><p className="editorial-kicker mb-3 flex items-center gap-2"><ShieldCheck className="h-4 w-4"/>Private workspace</p><h1 className="mb-10 text-3xl font-bold">Your portfolio</h1><Tabs defaultValue="site_settings"><TabsList className="mb-8 flex h-auto w-full flex-wrap justify-start gap-2 bg-transparent p-0">{sections.map(([id, label]) => <TabsTrigger key={id} value={id} className="border border-border">{label}</TabsTrigger>)}<TabsTrigger value="enquiries" className="border border-border">Enquiries</TabsTrigger><TabsTrigger value="comments" className="border border-border">Comments</TabsTrigger></TabsList>{sections.map(([id]) => <TabsContent key={id} value={id}><ContentEditor table={id}/></TabsContent>)}<TabsContent value="enquiries"><Inbox/></TabsContent><TabsContent value="comments"><Inbox comments/></TabsContent></Tabs></> : access === 'denied' ? <div className="mx-auto max-w-md py-16"><h1 className="text-2xl font-bold">Owner access only</h1><p className="mt-4 text-muted-foreground">This account doesn’t have permission to edit the portfolio.</p></div> : <div className="mx-auto max-w-sm py-12"><ShieldCheck className="mb-5 h-8 w-8 text-primary"/><h1 className="text-3xl font-bold">Owner access</h1><form onSubmit={submit} className="mt-8 space-y-4"><label className="block text-sm" htmlFor="owner-email">Email</label><Input id="owner-email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)}/><label className="block text-sm" htmlFor="owner-password">Password</label><Input id="owner-password" type="password" minLength={8} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} required value={password} onChange={e => setPassword(e.target.value)}/><Button disabled={busy} className="w-full" type="submit">{busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}</Button></form><Button variant="outline" className="mt-3 w-full" disabled={busy} onClick={google}>Continue with Google</Button><Button variant="link" className="mt-4 w-full" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>{mode === 'login' ? 'Create owner account' : 'Already have an account? Sign in'}</Button></div>}</div></main>;
}
