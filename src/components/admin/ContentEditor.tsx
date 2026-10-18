import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Pencil, Trash2, Save, Upload, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import type { ContentTable } from '@/hooks/use-portfolio';
import { getLocalTableData, setLocalTableData } from '@/lib/portfolio-store';

type Row = Record<string, unknown>;

const columns: Record<ContentTable, string[]> = {
  projects: ['title', 'discipline', 'description', 'status', 'coming_soon', 'tags', 'image_url', 'link_url', 'sort_order', 'is_visible'],
  skills: ['name', 'category', 'level', 'coming_soon', 'sort_order', 'is_visible'],
  certifications: ['title', 'issuer', 'date', 'coming_soon', 'credential_url', 'image_url', 'sort_order', 'is_visible'],
  timeline_items: ['kind', 'title', 'organization', 'period', 'description', 'sort_order', 'is_visible'],
  site_settings: ['key', 'value'],
};

const editableColumns: Record<ContentTable, string[]> = {
  projects: ['title', 'discipline', 'description', 'status', 'coming_soon', 'tags', 'image_url', 'link_url', 'sort_order'],
  skills: ['name', 'category', 'level', 'coming_soon', 'sort_order'],
  certifications: ['title', 'issuer', 'date', 'coming_soon', 'credential_url', 'image_url', 'sort_order'],
  timeline_items: ['kind', 'title', 'organization', 'period', 'description', 'sort_order'],
  site_settings: ['key', 'value'],
};

const settingNames = [
  'hero_name',
  'hero_role',
  'hero_intro',
  'about',
  'status',
  'languages',
  'currently_learning',
  'footer_banner',
  'github_url',
  'linkedin_url',
  'telegram_url',
  'whatsapp_url',
  'contact_email',
];

