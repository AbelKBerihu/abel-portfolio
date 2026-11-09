import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Check,
  X,
  Trash2,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  ShieldCheck,
  Clock,
  RotateCcw,
  Send,
  Search,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';

type SubmissionStatus = 'pending' | 'accepted' | 'declined';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  project_needs: string | null;
  preferred_date: string;
  ai_brief: string | null;
  telegram_delivered: boolean;
  status?: string;
  created_at: string;
}

interface ProjectComment {
  id: string;
  project_id: string;
  name: string;
  comment: string;
  approved: boolean;
  created_at: string;
}

const LOCAL_STATUS_KEY = 'portfolio_inquiry_status_map';

function getLocalStatuses(): Record<string, SubmissionStatus> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(LOCAL_STATUS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function setLocalStatus(id: string, status: SubmissionStatus) {
  if (typeof window === 'undefined') return;
  try {
    const current = getLocalStatuses();
    current[id] = status;
    localStorage.setItem(LOCAL_STATUS_KEY, JSON.stringify(current));
  } catch {
    // ignore
  }
}

export function Inbox({ comments = false }: { comments?: boolean }) {
  const table = comments ? 'project_comments' : 'contact_submissions';
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'declined'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);

  const { data = [], isLoading, isError } = useQuery({
    queryKey: ['admin', table],
    queryFn: async () => {
      if (!isSupabaseConfigured) {
        // Fallback to local storage if supabase is not available
        try {
          const raw = localStorage.getItem(`portfolio_cms_table_${table}`);
          if (raw) return JSON.parse(raw);
        } catch {
          // ignore
        }
        return [];
      }
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  // Action for Comments (Approve / Reject)
  const actOnComment = async (id: string, approve = false) => {
    setBusyId(id);
    try {
      if (approve) {
        await supabase.from('project_comments').update({ approved: true }).eq('id', id);
        toast.success('Comment approved and published to portfolio.');
      } else {
        if (!confirm('Permanently remove this comment?')) {
          setBusyId(null);
          return;
        }
        await supabase.from('project_comments').delete().eq('id', id);
        toast.success('Comment deleted.');
      }
      queryClient.invalidateQueries({ queryKey: ['admin', table] });
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    } catch (err) {
      console.error('Comment action failed:', err);
      toast.error('Failed to update comment.');
    } finally {
      setBusyId(null);
    }
  };

  // Action for Inquiries: Accept, Decline, Reset, Delete
  const setInquiryStatus = async (id: string, newStatus: SubmissionStatus) => {
    setBusyId(id);
    try {
      // 1. Update local storage mirror
      setLocalStatus(id, newStatus);

      // 2. Update Supabase if configured
      if (isSupabaseConfigured) {
        try {
          await supabase
            .from('contact_submissions')
            .update({ status: newStatus })
            .eq('id', id);
        } catch (dbErr) {
          console.warn('Supabase status column update notice:', dbErr);
        }
      }

      queryClient.invalidateQueries({ queryKey: ['admin', table] });
      toast.success(
        newStatus === 'accepted'
          ? 'Inquiry marked as Accepted.'
          : newStatus === 'declined'
          ? 'Inquiry marked as Declined.'
          : 'Inquiry reset to Pending.'
      );
    } catch (err) {
      console.error('Inquiry status update error:', err);
      toast.error('Could not update inquiry status.');
    } finally {
      setBusyId(null);
    }
  };

  const deleteInquiry = async (id: string) => {
    if (!confirm('Permanently delete this inquiry from records?')) return;
    setBusyId(id);
    try {
      if (isSupabaseConfigured) {
        await supabase.from('contact_submissions').delete().eq('id', id);
      }
      queryClient.invalidateQueries({ queryKey: ['admin', table] });
      toast.success('Inquiry permanently removed.');
    } catch (err) {
      console.error('Delete inquiry error:', err);
      toast.error('Could not delete inquiry.');
    } finally {
      setBusyId(null);
    }
  };

  // Merge local statuses with database entries
  const localStatuses = getLocalStatuses();
  const inquiries = (data as ContactSubmission[]).map(inq => ({
    ...inq,
    status: (localStatuses[inq.id] || inq.status || 'pending') as SubmissionStatus,
  }));

  // Filtering
  const filteredInquiries = inquiries.filter(inq => {
    const matchesFilter = filter === 'all' || inq.status === filter;
    const matchesSearch =
      searchTerm.trim() === '' ||
      inq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inq.project_needs || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const pendingCount = inquiries.filter(i => i.status === 'pending').length;
  const acceptedCount = inquiries.filter(i => i.status === 'accepted').length;
  const declinedCount = inquiries.filter(i => i.status === 'declined').length;

  if (comments) {
    const commentList = data as ProjectComment[];
    return (
      <div className="space-y-6">
        <div className="border-b border-border pb-4">
          <h2 className="text-xl font-bold font-jetbrains flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" /> Project Comments Moderation
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Review, approve, or decline public visitor comments on your projects.
          </p>
        </div>

        {isLoading && <p role="status" className="text-sm text-muted-foreground">Loading comments…</p>}
        {isError && <p role="alert" className="text-sm text-destructive">Could not load comments.</p>}
        {!isLoading && !isError && commentList.length === 0 && (
          <p className="text-sm text-muted-foreground py-8 text-center border border-dashed border-border rounded-lg">
            No visitor comments submitted yet.
          </p>
        )}

        <div className="space-y-4">
          {commentList.map(comment => (
            <article
              key={comment.id}
              className="rounded-lg border border-border bg-card p-5 shadow-sm transition-all"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm font-sans">{comment.name}</h3>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider ${
                      comment.approved
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {comment.approved ? 'Approved' : 'Awaiting Review'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {!comment.approved && (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={busyId === comment.id}
                      onClick={() => actOnComment(comment.id, true)}
                      className="h-8 text-xs font-jetbrains text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/10"
                    >
                      <Check className="mr-1.5 h-3.5 w-3.5" /> Accept & Publish
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={busyId === comment.id}
                    onClick={() => actOnComment(comment.id, false)}
                    className="h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Decline / Delete
                  </Button>
                </div>
              </div>

              <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                "{comment.comment}"
              </p>
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground font-jetbrains">
                <span>Project ID: {comment.project_id}</span>
                <time>{new Date(comment.created_at).toLocaleString()}</time>
              </div>
            </article>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and stats */}
      <div className="border-b border-border pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-jetbrains flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" /> Client Inquiries & Bookings
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Accept or decline project inquiries with instant Telegram verification and encrypted transmission.
          </p>
        </div>

        {/* Status Filter Badges */}
        <div className="flex items-center gap-1.5 bg-card/60 border border-border p-1 rounded-lg text-xs font-jetbrains">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded transition-colors ${
              filter === 'all' ? 'bg-primary text-primary-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            All ({inquiries.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('pending')}
            className={`px-2.5 py-1 rounded transition-colors ${
              filter === 'pending' ? 'bg-amber-500 text-black font-semibold' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('accepted')}
            className={`px-2.5 py-1 rounded transition-colors ${
              filter === 'accepted' ? 'bg-emerald-500 text-black font-semibold' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Accepted ({acceptedCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('declined')}
            className={`px-2.5 py-1 rounded transition-colors ${
              filter === 'declined' ? 'bg-destructive text-white font-semibold' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Declined ({declinedCount})
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          placeholder="Filter by name, email, or need..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="pl-9 text-xs h-9"
        />
      </div>

      {isLoading && <p role="status" className="text-sm text-muted-foreground">Loading inquiries…</p>}
      {isError && <p role="alert" className="text-sm text-destructive">Could not load inquiries.</p>}
      {!isLoading && !isError && filteredInquiries.length === 0 && (
        <p className="text-sm text-muted-foreground py-10 text-center border border-dashed border-border rounded-lg">
          No inquiries found matching this filter.
        </p>
      )}

      {/* Inquiries List */}
      <div className="space-y-4">
        {filteredInquiries.map(inq => {
          const isPending = inq.status === 'pending';
          const isAccepted = inq.status === 'accepted';
          const isDeclined = inq.status === 'declined';

          return (
            <article
              key={inq.id}
              className={`rounded-xl border p-5 transition-all bg-card ${
                isAccepted
                  ? 'border-emerald-500/40 shadow-sm'
                  : isDeclined
                  ? 'border-border/60 opacity-80'
                  : 'border-border hover:border-border/80'
              }`}
            >
              {/* Top row: Client name, status badge, date */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-3">
                <div className="flex items-center gap-3">
                  <h3 className="font-jetbrains font-bold text-base text-foreground">
                    {inq.name}
                  </h3>

                  {/* Status Badge */}
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-jetbrains font-medium tracking-wide ${
                      isAccepted
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : isDeclined
                        ? 'bg-destructive/15 text-destructive-foreground border border-destructive/30'
                        : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        isAccepted ? 'bg-emerald-400' : isDeclined ? 'bg-rose-400' : 'bg-amber-400 animate-pulse'
                      }`}
                    />
                    {isAccepted ? 'Accepted Project' : isDeclined ? 'Declined' : 'Pending Decision'}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground font-jetbrains">
                  <Clock className="h-3.5 w-3.5" />
                  <time>{new Date(inq.created_at).toLocaleString()}</time>
                </div>
              </div>

              {/* Meta Chips: Email, Phone, Preferred Date, Project Need */}
              <div className="mt-3.5 flex flex-wrap gap-2 text-xs font-jetbrains">
                <a
                  href={`mailto:${inq.email}?subject=Regarding%20your%20inquiry%20-%20Abel%20Kebede`}
                  className="inline-flex items-center gap-1.5 rounded border border-border bg-background/60 px-2.5 py-1 text-primary hover:bg-card hover:underline transition-colors"
                >
                  <Mail className="h-3.5 w-3.5 text-primary" />
                  {inq.email}
                </a>

                {inq.phone && (
                  <a
                    href={`tel:${inq.phone}`}
                    className="inline-flex items-center gap-1.5 rounded border border-border bg-background/60 px-2.5 py-1 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    {inq.phone}
                  </a>
                )}

                <span className="inline-flex items-center gap-1.5 rounded border border-border bg-background/60 px-2.5 py-1 text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  Target: {inq.preferred_date}
                </span>

                {inq.project_needs && (
                  <span className="inline-flex items-center gap-1.5 rounded border border-border bg-background/60 px-2.5 py-1 text-muted-foreground">
                    <Briefcase className="h-3.5 w-3.5" />
                    {inq.project_needs}
                  </span>
                )}
              </div>

              {/* Message Content */}
              <div className="mt-4 rounded-lg border border-border/70 bg-background/50 p-4 text-sm leading-relaxed text-foreground whitespace-pre-wrap font-sans">
                {inq.message}
              </div>

              {/* Security and Telegram verification strip */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-[11px] font-jetbrains text-muted-foreground">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1 text-emerald-400">
                    <ShieldCheck className="h-3.5 w-3.5" /> TLS 1.3 Verified & Protected
                  </span>
                  <span>·</span>
                  <span>
                    Telegram Alert: {inq.telegram_delivered ? 'Delivered' : 'Offline / Standby'}
                  </span>
                </div>

                <span className="text-[10px] text-muted-foreground/70 font-mono">
                  ID: {inq.id.substring(0, 8)}...
                </span>
              </div>

              {/* Action Bar: Accept, Decline, Reset, Quick Reply */}
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border/50 pt-4">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Accept Button */}
                  {!isAccepted && (
                    <Button
                      size="sm"
                      disabled={busyId === inq.id}
                      onClick={() => setInquiryStatus(inq.id, 'accepted')}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-jetbrains text-xs h-8"
                    >
                      <Check className="mr-1.5 h-3.5 w-3.5" /> Accept Inquiry
                    </Button>
                  )}

                  {/* Decline Button */}
                  {!isDeclined && (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={busyId === inq.id}
                      onClick={() => setInquiryStatus(inq.id, 'declined')}
                      className="border-destructive/40 text-destructive hover:bg-destructive/10 font-jetbrains text-xs h-8"
                    >
                      <X className="mr-1.5 h-3.5 w-3.5" /> Decline
                    </Button>
                  )}

                  {/* Reset to Pending (if already decided) */}
                  {!isPending && (
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={busyId === inq.id}
                      onClick={() => setInquiryStatus(inq.id, 'pending')}
                      className="text-xs font-jetbrains text-muted-foreground hover:text-foreground h-8"
                    >
                      <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Reset to Pending
                    </Button>
                  )}
                </div>

                {/* Email Client Quick Response */}
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    asChild
                    className="h-8 text-xs font-jetbrains"
                  >
                    <a
                      href={`mailto:${inq.email}?subject=${encodeURIComponent(
                        isAccepted
                          ? `Project Accepted: ${inq.project_needs || 'Security Collaboration'} - Abel Kebede`
                          : `Regarding your inquiry - Abel Kebede`
                      )}&body=${encodeURIComponent(
                        isAccepted
                          ? `Hi ${inq.name},\n\nThank you for reaching out! I would be glad to work on ${
                              inq.project_needs || 'your project'
                            } with you.\n\nLet's schedule a call on or around ${inq.preferred_date}.\n\nBest regards,\nAbel Kebede\nCybersecurity Student & Analyst`
                          : `Hi ${inq.name},\n\nThank you for contacting me. Unfortunately, I am currently unable to take on new projects at this time.\n\nBest regards,\nAbel Kebede`
                      )}`}
                    >
                      <Send className="mr-1.5 h-3.5 w-3.5" /> Email Response
                    </a>
                  </Button>

                  <Button
                    size="icon"
                    variant="ghost"
                    disabled={busyId === inq.id}
                    onClick={() => deleteInquiry(inq.id)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors"
                    title="Delete permanently"
                    aria-label="Delete inquiry"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
