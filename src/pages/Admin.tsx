import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContentEditor } from '@/components/admin/ContentEditor';
import { LearningManager } from '@/components/admin/LearningManager';
import { ProfilePictureManager } from '@/components/admin/ProfilePictureManager';
import { CvManager } from '@/components/admin/CvManager';
import { SecurityMfaManager } from '@/components/admin/SecurityMfaManager';
import { Inbox } from '@/components/admin/Inbox';
import { ArrowLeft, LogOut, ShieldCheck, Lock, Eye, EyeOff, BookOpen, Camera, KeyRound, FileText } from 'lucide-react';
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

  // 2FA TOTP Challenge state
  const [needsMfa, setNeedsMfa] = useState(false);
  const [mfaChallengeFactorId, setMfaChallengeFactorId] = useState('');
  const [mfaCode, setMfaCode] = useState('');

  useEffect(() => {
    let live = true;
    let version = 0;

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

      // Check if user requires MFA AAL2 before granting admin access
      try {
        const { data: mfaData, error: mfaError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
        if (!mfaError && mfaData && mfaData.nextLevel === 'aal2' && mfaData.currentLevel !== 'aal2') {
          const { data: factors } = await supabase.auth.mfa.listFactors();
          const totpFactor = factors?.totp?.find(f => f.status === 'verified');
          if (totpFactor) {
            setMfaChallengeFactorId(totpFactor.id);
            setNeedsMfa(true);
            setAccess('signedout');
            return;
          }
        }
      } catch (mfaErr) {
        console.warn('MFA assurance check warning:', mfaErr);
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

  const handleSignOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setAccess('signedout');
    setNeedsMfa(false);
    toast.success('Signed out successfully.');
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!isSupabaseConfigured) {
      setBusy(false);
      toast.error('Authentication gateway not available.');
      return;
    }

    const result = await supabase.auth.signInWithPassword({ email: cleanEmail, password: cleanPass });
    if (result.error) {
      setBusy(false);
      toast.error(result.error.message);
      return;
    }

    // Check if 2FA TOTP is required
    try {
      const { data: mfaData, error: mfaError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (!mfaError && mfaData && mfaData.nextLevel === 'aal2' && mfaData.currentLevel !== 'aal2') {
        const { data: factors } = await supabase.auth.mfa.listFactors();
        const totpFactor = factors?.totp?.find(f => f.status === 'verified');
        if (totpFactor) {
          setMfaChallengeFactorId(totpFactor.id);
          setNeedsMfa(true);
          setBusy(false);
          return;
        }
      }
    } catch (mfaErr) {
      console.warn('MFA check bypass:', mfaErr);
    }

    setBusy(false);
  };

  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { error } = await supabase.auth.mfa.challengeAndVerify({
        factorId: mfaChallengeFactorId,
        code: mfaCode.trim(),
      });
      if (error) throw error;
      setNeedsMfa(false);
      setMfaCode('');
      toast.success('Two-factor authentication verified.');
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        const result = await supabase.rpc('has_role', { _user_id: userData.user.id, _role: 'admin' });
        setAccess(!result.error && result.data === true ? 'admin' : 'denied');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Invalid code';
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  const googleSignIn = async () => {
    setBusy(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/admin`,
      },
    });
    if (error) {
      toast.error(error.message || 'Google sign-in could not start.');
      setBusy(false);
    }
  };

  const renderLogin = () => (
    <div className="mx-auto max-w-sm py-12">
      <div className="mb-6 flex items-center gap-3">
        <Lock className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-bold font-jetbrains">Owner access</h1>
      </div>
      <p className="mb-6 text-muted-foreground text-sm">
        Sign in to manage your portfolio content, projects, skills, certificates, and messages.
      </p>

      {needsMfa ? (
        <form onSubmit={handleMfaSubmit} className="space-y-4">
          <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 text-xs font-jetbrains">
            <p className="font-semibold text-primary mb-1 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" /> Two-Factor Authentication
            </p>
            <p className="text-muted-foreground">
              Enter the 6-digit verification code generated by your authenticator app.
            </p>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium" htmlFor="mfa-code">Authenticator Code</label>
            <Input
              id="mfa-code"
              type="text"
              maxLength={6}
              placeholder="000000"
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
              className="font-mono text-center tracking-widest text-lg font-bold"
              autoFocus
              required
            />
          </div>
          <Button disabled={busy || mfaCode.trim().length !== 6} className="w-full font-semibold" type="submit">
            {busy ? 'Verifying…' : 'Verify & Continue'}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => { setNeedsMfa(false); supabase.auth.signOut(); }}
            className="w-full text-xs text-muted-foreground"
          >
            Cancel and Return
          </Button>
        </form>
      ) : (
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
              placeholder="name@example.com"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium" htmlFor="owner-password">Password</label>
            <div className="relative">
              <Input
                id="owner-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
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
          <Button disabled={busy || !isSupabaseConfigured} className="w-full font-semibold" type="submit">
            {busy ? 'Authenticating…' : 'Authenticate'}
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={googleSignIn}
            disabled={busy || !isSupabaseConfigured}
          >
            Continue with Google
          </Button>
        </form>
      )}
    </div>
  );

  const renderDenied = () => (
    <div className="mx-auto max-w-sm py-12 text-center">
      <Lock className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
      <h1 className="mb-2 text-2xl font-bold font-jetbrains">Access restricted</h1>
      <p className="mb-6 text-muted-foreground text-sm">
        This account does not have administrator privileges for this portfolio.
      </p>
      <Button variant="outline" onClick={handleSignOut}>
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
          <span>Live Sync Connected</span>
        </div>
      </div>
      <h1 className="mb-2 text-3xl font-bold font-jetbrains">Your portfolio</h1>
      <p className="mb-8 text-muted-foreground">
        Manage your profile photo, projects, skills, certificates, learning roadmap, and incoming messages. Edits update live in real time.
      </p>
      <Tabs defaultValue="profile_picture">
        <TabsList className="mb-8 flex h-auto w-full flex-wrap justify-start gap-2 bg-transparent p-0">
          <TabsTrigger value="profile_picture" className="border border-border">
            <Camera className="mr-1.5 h-3.5 w-3.5 text-primary" /> Profile Picture & Shutter
          </TabsTrigger>
          <TabsTrigger value="cv_manager" className="border border-border">
            <FileText className="mr-1.5 h-3.5 w-3.5 text-primary" /> CV / Resume
          </TabsTrigger>
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
          <TabsTrigger value="security_2fa" className="border border-border">
            <KeyRound className="mr-1.5 h-3.5 w-3.5 text-primary" /> Security & 2FA
          </TabsTrigger>
        </TabsList>
        <TabsContent value="profile_picture">
          <ProfilePictureManager />
        </TabsContent>
        <TabsContent value="cv_manager">
          <CvManager />
        </TabsContent>
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
        <TabsContent value="security_2fa">
          <SecurityMfaManager />
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