export function ContentEditor({ table }: { table: ContentTable }) {
  const cache = useQueryClient();
  const [draft, setDraft] = useState<Row | null>(null);
  const [original, setOriginal] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const key = table === 'site_settings' ? 'key' : 'id';
  const hasVisibility = table !== 'site_settings';

  const { data = [], isLoading, isError } = useQuery({
    queryKey: ['admin', table],
    queryFn: async () => {
      if (!isSupabaseConfigured) {
        return getLocalTableData(table) as unknown as Row[];
      }
      try {
        const { data, error } = await supabase.from(table).select('*').order(table === 'site_settings' ? 'key' : 'sort_order');
        if (error || !data || data.length === 0) {
          return getLocalTableData(table) as unknown as Row[];
        }
        return data as unknown as Row[];
      } catch {
        return getLocalTableData(table) as unknown as Row[];
      }
    },
  });

  const refresh = () => {
    cache.invalidateQueries({ queryKey: ['admin', table] });
    cache.invalidateQueries({ queryKey: ['portfolio', table] });
  };

  const edit = (row?: Row) => {
    setOriginal(row ? String(row[key]) : null);
    setDraft(row
      ? { ...row, tags: Array.isArray(row.tags) ? row.tags.join(', ') : row.tags }
      : Object.fromEntries(columns[table].map(c => [
        c,
        c === 'sort_order' ? 0
        : c === 'level' ? 80
        : c === 'kind' ? 'experience'
        : c === 'status' ? 'completed'
        : c === 'coming_soon' ? false
        : c === 'is_visible' ? true
        : '',
      ]))
    );
  };

  const toggleVisible = async (row: Row) => {
    const current = Boolean(row.is_visible);
    const targetKey = String(row[key]);

    // Update local storage copy
    const currentList = getLocalTableData(table) as any[];
    const updatedList = currentList.map(item => item[key] === targetKey ? { ...item, is_visible: !current } : item);
    setLocalTableData(table, updatedList as any);

    if (isSupabaseConfigured) {
      try {
        await (supabase.from(table) as any).update({ is_visible: !current }).eq(key, targetKey);
      } catch (err) {
        console.warn('Supabase update failed, kept in local state:', err);
      }
    }

    refresh();
    toast.success(!current ? 'Item is now visible.' : 'Item hidden from public site.');
  };

  const remove = async (row: Row) => {
    if (!window.confirm('Remove this item? This cannot be undone.')) return;
    setBusy(true);
    const targetKey = String(row[key]);

    // Remove from local storage copy
    const currentList = getLocalTableData(table) as any[];
    const filtered = currentList.filter(item => String(item[key]) !== targetKey);
    setLocalTableData(table, filtered as any);

    if (isSupabaseConfigured) {
      try {
        await (supabase.from(table) as any).delete().eq(key, targetKey);
      } catch (err) {
        console.warn('Supabase delete failed, removed from local state:', err);
      }
    }

    setBusy(false);
    refresh();
    toast.success('Item removed.');
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft) return;
    setBusy(true);
    const fields = editableColumns[table];
    const payload = Object.fromEntries(fields.map(c => [
      c,
      c === 'tags'
        ? String(draft[c] || '').split(',').map((t: string) => t.trim()).filter(Boolean)
        : c.endsWith('_url') ? draft[c] || null
        : c === 'is_visible' ? Boolean(draft[c])
        : c === 'coming_soon' ? Boolean(draft[c])
        : c === 'sort_order' ? Number(draft[c] || 0)
        : c === 'level' ? Number(draft[c] || 0)
        : draft[c],
    ]));

    if (table === 'skills' && (Number(payload.level) < 0 || Number(payload.level) > 100)) {
      toast.error('Level must be between 0 and 100.');
      setBusy(false);
      return;
    }

    // Save locally first to guarantee persistence
    const currentList = [...(getLocalTableData(table) as any[])];
    if (original) {
      const idx = currentList.findIndex(item => String(item[key]) === String(original));
      if (idx !== -1) {
        currentList[idx] = { ...currentList[idx], ...payload };
      } else {
        currentList.push({ [key]: original, ...payload });
      }
    } else {
      const newId = table === 'site_settings' ? String(payload.key) : `custom-${Date.now()}`;
      currentList.unshift({
        [key]: newId,
        ...payload,
        is_visible: true,
        created_at: new Date().toISOString(),
      });
    }
    setLocalTableData(table, currentList as any);

    // If Supabase is configured, also persist to Supabase
    if (isSupabaseConfigured) {
      try {
        if (original) {
          await (supabase.from(table) as any).update(payload).eq(key, original);
        } else {
          await (supabase.from(table) as any).insert({ ...payload, is_visible: true });
        }
      } catch (err) {
        console.warn('Supabase save failed, persisted locally:', err);
      }
    }

    setBusy(false);
    setDraft(null);
    refresh();
    toast.success('Changes saved successfully.');
  };

  const upload = async (file?: File) => {
    if (!file || !draft) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
      toast.error('Choose a JPG, PNG or WebP under 5 MB.');
      return;
    }
    setBusy(true);

    if (isSupabaseConfigured) {
      try {
        const path = `${crypto.randomUUID()}.${file.type.split('/')[1]}`;
        const { error } = await supabase.storage.from('portfolio-images').upload(path, file, { contentType: file.type });
        if (!error) {
          const { data } = supabase.storage.from('portfolio-images').getPublicUrl(path);
          setDraft(d => d ? { ...d, image_url: data.publicUrl } : d);
          setBusy(false);
          toast.success('Image uploaded. Click Save to publish.');
          return;
        }
      } catch {
        // Fall back to FileReader
      }
    }

    // Fallback: convert to base64 Data URL so local storage works seamlessly
    const reader = new FileReader();
    reader.onload = () => {
      setDraft(d => d ? { ...d, image_url: reader.result as string } : d);
      setBusy(false);
      toast.success('Image loaded. Click Save to publish.');
    };
    reader.onerror = () => {
      setBusy(false);
      toast.error('Could not read image file.');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Showing {data.length} {table.replace('_', ' ')}
        </p>
        {table !== 'site_settings' && (
          <Button onClick={() => edit()}>
            <Plus className="mr-2 h-4 w-4" /> Add item
          </Button>
        )}
      </div>

      {isLoading && <p role="status">Loading…</p>}
      {isError && <p role="alert">Could not load this table.</p>}

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-card/60 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Item</th>
              <th className="px-4 py-3">Details</th>
              {hasVisibility && <th className="px-4 py-3">Visible</th>}
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((row) => (
              <tr key={String(row[key])} className="hover:bg-card/40 transition-colors">
                <td className="px-4 py-3 font-medium">
                  {String(row.title || row.name || row.key || '')}
                </td>
                <td className="max-w-md truncate px-4 py-3 text-muted-foreground">
                  {String(row.value || row.description || row.category || row.issuer || '')}
                </td>
                {hasVisibility && (
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => toggleVisible(row)}
                      className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-jetbrains transition-colors ${
                        row.is_visible
                          ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {row.is_visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                      {row.is_visible ? 'Visible' : 'Hidden'}
                    </button>
                  </td>
                )}
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="sm" onClick={() => edit(row)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    {table !== 'site_settings' && (
                      <Button variant="ghost" size="sm" onClick={() => remove(row)} className="text-destructive hover:text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={Boolean(draft)} onOpenChange={open => !open && setDraft(null)}>
        <DialogContent className="max-h-[85svh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{original ? 'Edit item' : 'Add item'}</DialogTitle>
          </DialogHeader>
          {draft && (
            <form onSubmit={save} className="space-y-4">
              {editableColumns[table].map(c => (
                <div key={c}>
                  <label htmlFor={`edit-${c}`} className="mb-2 block text-sm font-medium capitalize">
                    {c.replace(/_/g, ' ')}
                  </label>
                  {c === 'kind' ? (
                    <Select value={String(draft[c] || 'experience')} onValueChange={value => setDraft({ ...draft, [c]: value })}>
                      <SelectTrigger id={`edit-${c}`}><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {['experience', 'education', 'learning'].map(k => <SelectItem key={k} value={k}>{k}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  ) : c === 'status' ? (
                    <Select value={String(draft[c] || 'completed')} onValueChange={value => setDraft({ ...draft, [c]: value })}>
                      <SelectTrigger id={`edit-${c}`}><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="in_progress">In progress</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : c === 'coming_soon' ? (
                    <div className="flex items-center gap-3">
                      <input
                        id={`edit-${c}`}
                        type="checkbox"
                        checked={Boolean(draft[c])}
                        onChange={e => setDraft({ ...draft, [c]: e.target.checked })}
                        className="h-4 w-4 rounded border-border"
                      />
                      <label htmlFor={`edit-${c}`} className="text-sm text-muted-foreground">
                        Show as "Coming soon" with placeholder badge
                      </label>
                    </div>
                  ) : c === 'key' && table === 'site_settings' ? (
                    <Select value={String(draft[c] || '')} onValueChange={value => setDraft({ ...draft, [c]: value })}>
                      <SelectTrigger id={`edit-${c}`}><SelectValue placeholder="Select setting key" /></SelectTrigger>
                      <SelectContent>
                        {settingNames.map(name => <SelectItem key={name} value={name}>{name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  ) : ['description', 'about', 'hero_intro'].includes(c) ? (
                    <Textarea
                      id={`edit-${c}`}
                      rows={4}
                      value={String(draft[c] || '')}
                      onChange={e => setDraft({ ...draft, [c]: e.target.value })}
                    />
                  ) : (
                    <Input
                      id={`edit-${c}`}
                      type={c === 'sort_order' || c === 'level' ? 'number' : 'text'}
                      value={String(draft[c] ?? '')}
                      onChange={e => setDraft({ ...draft, [c]: e.target.value })}
                    />
                  )}
                  {c.endsWith('_url') && c.includes('image') && (
                    <div className="mt-2">
                      <label className="inline-flex cursor-pointer items-center gap-2 text-xs text-primary hover:underline">
                        <Upload className="h-3.5 w-3.5" /> Upload image file
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden"
                          onChange={e => upload(e.target.files?.[0])}
                        />
                      </label>
                      {draft[c] ? (
                        <div className="mt-2 h-16 w-16 overflow-hidden rounded border border-border">
                          <img src={String(draft[c])} alt="preview" className="h-full w-full object-cover" />
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              ))}
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setDraft(null)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={busy}>
                  <Save className="mr-2 h-4 w-4" /> {busy ? 'Saving…' : 'Save'}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
