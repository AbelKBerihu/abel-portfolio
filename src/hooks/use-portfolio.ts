import { useQuery } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
import { getLocalTableData } from '@/lib/portfolio-store';

export type ContentTable = 'projects' | 'skills' | 'certifications' | 'timeline_items' | 'site_settings';

export function usePortfolio<T extends ContentTable>(table: T) {
  return useQuery({
    queryKey: ['portfolio', table],
    queryFn: async (): Promise<Tables<T>[]> => {
      if (!isSupabaseConfigured) {
        const local = getLocalTableData(table);
        if (table !== 'site_settings') {
          return (local as any[]).filter(item => item.is_visible !== false) as Tables<T>[];
        }
        return local;
      }
      try {
        let query = supabase.from(table).select('*') as any;
        if (table !== 'site_settings') {
          query = query.eq('is_visible', true);
        }
        const { data, error } = await query.order(table === 'site_settings' ? 'key' : 'sort_order');
        if (error || !data || data.length === 0) {
          const local = getLocalTableData(table);
          if (table !== 'site_settings') {
            return (local as any[]).filter(item => item.is_visible !== false) as Tables<T>[];
          }
          return local;
        }
        return (data ?? []) as unknown as Tables<T>[];
      } catch (err) {
        console.warn(`Failed to fetch from ${table}, falling back to local data:`, err);
        const local = getLocalTableData(table);
        if (table !== 'site_settings') {
          return (local as any[]).filter(item => item.is_visible !== false) as Tables<T>[];
        }
        return local;
      }
    },
    staleTime: 30_000,
    retry: isSupabaseConfigured ? 1 : false,
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
