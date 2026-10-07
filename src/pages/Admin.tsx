import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { Trash2, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProjects, useCertifications, useSkills, uploadImage } from "@/lib/portfolio-content";

type Table = "projects" | "certifications" | "skills";

const Admin = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) { setIsAdmin(false); return; }
    supabase.from("user_roles").select("role").eq("user_id", session.user.id).eq("role", "admin").maybeSingle()
      .then(({ data }) => setIsAdmin(!!data));
  }, [session]);

  const signIn = async () => {
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: `${window.location.origin}/admin` });
    if (r.error) toast.error("Sign-in failed. Please try again.");
  };

  if (!ready) return null;

  if (!session || !isAdmin) {
    return (
      <main className="min-h-screen grid place-items-center px-4">
        <div className="glass rounded-lg p-8 max-w-sm w-full text-center space-y-4">
          <p className="editorial-kicker">Admin</p>
          <h1 className="text-2xl font-bold">ABEL<span className="text-primary">.</span>DEV dashboard</h1>
          {session ? (
            <>
              <p className="text-sm text-muted-foreground">This account does not have admin access.</p>
              <Button variant="outline" onClick={() => supabase.auth.signOut()}>Sign out</Button>
            </>
          ) : (
            <Button className="w-full" onClick={signIn}>Sign in with Google</Button>
          )}
          <a href="/" className="block text-sm text-muted-foreground hover:text-primary">← Back to portfolio</a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen container mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div><p className="editorial-kicker">Admin</p><h1 className="text-3xl font-bold">Manage portfolio</h1></div>
        <div className="flex gap-2">
          <Button variant="outline" asChild><a href="/">View site</a></Button>
          <Button variant="ghost" size="icon" aria-label="Sign out" onClick={() => supabase.auth.signOut()}><LogOut /></Button>
        </div>
      </div>
      <Tabs defaultValue="projects">
        <TabsList className="mb-6 flex-wrap h-auto">
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="certifications">Certificates</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>
        <TabsContent value="projects"><ProjectsAdmin /></TabsContent>
        <TabsContent value="certifications"><CertsAdmin /></TabsContent>
        <TabsContent value="skills"><SkillsAdmin /></TabsContent>
        <TabsContent value="messages"><MessagesAdmin /></TabsContent>
      </Tabs>
    </main>
  );
};

const useRemove = (table: Table) => {
  const qc = useQueryClient();
  return async (id: string) => {
    if (!confirm("Delete this item?")) return;
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: [table] });
    toast.success("Deleted");
  };
};

const Row = ({ title, sub, onDelete }: { title: string; sub?: string; onDelete: () => void }) => (
  <div className="flex items-center justify-between gap-4 border-b border-border py-3">
    <div className="min-w-0"><p className="font-medium truncate">{title}</p>{sub && <p className="text-sm text-muted-foreground truncate">{sub}</p>}</div>
    <Button variant="ghost" size="icon" aria-label="Delete" onClick={onDelete}><Trash2 className="h-4 w-4" /></Button>
  </div>
);

const ProjectsAdmin = () => {
  const { data = [] } = useProjects();
  const qc = useQueryClient();
  const remove = useRemove("projects");
  const [f, setF] = useState({ title: "", discipline: "", description: "", link_url: "" });
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.title.trim()) return toast.error("Title is required");
    setBusy(true);
    try {
      const image_url = file ? await uploadImage(file) : null;
      const { error } = await supabase.from("projects").insert({ ...f, link_url: f.link_url || null, image_url, sort_order: data.length + 1 });
      if (error) throw error;
      setF({ title: "", discipline: "", description: "", link_url: "" }); setFile(null);
      qc.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project added");
    } catch (err) { toast.error((err as Error).message); } finally { setBusy(false); }
  };
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <form onSubmit={add} className="glass rounded-lg p-6 space-y-3">
        <h2 className="font-semibold">Add project</h2>
        <Input placeholder="Title" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} />
        <Input placeholder="Category (e.g. Product / Web)" value={f.discipline} onChange={(e) => setF({ ...f, discipline: e.target.value })} />
        <Textarea placeholder="Description" value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} />
        <Input placeholder="Link (optional)" value={f.link_url} onChange={(e) => setF({ ...f, link_url: e.target.value })} />
        <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        <Button type="submit" disabled={busy}>{busy ? "Saving…" : "Add project"}</Button>
      </form>
      <div>{data.map((p) => <Row key={p.id} title={p.title} sub={p.discipline} onDelete={() => remove(p.id)} />)}</div>
    </div>
  );
};

