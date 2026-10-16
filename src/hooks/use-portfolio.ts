import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type ContentTable = 'projects' | 'skills' | 'certifications' | 'timeline_items' | 'site_settings';
export function usePortfolio<T extends ContentTable>(table: T) {
  return useQuery({
    queryKey: ['portfolio', table],
    queryFn: async (): Promise<Tables<T>[]> => {
      let query = supabase.from(table).select('*');
      if (table !== 'site_settings') {
        query = query.eq('is_visible', true);
      }
      const { data, error } = await query.order(table === 'site_settings' ? 'key' : 'sort_order');
      if (error) throw error;
      return (data ?? []) as unknown as Tables<T>[];
    },
    staleTime: 60_000,
  });
}
export function useSettings() {
  const query = usePortfolio('site_settings');
  return { ...query, settings: Object.fromEntries((query.data ?? []).map(s => [s.key, s.value])) };
}
export function safeUrl(value?: string | null) {
  if (!value) return undefined;
  try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? url.href : undefined; } catch { return undefined; }
}
