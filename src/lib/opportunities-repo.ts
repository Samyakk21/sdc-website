import { createClient, hasSupabaseEnv } from "@/lib/supabase/server";
import type { Opportunity } from "@/lib/opportunity-types";

type OpportunityRow = Omit<Opportunity, "has_upvoted">;

export type { Opportunity } from "@/lib/opportunity-types";

export type OpportunityBoardStatus = "ready" | "database-unconfigured" | "migration-required";

// PostgREST/Postgres errors that mean the opportunities schema is missing or
// still on an older version:
//   PGRST205 - table not found in the schema cache
//   42P01    - undefined_table
//   42703    - undefined_column (e.g. department/tags not added yet)
const missingSchemaErrorCodes = new Set(["PGRST205", "42P01", "42703"]);

function isMissingSchemaError(code: string | undefined): boolean {
  return code ? missingSchemaErrorCodes.has(code) : false;
}

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
      "id, title, organization, department, description, deadline, application_url, submitted_by, upvote_count, created_at, tags",
    )
    .order("created_at", { ascending: false });

  if (opportunitiesResult.error) {
    if (isMissingSchemaError(opportunitiesResult.error.code)) {
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
      if (isMissingSchemaError(votesResult.error.code)) {
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
      department: Array.isArray(opportunity.department) ? opportunity.department : [],
      tags: Array.isArray(opportunity.tags) ? opportunity.tags : [],
      has_upvoted: votedIds.has(opportunity.id),
    })),
    status: "ready",
  };
}
