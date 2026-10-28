import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
import { getLocalTableData } from '@/lib/portfolio-store';

export type ContentTable = 'projects' | 'skills' | 'certifications' | 'timeline_items' | 'site_settings';

export const PORTFOLIO_SYNC_EVENT = 'portfolio:live_sync';

export function triggerPortfolioSync(table?: ContentTable) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(PORTFOLIO_SYNC_EVENT, { detail: { table } }));
  try {
    const bc = new BroadcastChannel('portfolio_sync_channel');
    bc.postMessage({ table, timestamp: Date.now() });
    bc.close();
  } catch {
    // BroadcastChannel unsupported or restricted
  }
}

type TableItemWithVisibility<T extends ContentTable> = Tables<T> & { is_visible?: boolean };

interface DynamicQueryBuilder {
  eq: (column: string, value: unknown) => DynamicQueryBuilder;
  order: (column: string) => Promise<{ data: unknown[] | null; error: unknown }>;
}

export function usePortfolio<T extends ContentTable>(table: T) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleSync = (e: Event) => {
      const customEvent = e as CustomEvent<{ table?: ContentTable }>;
      if (!customEvent.detail?.table || customEvent.detail.table === table) {
        queryClient.invalidateQueries({ queryKey: ['portfolio', table] });
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key?.includes(table)) {
        queryClient.invalidateQueries({ queryKey: ['portfolio', table] });
      }
    };

    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel('portfolio_sync_channel');
      bc.onmessage = (msg) => {
        if (!msg.data?.table || msg.data.table === table) {
          queryClient.invalidateQueries({ queryKey: ['portfolio', table] });
        }
      };
    } catch {
      // ignore
    }

    window.addEventListener(PORTFOLIO_SYNC_EVENT, handleSync);
    window.addEventListener('storage', handleStorage);

    let channel: ReturnType<typeof supabase.channel> | null = null;
    if (isSupabaseConfigured) {
      try {
        const channelId = `realtime_${table}_${Math.random().toString(36).slice(2, 7)}`;
        channel = supabase
          .channel(channelId)
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table },
            () => {
              queryClient.invalidateQueries({ queryKey: ['portfolio', table] });
            }
          )
          .subscribe();
      } catch (err) {
        console.warn('Realtime channel subscription error:', err);
      }
    }

    return () => {
      window.removeEventListener(PORTFOLIO_SYNC_EVENT, handleSync);
      window.removeEventListener('storage', handleStorage);
      if (bc) bc.close();
      if (channel) {
        try {
          supabase.removeChannel(channel);
        } catch {
          // ignore
        }
      }
    };
  }, [table, queryClient]);

  return useQuery({
    queryKey: ['portfolio', table],
    queryFn: async (): Promise<Tables<T>[]> => {
      if (!isSupabaseConfigured) {
        const local = getLocalTableData(table);
        if (table !== 'site_settings') {
          return (local as TableItemWithVisibility<T>[]).filter(item => item.is_visible !== false);
        }
        return local;
      }
      try {
        let query = (supabase.from(table).select('*') as unknown as DynamicQueryBuilder);
        if (table !== 'site_settings') {
          query = query.eq('is_visible', true);
        }
        const { data, error } = await query.order(table === 'site_settings' ? 'key' : 'sort_order');
        if (error || !data || data.length === 0) {
          const local = getLocalTableData(table);
          if (table !== 'site_settings') {
            return (local as TableItemWithVisibility<T>[]).filter(item => item.is_visible !== false);
          }
          return local;
        }
        return (data ?? []) as unknown as Tables<T>[];
      } catch (err) {
        console.warn(`Failed to fetch from ${table}, falling back to local data:`, err);
        const local = getLocalTableData(table);
        if (table !== 'site_settings') {
          return (local as TableItemWithVisibility<T>[]).filter(item => item.is_visible !== false);
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
  // Allow base64 data URLs (local storage fallback)
  if (value.startsWith('data:')) return value;
  try {
    const url = new URL(value);
    return ['https:', 'http:'].includes(url.protocol) ? url.href : undefined;
  } catch {
    return undefined;
  }
}
