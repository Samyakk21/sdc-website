import { createClient, hasSupabaseEnv } from "@/lib/supabase/server";
import type { Opportunity } from "@/lib/opportunity-types";

type OpportunityRow = Omit<Opportunity, "has_upvoted">;

export type { Opportunity } from "@/lib/opportunity-types";

export type OpportunityBoardStatus = "ready" | "database-unconfigured" | "migration-required";

export async function listOpportunities(
  userId?: string,
): Promise<{ opportunities: Opportunity[]; status: OpportunityBoardStatus }> {
  if (!hasSupabaseEnv()) {
    return { opportunities: [], status: "database-unconfigured" };
  }

  const supabase = await createClient();
  const opportunitiesResult = await supabase
    .from("opportunities")
    .select(
      "id, title, organization, category, description, deadline, application_url, submitted_by, upvote_count, created_at",
    )
    .order("created_at", { ascending: false });

  if (opportunitiesResult.error) {
    if (opportunitiesResult.error.code === "PGRST205") {
      console.error("The opportunities migration has not been applied:", opportunitiesResult.error);
      return { opportunities: [], status: "migration-required" };
    }
    throw new Error(`Could not load opportunities: ${opportunitiesResult.error.message}`);
  }

  let votedIds = new Set<string>();
  if (userId) {
    const votesResult = await supabase
      .from("opportunity_votes")
      .select("opportunity_id")
      .eq("user_id", userId);

    if (votesResult.error) {
      if (votesResult.error.code === "PGRST205") {
        console.error("The opportunity votes migration has not been applied:", votesResult.error);
        return { opportunities: [], status: "migration-required" };
      }
      throw new Error(`Could not load opportunity votes: ${votesResult.error.message}`);
    }
    votedIds = new Set(votesResult.data.map((vote) => vote.opportunity_id));
  }

  return {
    opportunities: ((opportunitiesResult.data ?? []) as OpportunityRow[]).map((opportunity) => ({
      ...opportunity,
      has_upvoted: votedIds.has(opportunity.id),
    })),
    status: "ready",
  };
}
