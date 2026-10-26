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

const requiredOpportunityColumns = [
  "id",
  "title",
  "organization",
  "department",
  "description",
  "deadline",
  "application_url",
  "submitted_by",
  "upvote_count",
  "created_at",
  "tags",
];

/**
 * Columns that ship in their own migrations. When one is missing we keep the
 * board usable (names hidden, anonymity ignored) instead of blanking the whole
 * page behind a setup notice.
 */
const optionalOpportunityColumns = ["contributor_name", "is_anonymous"] as const;

export function missingOptionalColumn(
  error: { code?: string; message?: string } | null,
): string | null {
  if (error?.code !== "42703") return null;
  const message = error.message ?? "";
  return optionalOpportunityColumns.find((column) => message.includes(column)) ?? null;
}

export async function listOpportunities(
  userId?: string,
): Promise<{ opportunities: Opportunity[]; status: OpportunityBoardStatus }> {
  if (!hasSupabaseEnv()) {
    return { opportunities: [], status: "database-unconfigured" };
  }

  const supabase = await createClient();
  const fetchRows = (optional: readonly string[]) =>
    supabase
      .from("opportunities")
      .select([...requiredOpportunityColumns, ...optional].join(", "))
      .order("created_at", { ascending: false });

  const optional: string[] = [...optionalOpportunityColumns];
  let opportunitiesResult = await fetchRows(optional);

  while (opportunitiesResult.error) {
    const missing = missingOptionalColumn(opportunitiesResult.error);
    if (!missing) break;
    console.warn(
      `opportunities.${missing} is missing; run supabase/migrations/20261027000000_opportunity_anonymous.sql to enable it.`,
    );
    optional.splice(optional.indexOf(missing), 1);
    opportunitiesResult = await fetchRows(optional);
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
      contributor_name: optional.includes("contributor_name")
        ? opportunity.contributor_name ?? null
        : null,
      is_anonymous: optional.includes("is_anonymous")
        ? Boolean(opportunity.is_anonymous)
        : false,
      tags: Array.isArray(opportunity.tags) ? opportunity.tags : [],
      has_upvoted: votedIds.has(opportunity.id),
    })),
    status: "ready",
  };
}
