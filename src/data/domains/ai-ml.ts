import type { DomainEntry } from "./types";

const aiMl: DomainEntry = {
  slug: "ai-ml",
  order: 3,
  title: "ai / ml",
  summary:
    "applied ai / ml systems where retrieval, model behavior, or agent orchestration changes what the workflow can do.",
  seoDescription:
    "ai / ml domain page for retrieval flows, model-assisted tooling, and agent systems Dom builds.",
  thesis:
    "i use ai / ml when model behavior meaningfully changes the workflow, not when a chatbot veneer is the whole pitch.",
  scope:
    "if the hard part is prompt orchestration, retrieval quality, or model-driven actions, it belongs here; if it would still be the same product without the model, it probably belongs somewhere else.",
  belongsHere: [
    "retrieval and generation flows tied to concrete operator or analyst tasks",
    "agent-style systems where tool use, context passing, and guardrails matter more than demo flash",
    "ml-assisted features that need review loops, fallbacks, and practical debugging",
  ],
  supportingWork: [
    {
      title: "collection curator api",
      context:
        "an Apollo, Express, and FastAPI platform exploring a next-gen product analytics API with Bedrock, LangChain, and MCP in the stack.",
      proofLinks: [
        {
          label: "repo",
          href: "https://github.com/tpr-datalabs/collection-curator-api",
        },
      ],
    },
    {
      title: "mcp demo",
      context:
        "a focused demo for user-driven and agent-driven actions through MCP, useful for proving the interaction model with something tangible.",
      proofLinks: [
        {
          label: "demo",
          href: "https://cdn-dev.tapestrydev.com/mcp-demo",
        },
        {
          label: "repo",
          href: "https://github.com/tpr-datalabs/mcp-demo",
        },
      ],
    },
    {
      title: "bedrock utilities in datalabs api",
      context:
        "Bedrock-backed converse, knowledge-base, and retrieve-and-generate utilities wired into a larger production API surface.",
      proofLinks: [
        {
          label: "repo",
          href: "https://github.com/tpr-datalabs/datalabs-api",
        },
      ],
    },
  ],
  relatedDomains: ["analytics", "developer-experience"],
};

export default aiMl;
