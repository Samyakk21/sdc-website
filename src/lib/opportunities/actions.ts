"use server";

import { revalidatePath } from "next/cache";

import { getCurrentSession } from "@/lib/auth";
import {
  opportunityCategories,
  type OpportunityCategory,
} from "@/lib/opportunity-types";
import { createClient, hasSupabaseEnv } from "@/lib/supabase/server";

export type OpportunityFormState = {
  ok: boolean;
  message: string;
} | null;

function isOpportunityCategory(value: string): value is OpportunityCategory {
  return opportunityCategories.some((category) => category === value);
}

export async function createOpportunity(
  _previousState: OpportunityFormState,
  formData: FormData,
): Promise<OpportunityFormState> {
  if (!hasSupabaseEnv()) {
    return { ok: false, message: "Submissions are unavailable right now. Please try again later." };
  }

  const session = await getCurrentSession();
  if (!session) {
    return { ok: false, message: "Sign in with your IISER Bhopal account to share an opportunity." };
  }

  const title = String(formData.get("title") ?? "").trim();
  const organization = String(formData.get("organization") ?? "").trim();
  const category = String(formData.get("category") ?? "");
  const description = String(formData.get("description") ?? "").trim();
  const deadlineValue = String(formData.get("deadline") ?? "").trim();
  const applicationUrl = String(formData.get("application_url") ?? "").trim();
  const parsedDeadline = deadlineValue
    ? new Date(`${deadlineValue}T00:00:00.000Z`)
    : null;

  if (title.length < 5 || title.length > 160) {
    return { ok: false, message: "Title must be between 5 and 160 characters." };
  }
  if (organization.length < 2 || organization.length > 120) {
    return { ok: false, message: "Organization must be between 2 and 120 characters." };
  }
  if (!isOpportunityCategory(category)) {
    return { ok: false, message: "Choose a valid opportunity category." };
  }
  if (description.length < 20 || description.length > 2000) {
    return { ok: false, message: "Description must be between 20 and 2,000 characters." };
  }
  if (
    deadlineValue &&
    (!/^\d{4}-\d{2}-\d{2}$/.test(deadlineValue) ||
      Number.isNaN(parsedDeadline?.getTime()) ||
      parsedDeadline?.toISOString().slice(0, 10) !== deadlineValue)
  ) {
    return { ok: false, message: "Enter a valid application deadline." };
  }

  let applicationUrlValue: URL;
  try {
    applicationUrlValue = new URL(applicationUrl);
  } catch {
    return { ok: false, message: "Enter a valid application link beginning with https://." };
  }
  if (!["https:", "http:"].includes(applicationUrlValue.protocol)) {
    return { ok: false, message: "Application links must use http:// or https://." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("opportunities").insert({
    title,
    organization,
    category,
    description,
    deadline: deadlineValue || null,
    application_url: applicationUrlValue.toString(),
    submitted_by: session.profile.id,
  });

  if (error) {
    console.error("Could not create opportunity:", error);
    return { ok: false, message: "Couldn't share this opportunity. Please try again." };
  }

  revalidatePath("/opportunities");
  return { ok: true, message: "Your opportunity is now on the board." };
}

export async function toggleOpportunityVote(
  opportunityId: string,
): Promise<{ ok: boolean; message?: string; upvoted?: boolean; count?: number }> {
  if (!hasSupabaseEnv()) {
    return { ok: false, message: "Voting is unavailable right now." };
  }

  const session = await getCurrentSession();
  if (!session) {
    return { ok: false, message: "Sign in with your IISER Bhopal account to vote." };
  }

  const supabase = await createClient();
  const existingVote = await supabase
    .from("opportunity_votes")
    .select("opportunity_id")
    .eq("opportunity_id", opportunityId)
    .eq("user_id", session.profile.id)
    .maybeSingle();

  if (existingVote.error) {
    console.error("Could not check opportunity vote:", existingVote.error);
    return { ok: false, message: "Couldn't update your vote. Please try again." };
  }

  const voteChange = existingVote.data
    ? await supabase
        .from("opportunity_votes")
        .delete()
        .eq("opportunity_id", opportunityId)
        .eq("user_id", session.profile.id)
    : await supabase.from("opportunity_votes").insert({
        opportunity_id: opportunityId,
        user_id: session.profile.id,
      });

  if (voteChange.error) {
    console.error("Could not update opportunity vote:", voteChange.error);
    return { ok: false, message: "Couldn't update your vote. Please try again." };
  }

  const result = await supabase
    .from("opportunities")
    .select("upvote_count")
    .eq("id", opportunityId)
    .single();

  if (result.error) {
    console.error("Could not read updated opportunity vote count:", result.error);
    return { ok: false, message: "Your vote was saved, but the count could not be refreshed." };
  }

  revalidatePath("/opportunities");
  return {
    ok: true,
    upvoted: !existingVote.data,
    count: result.data.upvote_count,
  };
}
