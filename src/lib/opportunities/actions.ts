"use server";

import { revalidatePath } from "next/cache";

import { getCurrentSession } from "@/lib/auth";
import {
  departments,
  opportunityTags,
  type Department,
  type OpportunityTag,
} from "@/lib/opportunity-types";
import { createClient, hasSupabaseEnv } from "@/lib/supabase/server";

export type OpportunityFormState = {
  ok: boolean;
  message: string;
} | null;

function isDepartment(value: string): value is Department {
  return departments.some((department) => department === value);
}

function isOpportunityTag(value: string): value is OpportunityTag {
  return opportunityTags.some((tag) => tag === value);
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
  const departmentsRaw = formData.getAll("department");
  const selectedDepartments = departmentsRaw
    .map((value) => String(value).trim())
    .filter(Boolean);
  const description = String(formData.get("description") ?? "").trim();
  const deadlineValue = String(formData.get("deadline") ?? "").trim();
  const applicationUrl = String(formData.get("application_url") ?? "").trim();
  const tagsRaw = String(formData.get("tags") ?? "").trim();
  const parsedDeadline = deadlineValue
    ? new Date(`${deadlineValue}T00:00:00.000Z`)
    : null;

  if (title.length < 5 || title.length > 160) {
    return { ok: false, message: "Title must be between 5 and 160 characters." };
  }
  if (organization.length < 2 || organization.length > 120) {
    return { ok: false, message: "Organization must be between 2 and 120 characters." };
  }
  if (selectedDepartments.length === 0) {
    return { ok: false, message: "Select at least one department." };
  }
  for (const department of selectedDepartments) {
    if (!isDepartment(department)) {
      return { ok: false, message: "Choose valid departments." };
    }
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

  // Tags: comma-separated and restricted to the curated board categories.
  const tags = tagsRaw
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
  const uniqueTags = Array.from(new Set(tags));
  if (uniqueTags.length > 5) {
    return { ok: false, message: "Add at most 5 tags." };
  }
  for (const tag of uniqueTags) {
    if (!isOpportunityTag(tag)) {
      return { ok: false, message: "Choose valid tags." };
    }
  }

  const supabase = await createClient();

  // Attribution comes from the signed-in account, never from the form. The
  // submission is also linked by `submitted_by`, so per-user upvote totals can
  // be aggregated later; the name here is just a display snapshot.
  const contributorName = (
    session.profile.full_name?.trim() ||
    session.profile.email.split("@")[0] ||
    ""
  ).slice(0, 60);

  const basePayload = {
    title,
    organization,
    department: selectedDepartments,
    description,
    deadline: deadlineValue || null,
    application_url: applicationUrlValue.toString(),
    submitted_by: session.profile.id,
    tags: uniqueTags,
  };

  let { error } = await supabase
    .from("opportunities")
    .insert({ ...basePayload, contributor_name: contributorName || null });

  // The contributor column ships in its own migration; if it isn't applied yet
  // still accept the post rather than failing the whole form.
  if (
    error?.code === "42703" &&
    /contributor_name/.test(error.message ?? "")
  ) {
    console.warn(
      "opportunities.contributor_name is missing; saving without it. Apply supabase/migrations/20261026000100_opportunity_contributor.sql.",
    );
    ({ error } = await supabase.from("opportunities").insert(basePayload));
  }

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
