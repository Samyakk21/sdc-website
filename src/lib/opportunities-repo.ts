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

const opportunityColumns =
  "id, title, organization, department, description, deadline, application_url, submitted_by, upvote_count, created_at, tags";

const opportunityColumnsWithContributor = `${opportunityColumns}, contributor_name`;

/**
 * Column added by 20261026000100_opportunity_contributor.sql. When it is
 * missing we keep the board usable (contributor names just stay blank)
 * instead of blanking the whole page behind a setup notice.
 */
function isMissingContributorColumn(error: { code?: string; message?: string } | null) {
  return error?.code === "42703" && /contributor_name/.test(error.message ?? "");
}

export async function listOpportunities(
  userId?: string,
): Promise<{ opportunities: Opportunity[]; status: OpportunityBoardStatus }> {
  if (!hasSupabaseEnv()) {
    return { opportunities: [], status: "database-unconfigured" };
  }

  const supabase = await createClient();
  const fetchRows = (columns: string) =>
    supabase.from("opportunities").select(columns).order("created_at", { ascending: false });

  let opportunitiesResult = await fetchRows(opportunityColumnsWithContributor);
  let hasContributorColumn = true;

  if (isMissingContributorColumn(opportunitiesResult.error)) {
    hasContributorColumn = false;
    console.warn(
      "opportunities.contributor_name is missing; apply supabase/migrations/20261026000100_opportunity_contributor.sql to show contributor names.",
    );
    opportunitiesResult = await fetchRows(opportunityColumns);
  }

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
    opportunities: ((opportunitiesResult.data ?? []) as unknown as OpportunityRow[]).map((opportunity) => ({
      ...opportunity,
      department: Array.isArray(opportunity.department) ? opportunity.department : [],
      contributor_name: hasContributorColumn ? opportunity.contributor_name ?? null : null,
      tags: Array.isArray(opportunity.tags) ? opportunity.tags : [],
      has_upvoted: votedIds.has(opportunity.id),
    })),
    status: "ready",
  };
}
