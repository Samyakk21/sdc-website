export const opportunityCategories = [
  "Research",
  "Internship",
  "Hackathon",
  "Job",
  "Campus project",
  "Fellowship",
  "Competition",
  "Other",
] as const;

export type OpportunityCategory = (typeof opportunityCategories)[number];

export type Opportunity = {
  id: string;
  title: string;
  organization: string;
  category: OpportunityCategory;
  description: string;
  deadline: string | null;
  application_url: string;
  submitted_by: string;
  upvote_count: number;
  created_at: string;
  has_upvoted: boolean;
};
