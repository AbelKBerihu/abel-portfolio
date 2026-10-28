import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShieldCheck, ShieldAlert, KeyRound, QrCode, Copy, Check, Trash2, Smartphone } from 'lucide-react';
import { toast } from 'sonner';

interface Factor {
  id: string;
  friendly_name?: string;
  factor_type: string;
  status: 'verified' | 'unverified';
  created_at: string;
}

export function SecurityMfaManager() {
  const [factors, setFactors] = useState<Factor[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  // Enrollment state
  const [enrollData, setEnrollData] = useState<{
    factorId: string;
    qrCode: string;
    secret: string;
  } | null>(null);
  const [verifyCode, setVerifyCode] = useState('');
  const [copied, setCopied] = useState(false);

  const loadFactors = async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase.auth.mfa.listFactors();
      if (!error && data) {
        const totpList = (data.totp || []) as unknown as Factor[];
        setFactors(totpList.filter(f => f.status === 'verified'));
      }
    } catch (err) {
      console.warn('Could not list MFA factors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFactors();
  }, []);

  const startEnrollment = async () => {
    if (!isSupabaseConfigured) {
      toast.error('Supabase is not configured.');
      return;
    }
    setBusy(true);
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: 'Abel Portfolio Admin',
        issuer: 'Abel Kebede Portfolio',
      });

      if (error) throw error;

      if (data && data.totp) {
        setEnrollData({
          factorId: data.id,
          qrCode: data.totp.qr_code,
          secret: data.totp.secret,
        });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to start MFA setup';
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollData || verifyCode.trim().length !== 6) {
      toast.error('Please enter the 6-digit code from your authenticator app.');
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.auth.mfa.challengeAndVerify({
        factorId: enrollData.factorId,
        code: verifyCode.trim(),
      });

      if (error) throw error;

      toast.success('Two-factor authenticator activated successfully!');
      setEnrollData(null);
      setVerifyCode('');
      await loadFactors();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Invalid verification code. Please try again.';
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  const unenrollFactor = async (factorId: string) => {
    if (!window.confirm('Disable this authenticator? You will only need your email and password to sign in.')) {
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.auth.mfa.unenroll({ factorId });
      if (error) throw error;
      toast.success('Authenticator removed.');
      await loadFactors();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to remove authenticator';
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  const copySecret = () => {
    if (!enrollData?.secret) return;
    navigator.clipboard.writeText(enrollData.secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Secret key copied to clipboard.');
  };

  return (
    <div className="rounded-lg border border-border bg-card p-6 md:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <KeyRound className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold font-jetbrains">Authenticator & Security (2FA)</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Protect your admin portal with Time-based One-Time Password (TOTP) two-factor authentication (Google Authenticator, Microsoft Authenticator, or 1Password).
          </p>
        </div>

        {factors.length > 0 && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="h-4 w-4" /> 2FA Active & Protected
          </span>
        )}
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Checking security status…</p>
      ) : factors.length > 0 ? (
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-secondary/20 p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Smartphone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">
                  {factors[0].friendly_name || 'Authenticator App'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Enabled on {new Date(factors[0].created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              disabled={busy}
              onClick={() => unenrollFactor(factors[0].id)}
              className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30 gap-1.5"
            >
              <Trash2 className="h-3.5 w-3.5" /> Disable 2FA
            </Button>
          </div>
        </div>
      ) : !enrollData ? (
        <div className="rounded-lg border border-border bg-secondary/10 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1 max-w-xl">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-amber-500" />
              Two-Factor Authentication is Currently Disabled
            </h3>
            <p className="text-xs text-muted-foreground">
              Add a second layer of defense. Whenever you sign in, you will be prompted for a 6-digit code from your authenticator app on your phone.
            </p>
          </div>

          <Button
            onClick={startEnrollment}
            disabled={busy}
            className="gap-2 font-semibold shrink-0"
          >
            <QrCode className="h-4 w-4" /> Setup Authenticator App
          </Button>
        </div>
      ) : (
        /* Enrollment In-Progress View */
        <div className="rounded-lg border border-primary/40 bg-secondary/20 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <QrCode className="h-4 w-4 text-primary" /> Scan QR Code with Your Authenticator App
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEnrollData(null)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Cancel
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* QR Code Container */}
            <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-inner">
              <img
                src={enrollData.qrCode}
                alt="Authenticator QR Code"
                className="h-48 w-48 object-contain"
              />
              <span className="text-[10px] text-gray-500 font-mono mt-2">
                Scan with Google Authenticator or Authy
              </span>
            </div>

            {/* Secret key & Verification form */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Manual Entry Key
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    readOnly
                    value={enrollData.secret}
                    className="font-mono text-xs bg-background"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={copySecret}
                    aria-label="Copy secret"
                  >
                    {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <form onSubmit={handleVerify} className="space-y-3 pt-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                  Enter 6-digit Code from Authenticator
                </label>
                <Input
                  type="text"
                  maxLength={6}
                  placeholder="000000"
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ''))}
                  className="font-mono text-center tracking-widest text-lg font-bold"
                  autoFocus
                  required
                />
                <Button
                  type="submit"
                  disabled={busy || verifyCode.trim().length !== 6}
                  className="w-full font-semibold gap-2"
                >
                  <ShieldCheck className="h-4 w-4" />
                  {busy ? 'Verifying…' : 'Verify & Enable 2FA'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
