import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContentEditor } from '@/components/admin/ContentEditor';
import { LearningManager } from '@/components/admin/LearningManager';
import { Inbox } from '@/components/admin/Inbox';
import { ArrowLeft, LogOut, ShieldCheck, Lock, Eye, EyeOff, Sparkles, BookOpen } from 'lucide-react';
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
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let live = true;
    let version = 0;

    // Check active session in sessionStorage
    if (sessionStorage.getItem('portfolio_owner_session') === 'active') {
      setAccess('admin');
      return;
    }

    const check = async () => {
      if (!isSupabaseConfigured) {
        setAccess('signedout');
        return;
      }
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
      if (sessionStorage.getItem('portfolio_owner_session') === 'active') {
        setAccess('admin');
        return;
      }
      setAccess('loading');
      window.setTimeout(check, 0);
    });
    return () => {
      live = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    sessionStorage.removeItem('portfolio_owner_session');
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setAccess('signedout');
    toast.success('Signed out successfully.');
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!isSupabaseConfigured) {
      // Offline/Local Owner Passkey mode
      const storedPasskey = localStorage.getItem('owner_passkey') || 'abel2026';
      if (cleanPass === storedPasskey || cleanPass === 'abel2026') {
        sessionStorage.setItem('portfolio_owner_session', 'active');
        setAccess('admin');
        setBusy(false);
        toast.success('Welcome back, Abel! Live local CMS unlocked.');
        return;
      }
      setBusy(false);
      toast.error('Incorrect passkey. Default local passkey is abel2026');
      return;
    }

    const result = await supabase.auth.signInWithPassword({ email: cleanEmail, password: cleanPass });
    setBusy(false);
    if (result.error) {
      toast.error(result.error.message);
    }
  };

  const googleSignIn = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth('google', {
      redirect_uri: `${window.location.origin}/admin`,
    });
    if (result.error) {
      toast.error('Google sign-in could not start. Please try again.');
      setBusy(false);
    }
  };

  const renderLogin = () => (
    <div className="mx-auto max-w-sm py-12">
      <div className="mb-6 flex items-center gap-3">
        <Lock className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-bold">Owner access</h1>
      </div>
      <p className="mb-6 text-muted-foreground">
        Sign in to manage your portfolio content, projects, skills, and certifications.
      </p>

      {!isSupabaseConfigured && (
        <div className="mb-6 rounded-md border border-primary/30 bg-primary/5 p-3 text-xs font-jetbrains text-muted-foreground">
          <p className="flex items-center gap-1.5 font-semibold text-primary mb-1">
            <Sparkles className="h-3.5 w-3.5" /> Live Local CMS Mode
          </p>
          <p>Enter your owner passkey (default is <code className="text-primary font-bold">abel2026</code>) to manage content with instant real-time sync.</p>
        </div>
      )}

      <form onSubmit={submit} className="space-y-4">
        {isSupabaseConfigured && (
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
        )}
        <div>
          <label className="mb-2 block text-sm font-medium" htmlFor="owner-password">
            {isSupabaseConfigured ? 'Password' : 'Owner Passkey'}
          </label>
          <div className="relative">
            <Input
              id="owner-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isSupabaseConfigured ? 'Your password' : 'Enter passkey (e.g. abel2026)'}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <Button disabled={busy} className="w-full font-semibold" type="submit">
          {busy ? 'Authenticating…' : isSupabaseConfigured ? 'Sign in' : 'Unlock Live Admin'}
        </Button>
      </form>

      {isSupabaseConfigured && (
        <>
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">OR</span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <Button variant="outline" className="w-full" disabled={busy} onClick={googleSignIn}>
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </Button>
        </>
      )}
    </div>
  );

  const renderDenied = () => (
    <div className="mx-auto max-w-md py-16 text-center">
      <ShieldCheck className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
      <h1 className="text-2xl font-bold">Owner access only</h1>
      <p className="mt-4 text-muted-foreground">
        This account doesn't have permission to edit the portfolio.
      </p>
      <Button variant="outline" className="mt-6" onClick={handleSignOut}>
        Sign out
      </Button>
    </div>
  );

  const renderAdmin = () => (
    <>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <p className="editorial-kicker">Private workspace</p>
        </div>
        <div className="flex items-center gap-2 font-jetbrains text-xs text-muted-foreground">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>{isSupabaseConfigured ? 'Cloud Synced' : 'Live Local CMS'}</span>
        </div>
      </div>
      <h1 className="mb-2 text-3xl font-bold">Your portfolio</h1>
      <p className="mb-8 text-muted-foreground">
        Manage your projects, skills, certificates, learning roadmap, and site content. Edits update live in real time.
      </p>
      <Tabs defaultValue="site_settings">
        <TabsList className="mb-8 flex h-auto w-full flex-wrap justify-start gap-2 bg-transparent p-0">
          {sections.map(([id, label]) => (
            <TabsTrigger key={id} value={id} className="border border-border">
              {label}
            </TabsTrigger>
          ))}
          <TabsTrigger value="learning_journey" className="border border-border">
            <BookOpen className="mr-1.5 h-3.5 w-3.5 text-primary" /> Learning Journey
          </TabsTrigger>
          <TabsTrigger value="enquiries" className="border border-border">Enquiries</TabsTrigger>
          <TabsTrigger value="comments" className="border border-border">Comments</TabsTrigger>
        </TabsList>
        {sections.map(([id]) => (
          <TabsContent key={id} value={id}>
            <ContentEditor table={id} />
          </TabsContent>
        ))}
        <TabsContent value="learning_journey">
          <LearningManager />
        </TabsContent>
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
            <Button variant="outline" onClick={handleSignOut}>
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
