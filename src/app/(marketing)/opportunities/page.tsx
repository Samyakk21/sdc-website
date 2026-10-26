import type { Metadata } from "next";

import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { OpportunityBoard } from "@/components/opportunities/opportunity-board";
import { listOpportunities } from "@/lib/opportunities-repo";
import { getCurrentSession } from "@/lib/auth";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Opportunities",
  description:
    "Student-shared research roles, internships, hackathons, jobs, and fellowships for the IISER Bhopal community.",
  path: "/opportunities",
});

export default async function OpportunitiesPage() {
  const session = await getCurrentSession();
  const { opportunities, status } = await listOpportunities(session?.profile.id);

  return (
    <>
      <PageHeader
        eyebrow="Opportunities"
        title="Student opportunity board"
        description="Opportunities shared by students, for students. Post a research role, internship, hackathon, job, or fellowship to help your peers."
      />
      <Container className="py-16 sm:py-20">
        <OpportunityBoard opportunities={opportunities} isSignedIn={Boolean(session)} status={status} />
      </Container>
    </>
  );
}
