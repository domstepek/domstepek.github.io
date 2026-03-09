import type { DomainEntry } from "./types";

const product: DomainEntry = {
  slug: "product",
  order: 4,
  title: "product",
  summary: "seeded product domain content for the shared Phase 2 route.",
  seoDescription:
    "A seeded product domain page for business workflows, internal tools, and delivery-oriented apps.",
  thesis: "i build product flows that make teams faster without hiding the hard parts.",
  scope: "this domain is for user-facing workflow software and business process tools.",
  belongsHere: [
    "apps people use every day to get operational work done",
    "workflow design that balances speed, clarity, and real constraints",
  ],
  supportingWork: [
    {
      title: "seeded product example",
      context: "placeholder supporting work so the shared route can render real structure.",
    },
  ],
  relatedDomains: ["analytics", "developer-experience"],
};

export default product;
