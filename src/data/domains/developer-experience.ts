import type { DomainEntry } from "./types";

const developerExperience: DomainEntry = {
  slug: "developer-experience",
  order: 5,
  title: "developer experience",
  summary: "seeded developer experience domain content for the shared Phase 2 route.",
  seoDescription:
    "A seeded developer experience domain page for tooling, automation, design systems, and test workflows.",
  thesis: "i invest in tooling when it saves a team the same annoyance over and over.",
  scope: "this domain is for internal tools that make shipping, testing, and building easier.",
  belongsHere: [
    "shared tooling that reduces repeated manual setup or debugging",
    "systems that make frontend and backend teams faster and safer",
  ],
  supportingWork: [
    {
      title: "seeded developer experience example",
      context: "placeholder supporting work so the shared route can render real structure.",
    },
  ],
  relatedDomains: ["infrastructure", "product"],
};

export default developerExperience;
