import type { DomainEntry } from "./types";

const product: DomainEntry = {
  slug: "product",
  order: 4,
  title: "product",
  summary:
    "internal and operational products that turn messy human processes into software people can use under pressure.",
  seoDescription:
    "product domain page for workflow-heavy internal software and operational systems Dom builds.",
  thesis:
    "i like product work when the software has to hold together a messy real-world process, not just present a clean screen.",
  scope:
    "if the main challenge is shaping states, decisions, and handoffs into a usable workflow, it belongs here; if the audience is mainly engineers improving their own tooling, that is developer experience.",
  belongsHere: [
    "operator-facing products that carry real daily process, approvals, and exceptions",
    "business applications where workflow design matters as much as data modeling",
    "systems that need product judgment around speed, clarity, and edge cases, not just api coverage",
  ],
  supportingWork: [
    {
      title: "sample tracking",
      context:
        "a workflow-heavy platform for managing sample shipments, live tracking status, KPI views, exports, and report subscriptions.",
      proofLinks: [
        {
          label: "repo",
          href: "https://github.com/tpr-datalabs/sample_tracking",
        },
      ],
    },
    {
      title: "pricing app",
      context:
        "a dedicated pricing workflow application with its own frontend and backend services instead of another spreadsheet-shaped process.",
      proofLinks: [
        {
          label: "repo",
          href: "https://github.com/tpr-datalabs/pricing-app",
        },
      ],
    },
    {
      title: "supply forecast",
      context:
        "supply-chain work centered on forecasting and planning flows where the product problem was operational coordination, not generic CRUD.",
      proofLinks: [
        {
          label: "repo",
          href: "https://github.com/tpr-datalabs/supply-chain",
        },
      ],
    },
    {
      title: "cms",
      context:
        "a multi-tenant Payload-based CMS aimed at shared content and admin workflows instead of a single-tenant marketing site.",
      proofLinks: [
        {
          label: "repo",
          href: "https://github.com/tpr-datalabs/cms",
        },
      ],
    },
  ],
  relatedDomains: ["analytics", "ai-ml"],
};

export default product;
