import type { DomainEntry } from "./types";

const infrastructure: DomainEntry = {
  slug: "infrastructure",
  order: 2,
  title: "infrastructure",
  summary: "seeded infrastructure domain content for the shared Phase 2 route.",
  seoDescription:
    "A seeded infrastructure domain page for deployment, platform, and runtime systems.",
  thesis: "i build the platform pieces that let product systems deploy cleanly and stay up.",
  scope: "this domain is for hosting, delivery, auth edges, and runtime platform work.",
  belongsHere: [
    "cluster, deploy, and routing layers behind product teams",
    "shared services that keep environments predictable and secure",
  ],
  supportingWork: [
    {
      title: "seeded infrastructure example",
      context: "placeholder supporting work so the shared route can render real structure.",
    },
  ],
  relatedDomains: ["developer-experience", "analytics"],
};

export default infrastructure;
