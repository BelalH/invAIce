import type { SupabaseClient } from "@supabase/supabase-js";
import type { Proposal } from "@/types/proposal";

export async function getProposals(supabase: SupabaseClient, userId: string): Promise<Proposal[]> {
  const { data, error } = await supabase
    .from("proposals")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Proposal[];
}

export async function getProposalById(supabase: SupabaseClient, id: string): Promise<Proposal | null> {
  const { data, error } = await supabase
    .from("proposals")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as Proposal;
}

export async function getProposalByToken(supabase: SupabaseClient, token: string): Promise<Proposal | null> {
  const { data, error } = await supabase
    .from("proposals")
    .select("*")
    .eq("public_token", token)
    .single();

  if (error) return null;
  return data as Proposal;
}

export async function createProposal(
  supabase: SupabaseClient,
  userId: string,
  proposal: Omit<Partial<Proposal>, "id" | "user_id" | "created_at" | "updated_at">
): Promise<Proposal> {
  const { data, error } = await supabase
    .from("proposals")
    .insert({ ...proposal, user_id: userId })
    .select()
    .single();

  if (error) throw error;
  return data as Proposal;
}

export async function updateProposal(
  supabase: SupabaseClient,
  id: string,
  updates: Partial<Proposal>
): Promise<Proposal> {
  const { data, error } = await supabase
    .from("proposals")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Proposal;
}

export async function deleteProposal(supabase: SupabaseClient, id: string): Promise<void> {
  const { error } = await supabase.from("proposals").delete().eq("id", id);
  if (error) throw error;
}
