import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import brand from "@/assets/projects/brand.jpg";
import commerce from "@/assets/projects/commerce.jpg";
import system from "@/assets/projects/system.jpg";
import portfolio from "@/assets/projects/portfolio.jpg";

export type Project = Tables<"projects">;
export type Certification = Tables<"certifications">;
export type Skill = Tables<"skills">;

export const BUCKET = "portfolio";
const assets: Record<string, string> = { brand, commerce, system, portfolio };

/** image_url formats: "asset:<key>" (bundled), "storage:<path>" (private bucket), or a plain URL. */
async function resolveImages<T extends { image_url: string | null }>(rows: T[]): Promise<(T & { image: string | null })[]> {
  const paths = rows.map((r) => r.image_url).filter((u): u is string => !!u?.startsWith("storage:")).map((u) => u.slice(8));
  const signed: Record<string, string> = {};
  if (paths.length) {
    const { data } = await supabase.storage.from(BUCKET).createSignedUrls(paths, 60 * 60 * 24);
    data?.forEach((d) => { if (d.path && d.signedUrl) signed[d.path] = d.signedUrl; });
  }
  return rows.map((r) => {
    const u = r.image_url;
    let image: string | null = u;
    if (u?.startsWith("asset:")) image = assets[u.slice(6)] ?? null;
    else if (u?.startsWith("storage:")) image = signed[u.slice(8)] ?? null;
    return { ...r, image };
  });
}

export const useProjects = () =>
  useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("*").order("sort_order").order("created_at");
      if (error) throw error;
      return resolveImages(data);
    },
  });

export const useCertifications = () =>
  useQuery({
    queryKey: ["certifications"],
    queryFn: async () => {
      const { data, error } = await supabase.from("certifications").select("*").order("sort_order").order("created_at");
      if (error) throw error;
      return resolveImages(data);
    },
  });

export const useSkills = () =>
  useQuery({
    queryKey: ["skills"],
    queryFn: async () => {
      const { data, error } = await supabase.from("skills").select("*").order("sort_order").order("created_at");
      if (error) throw error;
      return data;
    },
  });

export async function uploadImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `uploads/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { contentType: file.type });
  if (error) throw error;
  return `storage:${path}`;
}
