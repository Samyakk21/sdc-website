import { contact, links, siteDescription, siteName } from "@/lib/content/site";
import type { SDCEvent } from "@/lib/types";
import { absoluteUrl, siteUrl } from "@/lib/seo";

/** Site-wide Organization + WebSite graph, rendered once in the root layout. */
export function siteStructuredData() {
  const organizationId = `${siteUrl}/#organization`;
  const websiteId = `${siteUrl}/#website`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: siteName,
        alternateName: "SDC",
        url: siteUrl,
        logo: `${siteUrl}/images/sdc-logo.svg`,
        image: `${siteUrl}/images/sdc-hero.jpeg`,
        description: siteDescription,
        email: contact.email,
        telephone: contact.phone,
        address: {
          "@type": "PostalAddress",
          streetAddress: contact.addressLines[0],
          addressLocality: "Bhopal",
          addressRegion: "Madhya Pradesh",
          postalCode: "462066",
          addressCountry: "IN",
        },
        parentOrganization: {
          "@type": "CollegeOrUniversity",
          name: contact.institute,
        },
        sameAs: [links.linktree, links.blogs, links.compendiums],
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: siteUrl,
        name: siteName,
        description: siteDescription,
        inLanguage: "en-IN",
        publisher: { "@id": organizationId },
      },
    ],
  };
}

/** Google Events rich-result markup for a single event detail page. */
export function eventStructuredData(event: SDCEvent) {
  const url = absoluteUrl(`/events/${event.slug}`);
  const startDate = event.startsAt ?? `${event.date}T00:00:00+05:30`;

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description || siteDescription,
    startDate,
    ...(event.endsAt ? { endDate: event.endsAt } : {}),
    eventStatus:
      event.status === "cancelled"
        ? "https://schema.org/EventCancelled"
        : "https://schema.org/EventScheduled",
    eventAttendanceMode:
      event.mode === "online"
        ? "https://schema.org/OnlineEventAttendanceMode"
        : event.mode === "hybrid"
          ? "https://schema.org/MixedEventAttendanceMode"
          : "https://schema.org/OfflineEventAttendanceMode",
    location:
      event.mode === "online"
        ? { "@type": "VirtualLocation", url }
        : {
            "@type": "Place",
            name: event.location,
            address: {
              "@type": "PostalAddress",
              addressLocality: "Bhopal",
              addressRegion: "Madhya Pradesh",
              addressCountry: "IN",
            },
          },
    image: [absoluteUrl("/og.png")],
    url,
    isAccessibleForFree: true,
    organizer: {
      "@type": "Organization",
      name: event.organizer || siteName,
      url: siteUrl,
    },
  };
}
