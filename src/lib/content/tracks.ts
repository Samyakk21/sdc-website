import type { Track } from "@/lib/types";

export const tracks: Track[] = [
  {
    slug: "quantum-computing",
    title: "Quantum Computing & Algorithms",
    tagline: "From qubits to code — understand the field reshaping computation.",
    description:
      "Career of the Month is a structured monthly track that takes you deep into one career domain. This month we explore quantum computing: the science, the career paths, and the skills that matter.",
    whyItMatters:
      "Quantum computing is moving from research labs toward real applications in cryptography, optimization, and simulation. Early exposure now gives you a head start in one of the most sought-after emerging domains.",
    status: "active",
    skills: [
      "Quantum gate & circuit basics",
      "Foundations of quantum algorithms",
      "Hands-on with quantum programming",
      "Reading research and industry roadmaps",
    ],
    timeline: [
      {
        week: "Week 1",
        title: "Introduction",
        description: "Kickoff session, foundational concepts, and the track roadmap.",
      },
      {
        week: "Week 2",
        title: "Workshop",
        description: "Hands-on workshop covering quantum circuits and simple algorithms.",
      },
      {
        week: "Week 3",
        title: "Expert Session",
        description: "Deep-dive with an expert on where the field is heading.",
      },
      {
        week: "Week 4",
        title: "Challenge",
        description: "A closing challenge to consolidate everything you've learned.",
      },
    ],
    eventSlugs: [
      "cotm-quantum-kickoff",
      "cotm-quantum-expert-session",
      "cotm-quantum-challenge",
    ],
  },
];

export function getTrack(slug: string) {
  return tracks.find((track) => track.slug === slug);
}