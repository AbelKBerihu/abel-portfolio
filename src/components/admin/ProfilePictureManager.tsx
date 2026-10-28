import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { useSettings, triggerPortfolioSync } from '@/hooks/use-portfolio';
import { getLocalTableData, setLocalTableData } from '@/lib/portfolio-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Camera, Upload, Check, Sparkles, Image as ImageIcon, Shield } from 'lucide-react';
import { toast } from 'sonner';

export function ProfilePictureManager() {
  const cache = useQueryClient();
  const { settings } = useSettings();
  const currentImage = settings.profile_image || 'https://i.pravatar.cc/300?img=11';

  const [imageUrl, setImageUrl] = useState(currentImage);
  const [busy, setBusy] = useState(false);
  const [isGateOpen, setIsGateOpen] = useState(false);

  const saveProfileImage = async (url: string) => {
    setBusy(true);
    const cleanUrl = url.trim();

    // 1. Update local store
    const currentSettings = getLocalTableData('site_settings');
    const idx = currentSettings.findIndex((s) => s.key === 'profile_image');
    if (idx !== -1) {
      currentSettings[idx] = { ...currentSettings[idx], value: cleanUrl, updated_at: new Date().toISOString() };
    } else {
      currentSettings.push({ key: 'profile_image', value: cleanUrl, updated_at: new Date().toISOString() });
    }
    setLocalTableData('site_settings', currentSettings);

    // 2. Persist to Supabase if configured
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('site_settings')
          .upsert({ key: 'profile_image', value: cleanUrl, updated_at: new Date().toISOString() });
        if (error) throw error;
      } catch (err) {
        console.warn('Supabase profile image update failed:', err);
      }
    }

    cache.invalidateQueries({ queryKey: ['portfolio', 'site_settings'] });
    triggerPortfolioSync('site_settings');
    setBusy(false);
    toast.success('Profile picture updated successfully! It is now live across your portfolio.');
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (PNG, JPG, or WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be under 5MB.');
      return;
    }

    setBusy(true);

    if (isSupabaseConfigured) {
      try {
        const ext = file.name.split('.').pop() || 'png';
        const filePath = `profile-${Date.now()}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from('portfolio-images')
          .upload(filePath, file, { contentType: file.type, upsert: true });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('portfolio-images').getPublicUrl(filePath);
        if (data?.publicUrl) {
          setImageUrl(data.publicUrl);
          await saveProfileImage(data.publicUrl);
          return;
        }
      } catch (err) {
        console.error('Image upload failed:', err);
        toast.error('Image upload failed. Falling back to local storage.');
      }
    }

    // Fallback base64 for preview / offline
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setImageUrl(base64);
      await saveProfileImage(base64);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="rounded-lg border border-border bg-card p-6 md:p-8 space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Camera className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold font-jetbrains">Profile Picture & Identity</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Update the profile picture revealed when visitors hover over your name in the Hero section and in the header aperture.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left: Uploader Controls */}
        <div className="space-y-6">
          <div className="border border-dashed border-border rounded-lg p-6 bg-secondary/20 text-center">
            <div className="relative mx-auto mb-4 h-32 w-32 rounded-full overflow-hidden border-2 border-primary/50 shadow-xl ring-4 ring-primary/10">
              <img
                src={imageUrl}
                alt="Profile Preview"
                className="h-full w-full object-cover"
              />
            </div>
            
            <p className="text-xs text-muted-foreground mb-4">
              Supports JPG, PNG, or WEBP (Max 5MB). Uploads directly to your Supabase Cloud Storage.
            </p>

            <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow">
              <Upload className="h-4 w-4" />
              <span>{busy ? 'Uploading…' : 'Upload New Picture'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={busy}
                className="hidden"
              />
            </label>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Or paste direct image URL
            </label>
            <div className="flex gap-2">
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/my-photo.jpg"
                className="font-mono text-xs"
              />
              <Button
                variant="outline"
                disabled={busy || !imageUrl.trim() || imageUrl === currentImage}
                onClick={() => saveProfileImage(imageUrl)}
                className="gap-1.5 shrink-0"
              >
                <Check className="h-4 w-4 text-emerald-500" /> Save URL
              </Button>
            </div>
          </div>
        </div>

        {/* Right: Live Interactive "Gate-Open" Shutter Simulator */}
        <div className="rounded-lg border border-border bg-secondary/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1.5 text-xs font-jetbrains text-muted-foreground">
              <Shield className="h-4 w-4 text-primary" />
              <span>Gate-Open Shutter Simulator</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
              Interactive Test
            </span>
          </div>

          <p className="text-xs text-muted-foreground mb-6">
            Hover over your name below to test the double-door security gate reveal effect exactly as visitors experience it on your homepage:
          </p>

          <div className="flex justify-center py-6">
            <div
              className="relative inline-block cursor-pointer select-none group"
              onMouseEnter={() => setIsGateOpen(true)}
              onMouseLeave={() => setIsGateOpen(false)}
            >
              <div className="flex items-center gap-2">
                {/* Double Door Shutter Frame */}
                <div className="relative h-16 w-16 rounded-full overflow-hidden border border-primary/40 bg-card shadow-inner flex items-center justify-center">
                  {/* Revealed Picture Inside */}
                  <img
                    src={imageUrl}
                    alt="Abel Profile"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  
                  {/* Left Door Panel */}
                  <motion.div
                    initial={false}
                    animate={{ x: isGateOpen ? "-105%" : "0%" }}
                    transition={{ type: "spring", stiffness: 300, damping: 26 }}
                    className="absolute inset-y-0 left-0 w-1/2 bg-background border-r border-primary/30 flex items-center justify-end pr-1 z-10"
                  >
                    <div className="h-6 w-0.5 bg-primary/40 rounded-full" />
                  </motion.div>

                  {/* Right Door Panel */}
                  <motion.div
                    initial={false}
                    animate={{ x: isGateOpen ? "105%" : "0%" }}
                    transition={{ type: "spring", stiffness: 300, damping: 26 }}
                    className="absolute inset-y-0 right-0 w-1/2 bg-background border-l border-primary/30 flex items-center justify-start pl-1 z-10"
                  >
                    <div className="h-6 w-0.5 bg-primary/40 rounded-full" />
                  </motion.div>
                </div>

                <div className="flex flex-col">
                  <span className="text-2xl font-bold font-jetbrains tracking-tight group-hover:text-primary transition-colors">
                    Abel Kebede
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1 font-mono">
                    <Sparkles className="h-3 w-3 text-primary" />
                    {isGateOpen ? 'Gate open — picture revealed!' : 'Hover to open gate'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
