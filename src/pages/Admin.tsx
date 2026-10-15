import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContentEditor } from '@/components/admin/ContentEditor';
import { Inbox } from '@/components/admin/Inbox';
import { ArrowLeft, LogOut, ShieldCheck, Lock } from 'lucide-react';
import { toast } from 'sonner';
import type { ContentTable } from '@/hooks/use-portfolio';

const sections: [ContentTable, string][] = [
  ['site_settings', 'Intro & links'],
  ['projects', 'Projects'],
  ['skills', 'Skills'],
  ['certifications', 'Certificates'],
  ['timeline_items', 'Experience & education'],
];

export default function Admin() {
  const [access, setAccess] = useState<'loading' | 'signedout' | 'denied' | 'admin'>('loading');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let live = true;
    let version = 0;

    const check = async () => {
      const current = ++version;
      const { data, error } = await supabase.auth.getUser();
      if (!live || version !== current) return;
      if (error || !data.user) {
        setAccess('signedout');
        return;
      }
      const result = await supabase.rpc('has_role', { _user_id: data.user.id, _role: 'admin' });
      if (live && version === current) {
        setAccess(!result.error && result.data === true ? 'admin' : 'denied');
      }
    };

    check();
    const { data } = supabase.auth.onAuthStateChange(() => {
      setAccess('loading');
      window.setTimeout(check, 0);
    });
    return () => {
      live = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const result = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (result.error) toast.error(result.error.message);
  };

  const renderLogin = () => (
    <div className="mx-auto max-w-sm py-12">
      <div className="mb-6 flex items-center gap-3">
        <Lock className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-bold">Owner access</h1>
      </div>
      <p className="mb-8 text-muted-foreground">
        Sign in to manage your portfolio content, projects, skills, and certifications.
      </p>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium" htmlFor="owner-email">Email</label>
          <Input
            id="owner-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium" htmlFor="owner-password">Password</label>
          <Input
            id="owner-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
          />
        </div>
        <Button disabled={busy} className="w-full" type="submit">
          {busy ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
    </div>
  );

  const renderDenied = () => (
    <div className="mx-auto max-w-md py-16 text-center">
      <ShieldCheck className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
      <h1 className="text-2xl font-bold">Owner access only</h1>
      <p className="mt-4 text-muted-foreground">
        This account doesn't have permission to edit the portfolio.
      </p>
      <Button variant="outline" className="mt-6" onClick={() => supabase.auth.signOut()}>
        Sign out
      </Button>
    </div>
  );

  const renderAdmin = () => (
    <>
      <div className="mb-8 flex items-center gap-2">
        <ShieldCheck className="h-5 w-5 text-primary" />
        <p className="editorial-kicker">Private workspace</p>
      </div>
      <h1 className="mb-10 text-3xl font-bold">Your portfolio</h1>
      <Tabs defaultValue="site_settings">
        <TabsList className="mb-8 flex h-auto w-full flex-wrap justify-start gap-2 bg-transparent p-0">
          {sections.map(([id, label]) => (
            <TabsTrigger key={id} value={id} className="border border-border">
              {label}
            </TabsTrigger>
          ))}
          <TabsTrigger value="enquiries" className="border border-border">Enquiries</TabsTrigger>
          <TabsTrigger value="comments" className="border border-border">Comments</TabsTrigger>
        </TabsList>
        {sections.map(([id]) => (
          <TabsContent key={id} value={id}>
            <ContentEditor table={id} />
          </TabsContent>
        ))}
        <TabsContent value="enquiries">
          <Inbox />
        </TabsContent>
        <TabsContent value="comments">
          <Inbox comments />
        </TabsContent>
      </Tabs>
    </>
  );

  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <Button variant="ghost" asChild>
            <Link to="/"><ArrowLeft /> Portfolio</Link>
          </Button>
          {access !== 'signedout' && access !== 'loading' && (
            <Button variant="outline" onClick={() => supabase.auth.signOut()}>
              <LogOut /> Sign out
            </Button>
          )}
        </div>

        {access === 'loading' && (
          <div className="py-20 text-center">
            <p role="status" className="text-muted-foreground">Checking access…</p>
          </div>
        )}
        {access === 'signedout' && renderLogin()}
        {access === 'denied' && renderDenied()}
        {access === 'admin' && renderAdmin()}
      </div>
    </main>
  );
}
