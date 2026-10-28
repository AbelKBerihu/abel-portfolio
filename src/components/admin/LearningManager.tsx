import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { usePortfolio, useSettings, triggerPortfolioSync } from '@/hooks/use-portfolio';
import { getLocalTableData, setLocalTableData } from '@/lib/portfolio-store';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, CheckCircle2, Trash2, GraduationCap, Sparkles, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

export function LearningManager() {
  const cache = useQueryClient();
  const { settings } = useSettings();
  const { data: timelineItems = [] } = usePortfolio('timeline_items');

  const [newTopic, setNewTopic] = useState('');
  const [graduateModal, setGraduateModal] = useState<{ topic: string } | null>(null);
  const [gradTitle, setGradTitle] = useState('');
  const [gradOrg, setGradOrg] = useState('Self-directed & Hands-on Labs');
  const [gradPeriod, setGradPeriod] = useState(new Date().getFullYear().toString());
  const [gradDesc, setGradDesc] = useState('');
  const [busy, setBusy] = useState(false);

  // Parse currently learning string into array
  const rawLearning = settings.currently_learning || 'Network security, Python scripting, Linux administration, Web development with React';
  const activeTopics = rawLearning
    .split(/[,;\n]/)
    .map((s) => s.trim())
    .filter(Boolean);

  const saveTopicsList = async (updatedTopics: string[]) => {
    const updatedValue = updatedTopics.join(', ');
    
    // Save to local storage
    const currentSettings = getLocalTableData('site_settings');
    const idx = currentSettings.findIndex((s) => s.key === 'currently_learning');
    if (idx !== -1) {
      currentSettings[idx] = { ...currentSettings[idx], value: updatedValue, updated_at: new Date().toISOString() };
    } else {
      currentSettings.push({ key: 'currently_learning', value: updatedValue, updated_at: new Date().toISOString() });
    }
    setLocalTableData('site_settings', currentSettings);

    // Persist to Supabase if configured
    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('site_settings')
          .upsert({ key: 'currently_learning', value: updatedValue, updated_at: new Date().toISOString() });
      } catch (err) {
        console.warn('Supabase update failed:', err);
      }
    }

    cache.invalidateQueries({ queryKey: ['portfolio', 'site_settings'] });
    triggerPortfolioSync('site_settings');
  };

  const handleAddTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newTopic.trim();
    if (!clean) return;
    if (activeTopics.includes(clean)) {
      toast.info('This topic is already in your learning list.');
      return;
    }
    const updated = [...activeTopics, clean];
    await saveTopicsList(updated);
    setNewTopic('');
    toast.success(`Added "${clean}" to Currently Learning.`);
  };

  const handleRemoveTopic = async (topicToRemove: string) => {
    const updated = activeTopics.filter((t) => t !== topicToRemove);
    await saveTopicsList(updated);
    toast.success(`Removed "${topicToRemove}".`);
  };

  const openGraduateModal = (topic: string) => {
    setGraduateModal({ topic });
    setGradTitle(`${topic} Course & Practical Labs`);
    setGradOrg('Self-directed & Practice');
    setGradPeriod(new Date().getFullYear().toString());
    setGradDesc(`Completed comprehensive study and hands-on exercises in ${topic}.`);
  };

  const handleGraduate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!graduateModal) return;
    setBusy(true);

    try {
      const topic = graduateModal.topic;

      // 1. Create new timeline/education item
      const newTimelineItem: Tables<'timeline_items'> = {
        id: `edu-${Date.now()}`,
        kind: 'education',
        title: gradTitle.trim() || topic,
        organization: gradOrg.trim(),
        period: gradPeriod.trim() || 'Completed',
        description: gradDesc.trim() || `Mastered fundamentals and practical applications of ${topic}.`,
        sort_order: timelineItems.length,
        is_visible: true,
        created_at: new Date().toISOString(),
      };

      // 2. Add to timeline_items in local storage
      const currentTimeline = getLocalTableData('timeline_items');
      currentTimeline.unshift(newTimelineItem);
      setLocalTableData('timeline_items', currentTimeline);

      // 3. Persist to Supabase if configured
      if (isSupabaseConfigured) {
        try {
          await supabase.from('timeline_items').insert(newTimelineItem);
        } catch (err) {
          console.warn('Supabase timeline insert failed:', err);
        }
      }

      // 4. Remove from active learning list
      const updatedTopics = activeTopics.filter((t) => t !== topic);
      await saveTopicsList(updatedTopics);

      // 5. Invalidate caches & trigger real-time live sync
      cache.invalidateQueries({ queryKey: ['portfolio', 'timeline_items'] });
      triggerPortfolioSync('timeline_items');

      setGraduateModal(null);
      setBusy(false);
      toast.success(`🎓 "${topic}" graduated to your Education & Timeline!`);
    } catch (err) {
      setBusy(false);
      console.error(err);
      toast.error('Failed to graduate topic.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold">Currently Learning & Education Workflow</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Track the skills, tools, and courses you are actively exploring. When you finish a topic, click <strong>"Done / Graduate"</strong> to automatically promote it into your public Education & Timeline milestones!
        </p>
      </div>

      {/* Active Learning Section */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="text-base font-semibold mb-4 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" /> Active Learning Topics ({activeTopics.length})
          </span>
        </h3>

        {/* Add Topic Input */}
        <form onSubmit={handleAddTopic} className="mb-6 flex gap-2">
          <Input
            placeholder="e.g. Reverse Engineering, Threat Hunting, Docker Security..."
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={!newTopic.trim()}>
            <Plus className="mr-1.5 h-4 w-4" /> Add Topic
          </Button>
        </form>

        {/* Active Topics Grid */}
        {activeTopics.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">No active topics. Add one above to get started.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {activeTopics.map((topic) => (
              <div
                key={topic}
                className="group flex flex-col justify-between rounded-lg border border-border bg-background/60 p-4 transition-all hover:border-primary/50"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="font-jetbrains text-[10px] uppercase text-emerald-500 font-semibold tracking-wider">
                      In Progress
                    </span>
                  </div>
                  <h4 className="font-semibold text-base break-words">{topic}</h4>
                </div>

                <div className="mt-4 flex items-center justify-between pt-3 border-t border-border/60">
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => openGraduateModal(topic)}
                    className="text-xs h-8"
                  >
                    <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> Done & Graduate
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveTopic(topic)}
                    className="text-xs h-8 text-muted-foreground hover:text-destructive"
                    aria-label={`Remove ${topic}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Graduation Modal */}
      <Dialog open={Boolean(graduateModal)} onOpenChange={(open) => !open && setGraduateModal(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              Graduate "{graduateModal?.topic}" to Education
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleGraduate} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-medium block mb-1">Milestone / Course Title</label>
              <Input
                required
                value={gradTitle}
                onChange={(e) => setGradTitle(e.target.value)}
                placeholder="e.g. Practical Network Security Labs"
              />
            </div>

            <div>
              <label className="text-xs font-medium block mb-1">Organization / Platform</label>
              <Input
                value={gradOrg}
                onChange={(e) => setGradOrg(e.target.value)}
                placeholder="e.g. Self-directed, Coursera, TryHackMe"
              />
            </div>

            <div>
              <label className="text-xs font-medium block mb-1">Completion Year / Period</label>
              <Input
                value={gradPeriod}
                onChange={(e) => setGradPeriod(e.target.value)}
                placeholder="e.g. 2026 or Completed"
              />
            </div>

            <div>
              <label className="text-xs font-medium block mb-1">Description / Summary of Skills</label>
              <Textarea
                rows={3}
                value={gradDesc}
                onChange={(e) => setGradDesc(e.target.value)}
                placeholder="What did you learn or build?"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <Button type="button" variant="outline" onClick={() => setGraduateModal(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={busy}>
                <CheckCircle2 className="mr-1.5 h-4 w-4" />
                {busy ? 'Graduating…' : 'Save to Education & Finish'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
