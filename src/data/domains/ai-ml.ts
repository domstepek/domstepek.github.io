import type { DomainEntry } from "./types";

const aiMl: DomainEntry = {
  slug: "ai-ml",
  order: 3,
  title: "ai / ml",
  summary: "seeded ai / ml domain content for the shared Phase 2 route.",
  seoDescription:
    "A seeded AI and ML domain page for agent flows, model-assisted tooling, and applied automation.",
  thesis: "i like using models when they remove drudge work instead of adding theater.",
  scope: "this domain is for applied model workflows, agents, and ML-assisted product features.",
  belongsHere: [
    "tools where models help classify, summarize, or route work",
    "agent-style flows that connect people, systems, and context",
  ],
  supportingWork: [
    {
      title: "seeded ai / ml example",
      context: "placeholder supporting work so the shared route can render real structure.",
    },
  ],
  relatedDomains: ["analytics", "developer-experience"],
};

export default aiMl;
