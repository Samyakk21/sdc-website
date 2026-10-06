export type Compendium = {
  slug: string;
  title: string;
  description: string;
  href: string;
};

/**
 * Living documents maintained by the SDC on Notion. They are rendered as the
 * Compendium section of the resources page — separate from the `resources`
 * library, because they are external, frequently updated documents.
 */
export const compendiums: Compendium[] = [
  {
    slug: "internship-compendium",
    title: "Internship Compendium",
    description:
      "National and international summer/winter research internships, industry opportunities, and fellowships — curated by the SDC and updated each cycle.",
    href: "https://sdc-iiserb.notion.site/Internship-Compendium-SDC-Updated-2nd-Oct-2026-2ac6c3ebf98c81ca9b6bdda7a4da5bae",
  },
  {
    slug: "csir-internship-compendium",
    title: "CSIR Internship Compendium",
    description:
      "The CSIR edition of the compendium — internship programs across CSIR laboratories, with the eligibility and application details in one place.",
    href: "https://sdc-iiserb.notion.site/CSIR-Internship-Compendium-SDC-2a06c3ebf98c8037855ce6b6da41739d",
  },
];

export const compendiumHighlights = [
  {
    title: "Comprehensive program listings",
    description:
      "Curated national and international summer/winter research internships, industry opportunities, and fellowship programs.",
  },
  {
    title: "Eligibility & timelines",
    description:
      "Eligibility criteria, key application deadlines, stipend details, and required documentation — quick to scan before you apply.",
  },
  {
    title: "Live & updated database",
    description:
      "Upcoming application windows, with centralized links organized for easy browsing.",
  },
];

export const compendiumNote =
  "Please note: the compendiums still need changes to dates and other small details — our team is working on it. The links to most websites work and will be helpful in your journey.";
