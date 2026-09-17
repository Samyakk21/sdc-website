import type { Resource } from "@/lib/types";

export const resources: Resource[] = [
  {
    slug: "quantum-roadmap",
    title: "Quantum Computing Roadmap",
    description:
      "A structured path to go from zero to functional quantum programming, curated for this month's track.",
    type: "roadmap",
    categories: ["quantum computing"],
    trackSlug: "quantum-computing",
    author: "SDC",
    dateAdded: "2026-09-15",
  },
  {
    slug: "internship-guide",
    title: "Internship & Research Application Guide",
    description:
      "A practical guide to applying for research internships — CV tips, statements, and timelines.",
    type: "pdf",
    categories: ["career", "internships"],
    author: "SDC",
    dateAdded: "2026-08-30",
  },
  {
    slug: "career-magazine-vol-1",
    title: "CARMA Vol. 1",
    description:
      "The first edition of SDC's career magazine with student stories and industry insights.",
    type: "pdf",
    categories: ["career", "magazine"],
    author: "SDC",
    dateAdded: "2026-07-20",
  },
  {
    slug: "writing-warm-up",
    title: "MUN Writing Warm-Up",
    description:
      "Guides and practice material for drafting position papers and resolutions.",
    type: "tutorial",
    categories: ["mun", "debate"],
    author: "MUN Team",
    dateAdded: "2026-08-10",
  },
  {
    slug: "cv-builder-tips",
    title: "CV Building Tips Video",
    description:
      "A short video walkthrough of structuring a standout academic CV.",
    type: "video",
    categories: ["career", "cv"],
    author: "Placements & Internships",
    dateAdded: "2026-09-01",
  },
  {
    slug: "startup-playbook",
    title: "Student Startup Playbook",
    description:
      "Curated links and reading on validating ideas, building teams, and finding mentorship.",
    type: "book",
    categories: ["entrepreneurship"],
    author: "E-Cell",
    dateAdded: "2026-06-18",
  },
  {
    slug: "higher-ed-funding",
    title: "Higher Education & Funding Links",
    description:
      "Scholarships, fellowships, and funding opportunities curated for IISER Bhopal students.",
    type: "website",
    categories: ["career", "scholarships"],
    author: "SDC",
    dateAdded: "2026-05-12",
  },
];