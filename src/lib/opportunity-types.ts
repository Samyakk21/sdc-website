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

export type Opportunity = {
  id: string;
  title: string;
  organization: string;
  department: Department[];
  description: string;
  deadline: string | null;
  application_url: string;
  submitted_by: string;
  upvote_count: number;
  created_at: string;
  has_upvoted: boolean;
  tags: string[];
};
