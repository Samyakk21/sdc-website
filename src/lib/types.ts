export type Initiative = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  status: "active" | "planned";
  /** external site for the initiative, when it lives outside this website */
  href?: string;
};

export type EventStatus =
  | "registration_open"
  | "registration_closed"
  | "upcoming"
  | "ongoing"
  | "completed"
  | "cancelled";

export type EventMode = "online" | "offline" | "hybrid";

export type SDCEvent = {
  slug: string;
  title: string;
  description: string;
  date: string;
  startTime?: string;
  endTime?: string;
  location: string;
  mode: EventMode;
  organizer: string;
  capacity?: number;
  registrationDeadline?: string;
  status: EventStatus;
  trackSlug?: string;
};

export type TrackStatus = "planned" | "active" | "completed";

export type Track = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  whyItMatters: string;
  status: TrackStatus;
  skills: string[];
  timeline: { week: string; title: string; description?: string }[];
  eventSlugs: string[];
};

export type ResourceType =
  | "pdf"
  | "article"
  | "video"
  | "website"
  | "roadmap"
  | "book"
  | "tutorial"
  | "link";

export type Resource = {
  slug: string;
  title: string;
  description: string;
  type: ResourceType;
  categories: string[];
  trackSlug?: string;
  url?: string;
  author?: string;
  dateAdded: string;
};

export type Announcement = {
  title: string;
  date: string;
  body: string;
  pinned: boolean;
};

export type TeamMember = {
  name: string;
  role: string;
  image: string;
  quote?: string;
  linkedin?: string;
  email?: string;
};

export type TeamGroup = {
  title: string;
  members: TeamMember[];
};