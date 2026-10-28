import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { useSettings, triggerPortfolioSync } from '@/hooks/use-portfolio';
import { getLocalTableData, setLocalTableData } from '@/lib/portfolio-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, Upload, Download, ExternalLink, Check, FileCheck, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export function CvManager() {
  const cache = useQueryClient();
  const { settings } = useSettings();
  const currentCvUrl = settings.cv_url || '/cv.pdf';

  const [cvUrl, setCvUrl] = useState(currentCvUrl);
  const [busy, setBusy] = useState(false);

  const saveCvUrl = async (url: string) => {
    setBusy(true);
    const cleanUrl = url.trim();

    // 1. Update local store
    const currentSettings = getLocalTableData('site_settings');
    const idx = currentSettings.findIndex((s) => s.key === 'cv_url');
    if (idx !== -1) {
      currentSettings[idx] = { ...currentSettings[idx], value: cleanUrl, updated_at: new Date().toISOString() };
    } else {
      currentSettings.push({ key: 'cv_url', value: cleanUrl, updated_at: new Date().toISOString() });
    }
    setLocalTableData('site_settings', currentSettings);

    // 2. Persist to Supabase if configured
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('site_settings')
          .upsert({ key: 'cv_url', value: cleanUrl, updated_at: new Date().toISOString() });
        if (error) throw error;
      } catch (err) {
        console.warn('Supabase cv_url update warning:', err);
      }
    }

    cache.invalidateQueries({ queryKey: ['portfolio', 'site_settings'] });
    triggerPortfolioSync('site_settings');
    setBusy(false);
    toast.success('CV updated successfully! Visitors will now download your new CV.');
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      toast.error('Please upload a PDF document (.pdf).');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      toast.error('CV file size must be under 15MB.');
      return;
    }

    setBusy(true);

    if (isSupabaseConfigured) {
      try {
        const filePath = `cv/Abel_Kebede_CV_${Date.now()}.pdf`;

        const { error: uploadError } = await supabase.storage
          .from('portfolio-images')
          .upload(filePath, file, { contentType: 'application/pdf', upsert: true });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('portfolio-images').getPublicUrl(filePath);
        if (data?.publicUrl) {
          setCvUrl(data.publicUrl);
          await saveCvUrl(data.publicUrl);
          return;
        }
      } catch (err) {
        console.error('CV upload failed:', err);
        toast.error('Upload failed. Please check your connection.');
      }
    }

    setBusy(false);
  };

  return (
    <div className="rounded-lg border border-border bg-card p-6 md:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold font-jetbrains">Curriculum Vitae (CV) Manager</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Upload your latest resume/CV document. Visitors who click "Download CV" in the Hero section will receive this file.
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
          <FileCheck className="h-4 w-4" /> PDF Ready
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left: Upload Card */}
        <div className="border border-dashed border-border rounded-lg p-6 bg-secondary/20 text-center space-y-4">
          <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Upload className="h-8 w-8" />
          </div>

          <div>
            <h3 className="font-semibold text-sm font-jetbrains">Upload New CV Document</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Supports standard PDF documents (up to 15MB). Uploads directly to your Supabase Cloud Storage.
            </p>
          </div>

          <div>
            <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow">
              <Upload className="h-4 w-4" />
              <span>{busy ? 'Uploading CV…' : 'Select New CV (PDF)'}</span>
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileUpload}
                disabled={busy}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Right: Active CV Preview & Links */}
        <div className="rounded-lg border border-border bg-secondary/10 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-jetbrains uppercase tracking-wider text-muted-foreground">
              Currently Active CV
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Live on Site
            </span>
          </div>

          <div className="rounded-md border border-border bg-background p-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <FileText className="h-5 w-5 text-primary shrink-0" />
              <span className="font-mono text-xs truncate text-foreground">
                {currentCvUrl}
              </span>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <Button size="sm" variant="ghost" asChild>
                <a href={currentCvUrl} target="_blank" rel="noopener noreferrer" className="gap-1 text-xs">
                  <ExternalLink className="h-3.5 w-3.5" /> View
                </a>
              </Button>
              <Button size="sm" variant="outline" asChild>
                <a href={currentCvUrl} download="Abel_Kebede_CV.pdf" className="gap-1 text-xs">
                  <Download className="h-3.5 w-3.5" /> Test Download
                </a>
              </Button>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Or specify a direct PDF / Google Drive URL
            </label>
            <div className="flex gap-2">
              <Input
                value={cvUrl}
                onChange={(e) => setCvUrl(e.target.value)}
                placeholder="https://example.com/my-cv.pdf"
                className="font-mono text-xs"
              />
              <Button
                variant="outline"
                disabled={busy || !cvUrl.trim() || cvUrl === currentCvUrl}
                onClick={() => saveCvUrl(cvUrl)}
                className="gap-1.5 shrink-0"
              >
                <Check className="h-4 w-4 text-emerald-500" /> Save URL
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
