import type { Announcement } from "@/lib/types";

// Notices shown on the home page and (below the registration section) on
// `/events`. Keep each body a single paragraph — it renders in a plain <p>.
export const announcements: Announcement[] = [
  {
    title: "YLAC Policy Chapter Workshop Orientation — 8 October",
    date: "2026-10-07",
    pinned: true,
    body: "Looking to learn how policy problems are analysed and transformed into practical solutions? Join the YLAC Policy Chapter Workshop Orientation — an interactive session on mastering policy case competitions (root cause analysis, stakeholder mapping, smart research, feasible solutions, effective pitching). 8 October, 7:00–9:00 PM, L1. Open to all disciplines, no prior experience required, and participants get an official SDC certificate. The YLAC team is also recruiting — details and the form are on the event page.",
  },
];
