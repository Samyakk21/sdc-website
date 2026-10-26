export const departments = [
  "EECS",
  "DSE",
  "Biology",
  "Chemistry",
  "Maths",
  "Physics",
  "EES",
  "Economics",
  "Chemical Engg",
] as const;

export type Department = (typeof departments)[number];

// Curated tags (the PR-1 board categories, plus Industry/Academia).
export const opportunityTags = [
  "Research",
  "Internship",
  "Hackathon",
  "Industry",
  "Academia",
  "Job",
  "Campus project",
  "Fellowship",
  "Competition",
  "Other",
] as const;

export type OpportunityTag = (typeof opportunityTags)[number];

export type Opportunity = {
  id: string;
  title: string;
  organization: string;
  department: Department[];
  description: string;
  deadline: string | null;
  application_url: string;
  submitted_by: string;
  contributor_name: string | null;
  is_anonymous: boolean;
  upvote_count: number;
  created_at: string;
  has_upvoted: boolean;
  tags: string[];
};
