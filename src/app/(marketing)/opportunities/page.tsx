import type { Metadata } from "next";

import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { OpportunityBoard } from "@/components/opportunities/opportunity-board";
import { getCurrentSession } from "@/lib/auth";
import { listOpportunities } from "@/lib/opportunities-repo";

export const metadata: Metadata = {
  title: "Opportunities",
  description:
    "Discover and share research positions, internships, hackathons, jobs, and campus projects with the IISER Bhopal community.",
};

export default async function OpportunitiesPage() {
  const session = await getCurrentSession();
  const boardData = await listOpportunities(session?.profile.id);

  return (
    <>
      <PageHeader
        eyebrow="For the IISER Bhopal community"
        title="Find your next opportunity"
        description="A community-powered board for the openings worth knowing about. Explore, upvote, and share what's next."
      />
      <Container className="py-10 sm:py-14">
        <OpportunityBoard
          opportunities={boardData.opportunities}
          isSignedIn={Boolean(session)}
          status={boardData.status}
        />
      </Container>
    </>
  );
}
