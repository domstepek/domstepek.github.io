import type { DomainEntry } from "./types";

const analytics: DomainEntry = {
  slug: "analytics",
  order: 1,
  title: "analytics",
  summary: "seeded analytics domain content for the shared Phase 2 route.",
  seoDescription:
    "A seeded analytics domain page for platforms, dashboards, and reporting workflows.",
  thesis: "i build analytics tools that help teams inspect messy operational data.",
  scope: "this domain is for dashboards, reporting flows, and data exploration surfaces.",
  belongsHere: [
    "reporting workflows people use to answer real operational questions",
    "data-heavy interfaces that turn warehouse output into decisions",
  ],
  supportingWork: [
    {
      title: "seeded analytics example",
      context: "placeholder supporting work so the shared route can render real structure.",
    },
  ],
  relatedDomains: ["product", "ai-ml"],
};

export default analytics;
