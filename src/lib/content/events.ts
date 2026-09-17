import type { SDCEvent } from "@/lib/types";

export const events: SDCEvent[] = [
  {
    slug: "career-talk-data-science-ai",
    title: "Career Talk: Careers in Data Science & AI",
    description:
      "Industry practitioners break down the pathways into data science and AI — skills, portfolios, and what recruiters actually look for.",
    date: "2026-10-05",
    startTime: "17:00",
    endTime: "18:30",
    location: "LN-101, Academic Block 2",
    mode: "offline",
    organizer: "Career Talks & Orientations",
    capacity: 120,
    registrationDeadline: "2026-10-03",
    status: "registration_open",
  },
  {
    slug: "internship-application-workshop",
    title: "Internship Application Workshop",
    description:
      "A hands-on session covering CV tailoring, research statements, and application strategies for internships at IISERs, institutes, and industry.",
    date: "2026-09-28",
    startTime: "16:00",
    endTime: "17:30",
    location: "LN-201, Academic Block 2",
    mode: "offline",
    organizer: "Placements & Internships",
    capacity: 80,
    registrationDeadline: "2026-09-26",
    status: "registration_open",
  },
  {
    slug: "cotm-quantum-kickoff",
    title: "Quantum Computing: Kickoff & Roadmap Session",
    description:
      "The opening session of Career of the Month — understand the field, the track roadmap, and how to make the most of the month ahead.",
    date: "2026-10-03",
    startTime: "18:00",
    endTime: "19:00",
    location: "Online",
    mode: "online",
    organizer: "Career of the Month",
    capacity: 200,
    registrationDeadline: "2026-10-02",
    status: "registration_open",
    trackSlug: "quantum-computing",
  },
  {
    slug: "cotm-quantum-expert-session",
    title: "Quantum Computing: Expert Session",
    description:
      "An expert deep-dive into quantum algorithms and where quantum computing is heading — from theory to real hardware.",
    date: "2026-10-10",
    startTime: "18:00",
    endTime: "19:30",
    location: "Online",
    mode: "online",
    organizer: "Career of the Month",
    capacity: 200,
    registrationDeadline: "2026-10-09",
    status: "upcoming",
    trackSlug: "quantum-computing",
  },
  {
    slug: "resume-cv-clinic",
    title: "Resume & CV Clinic",
    description:
      "Bring your draft resume for a guided review session with seniors who have landed offers and internships across sectors.",
    date: "2026-10-08",
    startTime: "16:30",
    endTime: "18:00",
    location: "SDC Room, 1st Floor, Mess 3",
    mode: "offline",
    organizer: "Placements & Internships",
    capacity: 40,
    registrationDeadline: "2026-10-06",
    status: "upcoming",
  },
  {
    slug: "cotm-quantum-challenge",
    title: "Quantum Computing: Challenge",
    description:
      "The closing activity of Career of the Month — solve a hands-on challenge and consolidate what you've learned across the month.",
    date: "2026-10-17",
    startTime: "14:00",
    endTime: "18:00",
    location: "Online",
    mode: "online",
    organizer: "Career of the Month",
    status: "registration_closed",
    trackSlug: "quantum-computing",
  },
  {
    slug: "mun-2026-info-session",
    title: "MUN 2026: Information Session",
    description:
      "Everything you need to know about committees, portfolios, and how to register for IISER Bhopal's Model United Nations conference.",
    date: "2026-08-20",
    startTime: "17:00",
    endTime: "18:00",
    location: "LN-301, Academic Block 2",
    mode: "offline",
    organizer: "MUN",
    status: "completed",
  },
  {
    slug: "aptitude-mock-series",
    title: "Placement Prep: Aptitude Mock",
    description:
      "A timed mock aptitude assessment with a detailed solutions discussion, part of the placement preparation series.",
    date: "2026-08-29",
    startTime: "15:00",
    endTime: "17:00",
    location: "Online",
    mode: "online",
    organizer: "Placements & Internships",
    status: "completed",
  },
];

export function getEvent(slug: string) {
  return events.find((event) => event.slug === slug);
}

export function getEventsByTrack(trackSlug: string) {
  return events.filter((event) => event.trackSlug === trackSlug);
}