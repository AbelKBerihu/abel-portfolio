import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useSettings, triggerPortfolioSync } from '@/hooks/use-portfolio';
import { getLocalTableData, setLocalTableData } from '@/lib/portfolio-store';
import type { Tables } from '@/integrations/supabase/types';
import {
  Sliders,
  Calendar,
  Layers,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Save,
  Check,
  Eye,
  Sparkles,
  Terminal,
} from 'lucide-react';
import { toast } from 'sonner';

export function SiteSettingsManager() {
  const queryClient = useQueryClient();
  const { settings } = useSettings();

  // Focus areas state
  const [focusTags, setFocusTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');

  // Calendar rail mode state: 'both' | 'left' | 'right' | 'none'
  const [calendarMode, setCalendarMode] = useState<'both' | 'left' | 'right' | 'none'>('both');

  // Terminal animated prompt text
  const [terminalPrompt, setTerminalPrompt] = useState('');

  const [busy, setBusy] = useState(false);

  // Sync settings when loaded
  useEffect(() => {
    const rawTags = settings.hero_focus_tags ?? 'Security Operations, Network Analysis';
    setFocusTags(
      rawTags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean)
    );

    setCalendarMode((settings.calendar_rail_mode as 'both' | 'left' | 'right' | 'none') || 'both');
    setTerminalPrompt(settings.terminal_prompt || '$ 01 / my path');
  }, [settings.hero_focus_tags, settings.calendar_rail_mode, settings.terminal_prompt]);

  // Persist a single setting key-value
  const saveSetting = async (key: string, value: string) => {
    // 1. Update local storage
    const currentSettings = [...(getLocalTableData('site_settings') as Tables<'site_settings'>[])];
    const idx = currentSettings.findIndex(s => s.key === key);
    if (idx !== -1) {
      currentSettings[idx] = { ...currentSettings[idx], value, updated_at: new Date().toISOString() };
    } else {
      currentSettings.push({ key, value, updated_at: new Date().toISOString() });
    }
    setLocalTableData('site_settings', currentSettings);

    // 2. Persist to Supabase if configured
    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('site_settings')
          .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
      } catch (err) {
        console.warn(`Failed to sync ${key} to Supabase:`, err);
      }
    }

    // 3. Invalidate React Query cache & broadcast sync
    queryClient.invalidateQueries({ queryKey: ['portfolio', 'site_settings'] });
    triggerPortfolioSync('site_settings');
  };

  // Add focus area tag
  const handleAddTag = () => {
    const trimmed = newTagInput.trim();
    if (!trimmed) return;
    if (focusTags.includes(trimmed)) {
      toast.error('This focus tag already exists.');
      return;
    }
    const updated = [...focusTags, trimmed];
    setFocusTags(updated);
    setNewTagInput('');
    saveSetting('hero_focus_tags', updated.join(', '));
    toast.success(`Added focus area "${trimmed}".`);
  };

  // Remove focus area tag
  const handleRemoveTag = (index: number) => {
    const removedName = focusTags[index];
    const updated = focusTags.filter((_, i) => i !== index);
    setFocusTags(updated);
    saveSetting('hero_focus_tags', updated.join(', '));
    toast.success(`Removed "${removedName}".`);
  };

  // Move tag order
  const handleMoveTag = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= focusTags.length) return;
    const updated = [...focusTags];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setFocusTags(updated);
    saveSetting('hero_focus_tags', updated.join(', '));
  };

  // Set calendar mode
  const handleSetCalendarMode = (mode: 'both' | 'left' | 'right' | 'none') => {
    setCalendarMode(mode);
    saveSetting('calendar_rail_mode', mode);
    toast.success(`Calendar rails set to: ${mode.toUpperCase()}`);
  };

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h2 className="text-xl font-bold font-jetbrains flex items-center gap-2">
            <Sliders className="h-5 w-5 text-primary" /> Site Settings & Tools
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Customize header focus areas, toggle calendar rails, and configure website behavior directly from the admin dashboard.
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Tool 1: Header Focus Areas & Badges Manager */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Layers className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-base font-jetbrains">Header Focus Areas (Hero Tags)</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Manage the numbered specialties displayed in your intro (e.g. <code>01 / Security Operations</code>).
              Add, reorder, or delete items. Note: <code>03 / Full-Stack Development</code> has been removed.
            </p>

            {/* List of current tags */}
            <div className="space-y-2 mb-4">
              {focusTags.map((tag, idx) => (
                <div
                  key={tag}
                  className="flex items-center justify-between gap-2 rounded-lg border border-border/80 bg-background/60 px-3 py-2 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-primary font-bold">
                      {String(idx + 1).padStart(2, '0')} /
                    </span>
                    <span className="font-medium">{tag}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveTag(idx, 'up')}
                      className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-opacity"
                      title="Move up"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === focusTags.length - 1}
                      onClick={() => handleMoveTag(idx, 'down')}
                      className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-opacity"
                      title="Move down"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(idx)}
                      className="p-1 text-muted-foreground hover:text-destructive transition-colors ml-1"
                      title="Delete focus area"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {focusTags.length === 0 && (
                <p className="text-xs text-muted-foreground italic py-3 text-center border border-dashed border-border rounded">
                  No focus areas added yet.
                </p>
              )}
            </div>

            {/* Add new tag input */}
            <div className="flex gap-2 mb-6">
              <Input
                placeholder="e.g. Penetration Testing, Threat Intelligence..."
                value={newTagInput}
                onChange={e => setNewTagInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className="text-sm"
              />
              <Button type="button" onClick={handleAddTag} size="sm" className="shrink-0 font-medium">
                <Plus className="mr-1.5 h-4 w-4" /> Add
              </Button>
            </div>
          </div>

          {/* Live Preview of Hero Tags */}
          <div className="rounded-lg border border-border/80 bg-background/80 p-3.5 text-xs">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-jetbrains block mb-2 font-bold">
              Live Public Preview
            </span>
            <div className="flex flex-wrap gap-x-5 gap-y-2 font-jetbrains text-muted-foreground">
              {focusTags.map((tag, idx) => (
                <span key={tag} className="flex items-center gap-1.5">
                  <span className="text-primary font-mono">{String(idx + 1).padStart(2, '0')} /</span>
                  <span>{tag}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Tool 2: Calendar Rails Mode Toggle */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-base font-jetbrains">Side Calendar Rails Controller</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Toggle the fixed date/time calendar rails shown on the left and right sides of desktop screens (Ethiopian Calendar on left, Gregorian on right).
            </p>

            {/* 4 Mode Selection Cards */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {/* Both Rails */}
              <button
                type="button"
                onClick={() => handleSetCalendarMode('both')}
                className={`flex flex-col items-start p-3.5 rounded-lg border text-left transition-all ${
                  calendarMode === 'both'
                    ? 'border-primary bg-primary/10 shadow-sm'
                    : 'border-border bg-background/50 hover:bg-card/90'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="font-jetbrains font-bold text-xs">Both Sides</span>
                  {calendarMode === 'both' && <Check className="h-4 w-4 text-primary" />}
                </div>
                <span className="text-[11px] text-muted-foreground leading-snug">
                  Left: Ethiopian (ETH)
                  <br />
                  Right: Gregorian (GREG)
                </span>
              </button>

              {/* Left Only */}
              <button
                type="button"
                onClick={() => handleSetCalendarMode('left')}
                className={`flex flex-col items-start p-3.5 rounded-lg border text-left transition-all ${
                  calendarMode === 'left'
                    ? 'border-primary bg-primary/10 shadow-sm'
                    : 'border-border bg-background/50 hover:bg-card/90'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="font-jetbrains font-bold text-xs">Left Rail Only</span>
                  {calendarMode === 'left' && <Check className="h-4 w-4 text-primary" />}
                </div>
                <span className="text-[11px] text-muted-foreground leading-snug">
                  Shows only the Ethiopian Calendar rail on the left.
                </span>
              </button>

              {/* Right Only */}
              <button
                type="button"
                onClick={() => handleSetCalendarMode('right')}
                className={`flex flex-col items-start p-3.5 rounded-lg border text-left transition-all ${
                  calendarMode === 'right'
                    ? 'border-primary bg-primary/10 shadow-sm'
                    : 'border-border bg-background/50 hover:bg-card/90'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="font-jetbrains font-bold text-xs">Right Rail Only</span>
                  {calendarMode === 'right' && <Check className="h-4 w-4 text-primary" />}
                </div>
                <span className="text-[11px] text-muted-foreground leading-snug">
                  Shows only the Gregorian Calendar rail on the right.
                </span>
              </button>

              {/* Disabled / Off */}
              <button
                type="button"
                onClick={() => handleSetCalendarMode('none')}
                className={`flex flex-col items-start p-3.5 rounded-lg border text-left transition-all ${
                  calendarMode === 'none'
                    ? 'border-primary bg-primary/10 shadow-sm'
                    : 'border-border bg-background/50 hover:bg-card/90'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="font-jetbrains font-bold text-xs text-destructive">Hidden / Off</span>
                  {calendarMode === 'none' && <Check className="h-4 w-4 text-primary" />}
                </div>
                <span className="text-[11px] text-muted-foreground leading-snug">
                  Hides both side calendar rails completely.
                </span>
              </button>
            </div>
          </div>

          {/* Current Status Badge */}
          <div className="rounded-lg border border-border/80 bg-background/80 p-3.5 text-xs">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-jetbrains block mb-1 font-bold">
              Active Calendar Configuration
            </span>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-jetbrains font-medium capitalize">
                {calendarMode === 'none' ? 'Hidden from website' : `${calendarMode} active on XL screens`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
