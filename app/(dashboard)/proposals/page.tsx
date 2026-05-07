import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProposals } from "@/lib/supabase/proposals";
import { ProposalsTable } from "@/components/proposals/proposals-table";

export default async function ProposalsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const proposals = await getProposals(supabase, user.id);

  return <ProposalsTable proposals={proposals} />;
}
