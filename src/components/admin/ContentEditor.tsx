import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Pencil, Trash2, Save, Upload } from 'lucide-react';
import { toast } from 'sonner';
import type { ContentTable } from '@/hooks/use-portfolio';
type Row = Record<string, unknown>;
const columns: Record<ContentTable, string[]> = {
  projects: ['title', 'discipline', 'description', 'tags', 'image_url', 'link_url', 'sort_order'],
  skills: ['name', 'category', 'level', 'sort_order'],
  certifications: ['title', 'issuer', 'date', 'credential_url', 'image_url', 'sort_order'],
  timeline_items: ['kind', 'title', 'organization', 'period', 'description', 'sort_order'],
  site_settings: ['key', 'value'],
};
const settingNames = ['hero_name', 'hero_role', 'hero_intro', 'about', 'status', 'languages', 'currently_learning', 'footer_banner', 'github_url', 'linkedin_url', 'telegram_url', 'contact_email'];
export function ContentEditor({ table }: { table: ContentTable }) {
  const cache = useQueryClient();
  const [draft, setDraft] = useState<Row | null>(null), [original, setOriginal] = useState<string | null>(null), [busy, setBusy] = useState(false);
  const key = table === 'site_settings' ? 'key' : 'id';
  const { data = [], isLoading, isError } = useQuery({ queryKey: ['admin', table], queryFn: async () => {
    const { data, error } = await supabase.from(table).select('*').order(table === 'site_settings' ? 'key' : 'sort_order');
    if (error) throw error; return data as unknown as Row[];
  }});
  const refresh = () => { cache.invalidateQueries({ queryKey: ['admin', table] }); cache.invalidateQueries({ queryKey: ['portfolio', table] }); };
  const edit = (row?: Row) => {
    setOriginal(row ? String(row[key]) : null);
    setDraft(row ? { ...row, tags: Array.isArray(row.tags) ? row.tags.join(', ') : row.tags } : Object.fromEntries(columns[table].map(c => [c, c === 'sort_order' ? 0 : c === 'level' ? 80 : c === 'kind' ? 'experience' : ''])));
  };
  const remove = async (row: Row) => {
    if (!window.confirm('Remove this item? This cannot be undone.')) return;
    setBusy(true);
    const { error } = await supabase.from(table).delete().eq(key, String(row[key]));
    setBusy(false); if (error) toast.error('Could not remove item.'); else { refresh(); toast.success('Item removed.'); }
  };
  const save = async (e: React.FormEvent) => {
    e.preventDefault(); if (!draft) return; setBusy(true);
    const payload = Object.fromEntries(columns[table].map(c => [c, c === 'tags' ? String(draft[c] || '').split(',').map(t => t.trim()).filter(Boolean) : c.endsWith('_url') ? draft[c] || null : draft[c]]));
    if (table === 'skills' && (Number(payload.level) < 0 || Number(payload.level) > 100)) { toast.error('Level must be between 0 and 100.'); setBusy(false); return; }
    const result = original ? await supabase.from(table).update(payload).eq(key, original) : await supabase.from(table).insert(payload as never);
    setBusy(false);
    if (result.error) { toast.error('Could not save. Check the required fields and try again.'); return; }
    setDraft(null); refresh(); toast.success('Changes saved.');
  };
  const upload = async (file?: File) => {
    if (!file || !draft) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) { toast.error('Choose a JPG, PNG or WebP under 5 MB.'); return; }
    setBusy(true);
    const path = `${crypto.randomUUID()}.${file.type.split('/')[1]}`;
    const { error } = await supabase.storage.from('portfolio-images').upload(path, file, { contentType: file.type });
    setBusy(false);
    if (error) { toast.error('Could not upload image.'); return; }
    const { data } = supabase.storage.from('portfolio-images').getPublicUrl(path);
    setDraft(d => d ? { ...d, image_url: data.publicUrl } : d); toast.success('Image uploaded. Save to publish it.');
  };
  return <div><div className="mb-6 flex items-center justify-between gap-4"><h2 className="text-xl font-semibold capitalize">{table.replace('_items', '').replace('_', ' ')}</h2><Button onClick={() => edit()}><Plus/>Add item</Button></div>{isLoading && <p role="status">Loading…</p>}{isError && <p role="alert" className="text-destructive">Could not load content.</p>}<div className="divide-y divide-border">{data.map(row => <div key={String(row[key])} className="flex items-center justify-between gap-4 py-5"><div className="min-w-0"><h3 className="break-words font-sans font-semibold">{String(row.title || row.name || row.key)}</h3><p className="mt-1 truncate text-sm text-muted-foreground">{String(row.discipline || row.category || row.issuer || row.period || row.value || '')}</p></div><div className="flex shrink-0 gap-1"><Button variant="ghost" size="icon" aria-label={`Edit ${row.title || row.name || row.key}`} onClick={() => edit(row)}><Pencil/></Button><Button variant="ghost" size="icon" aria-label={`Remove ${row.title || row.name || row.key}`} disabled={busy} onClick={() => remove(row)}><Trash2/></Button></div></div>)}</div>{!isLoading && !isError && !data.length && <p className="py-8 text-muted-foreground">No items yet.</p>}<Dialog open={!!draft} onOpenChange={open => { if (!open && !busy) setDraft(null); }}><DialogContent className="max-h-[85svh] overflow-y-auto"><DialogHeader><DialogTitle>{original ? 'Edit item' : 'Add item'}</DialogTitle></DialogHeader>{draft && <form onSubmit={save} className="space-y-4">{columns[table].map(c => <div key={c}><label htmlFor={`edit-${c}`} className="mb-2 block text-sm font-medium capitalize">{c.replaceAll('_', ' ')}</label>{c === 'kind' ? <Select value={String(draft[c])} onValueChange={value => setDraft({ ...draft, [c]: value })}><SelectTrigger id={`edit-${c}`}><SelectValue/></SelectTrigger><SelectContent>{['experience', 'education', 'learning'].map(k => <SelectItem key={k} value={k}>{k}</SelectItem>)}</SelectContent></Select> : ['description', 'value'].includes(c) ? <Textarea id={`edit-${c}`} value={String(draft[c] ?? '')} onChange={e => setDraft({ ...draft, [c]: e.target.value })} rows={5}/> : <Input id={`edit-${c}`} type={['level', 'sort_order'].includes(c) ? 'number' : c.endsWith('_url') ? 'url' : 'text'} list={c === 'key' ? 'setting-names' : undefined} disabled={c === 'key' && !!original} required={['title', 'name', 'key'].includes(c)} min={c === 'level' ? 0 : undefined} max={c === 'level' ? 100 : undefined} value={String(draft[c] ?? '')} onChange={e => setDraft({ ...draft, [c]: ['level', 'sort_order'].includes(c) ? Number(e.target.value) : e.target.value })}/>} {c === 'image_url' && <label className="mt-2 flex cursor-pointer items-center gap-2 text-sm text-muted-foreground"><Upload className="h-4 w-4"/>Upload image<input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" disabled={busy} onChange={e => upload(e.target.files?.[0])}/></label>}</div>)}<datalist id="setting-names">{settingNames.map(k => <option key={k} value={k}/>)}</datalist><Button type="submit" disabled={busy}><Save/>{busy ? 'Saving…' : 'Save changes'}</Button></form>}</DialogContent></Dialog></div>;
}