const CertsAdmin = () => {
  const { data = [] } = useCertifications();
  const qc = useQueryClient();
  const remove = useRemove("certifications");
  const [f, setF] = useState({ title: "", issuer: "", date: "", credential_url: "" });
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.title.trim()) return toast.error("Title is required");
    setBusy(true);
    try {
      const image_url = file ? await uploadImage(file) : null;
      const { error } = await supabase.from("certifications").insert({ ...f, credential_url: f.credential_url || null, image_url, sort_order: data.length + 1 });
      if (error) throw error;
      setF({ title: "", issuer: "", date: "", credential_url: "" }); setFile(null);
      qc.invalidateQueries({ queryKey: ["certifications"] });
      toast.success("Certificate added");
    } catch (err) { toast.error((err as Error).message); } finally { setBusy(false); }
  };
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <form onSubmit={add} className="glass rounded-lg p-6 space-y-3">
        <h2 className="font-semibold">Add certificate</h2>
        <Input placeholder="Title" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} />
        <Input placeholder="Issuer" value={f.issuer} onChange={(e) => setF({ ...f, issuer: e.target.value })} />
        <Input placeholder="Year" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} />
        <Input placeholder="Credential link (optional)" value={f.credential_url} onChange={(e) => setF({ ...f, credential_url: e.target.value })} />
        <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        <Button type="submit" disabled={busy}>{busy ? "Saving…" : "Add certificate"}</Button>
      </form>
      <div>{data.map((c) => <Row key={c.id} title={c.title} sub={`${c.issuer} • ${c.date}`} onDelete={() => remove(c.id)} />)}</div>
    </div>
  );
};

const SkillsAdmin = () => {
  const { data = [] } = useSkills();
  const qc = useQueryClient();
  const remove = useRemove("skills");
  const [name, setName] = useState("");
  const [level, setLevel] = useState(80);
  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Name is required");
    const { error } = await supabase.from("skills").insert({ name: name.trim(), level: Math.min(100, Math.max(0, level)), sort_order: data.length + 1 });
    if (error) return toast.error(error.message);
    setName(""); setLevel(80);
    qc.invalidateQueries({ queryKey: ["skills"] });
    toast.success("Skill added");
  };
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <form onSubmit={add} className="glass rounded-lg p-6 space-y-3">
        <h2 className="font-semibold">Add skill</h2>
        <Input placeholder="Skill name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input type="number" min={0} max={100} value={level} onChange={(e) => setLevel(Number(e.target.value))} />
        <Button type="submit">Add skill</Button>
      </form>
      <div>{data.map((s) => <Row key={s.id} title={s.name} sub={`${s.level}%`} onDelete={() => remove(s.id)} />)}</div>
    </div>
  );
};

const MessagesAdmin = () => {
  const qc = useQueryClient();
  const { data = [] } = useQuery({
    queryKey: ["contact_submissions"],
    queryFn: async () => {
      const { data, error } = await supabase.from("contact_submissions").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  const remove = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    const { error } = await supabase.from("contact_submissions").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["contact_submissions"] });
  };
  if (!data.length) return <p className="text-muted-foreground">No messages yet.</p>;
  return (
    <div className="space-y-4">
      {data.map((m) => (
        <article key={m.id} className="glass rounded-lg p-5">
          <div className="flex justify-between gap-4">
            <div>
              <p className="font-semibold">{m.name} <span className="text-muted-foreground font-normal">· {m.email}{m.phone ? ` · ${m.phone}` : ""}</span></p>
              <p className="text-xs text-muted-foreground">Preferred date {m.preferred_date} · sent {new Date(m.created_at).toLocaleString()}</p>
            </div>
            <Button variant="ghost" size="icon" aria-label="Delete" onClick={() => remove(m.id)}><Trash2 className="h-4 w-4" /></Button>
          </div>
          {m.project_needs && <p className="mt-3 text-sm"><span className="editorial-kicker mr-2">Needs</span>{m.project_needs}</p>}
          <p className="mt-2 text-sm">{m.message}</p>
          {m.ai_brief && <pre className="mt-3 whitespace-pre-wrap font-sans text-sm border-l-2 border-primary pl-3 text-muted-foreground">{m.ai_brief}</pre>}
        </article>
      ))}
    </div>
  );
};

export default Admin;
