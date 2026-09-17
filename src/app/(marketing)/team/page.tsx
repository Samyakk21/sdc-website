import type { Metadata } from "next";

import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { SectionHeading } from "@/components/ui/section-heading";
import { TeamCard } from "@/components/team/team-card";
import { teamGroups } from "@/lib/content/team";

export const metadata: Metadata = {
  title: "Team",
  description: "Meet the Student Development Council team at IISER Bhopal — the faculty and student members running SDC initiatives.",
};

export default function TeamPage() {
  return (
    <>
      <PageHeader
        eyebrow="Team"
        title="Meet the SDC Team"
        description="The faculty and students who run the Student Development Council at IISER Bhopal — advisors, office bearers, the core committee, and our trainees."
      />
      <Container className="space-y-20 py-16 sm:py-20">
        {teamGroups.map((group) => (
          <section key={group.title} aria-labelledby={`team-${group.title}`}>
            <SectionHeading
              id={`team-${group.title}`}
              eyebrow={group.title}
              title={group.title}
              align="center"
            />
            <ul
              className={`mt-10 flex flex-wrap justify-center gap-6 ${
                group.members.length === 1 ? "mx-auto max-w-md" : ""
              }`}
            >
              {group.members.map((member) => (
                <li
                  key={member.name}
                  className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
                >
                  <TeamCard member={member} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </Container>
    </>
  );
}