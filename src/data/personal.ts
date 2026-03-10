export interface PersonalPrinciple {
  title: string;
  body: string;
}

export interface PersonalPageData {
  title: string;
  lead: string;
  howIWork: {
    title: string;
    intro: string;
    principles: {
      systems: PersonalPrinciple;
      product: PersonalPrinciple;
      collaboration: PersonalPrinciple;
    };
  };
  openTo: {
    title: string;
    intro: string;
    roles: string[];
    problemSpaces: string[];
    boundaries: string[];
  };
  resume: {
    title: string;
    summary: string;
    highlights: string[];
    note: string;
  };
  notes: {
    intro: string;
    label: string;
  };
  seo: {
    title: string;
    description: string;
  };
}

export const personalPage = {
  title: "about",
  lead:
    "i like work that sits between product questions, system shape, and the operational details that usually get hand-waved until they hurt.",
  howIWork: {
    title: "how i work",
    intro: "the short version is that i care about the whole loop, not just the code in front of me.",
    principles: {
      systems: {
        title: "systems",
        body:
          "i try to make the data model, workflows, and failure modes obvious early so the team is not discovering the real shape of the problem at the end.",
      },
      product: {
        title: "product",
        body:
          "i like ambiguous product spaces where the right answer comes from tightening the loop between what users need, what the system can support, and what the team can actually maintain.",
      },
      collaboration: {
        title: "collaboration",
        body:
          "i work best with people who like direct feedback, quick iteration, and clear tradeoffs. i document decisions, surface risks early, and try to make handoffs lighter instead of louder.",
      },
    },
  },
  openTo: {
    title: "open to",
    intro:
      "i'm looking for full-time roles where i can own product problems end-to-end and work across the stack to ship them.",
    roles: [
      "senior full-stack or product engineering roles",
      "roles where product work touches deployment, data, or platform concerns",
      "founding or early-team roles where scope is wide and ownership is real",
    ],
    problemSpaces: [
      "internal tools and operational systems",
      "analytics, data, or ai-adjacent workflows",
      "teams that need stronger handoffs between product, platform, and delivery",
    ],
    boundaries: [
      "i'm a better fit for systems with ownership and ambiguity than for narrow feature-factory work.",
      "i care more about the problem and the team than about matching one exact title.",
    ],
  },
  resume: {
    title: "resume",
    summary:
      "short version: i've spent most of my time building operational tools, data-heavy products, and the glue between product intent and real delivery constraints.",
    highlights: [
      "product surfaces, operational tools, and workflow-heavy internal software",
      "analytics platforms, ai-assisted tooling, and data-driven interfaces",
      "developer tooling, shared systems, and team-facing enablement work",
    ],
    note: "the domain pages have full project walkthroughs with stack details, decisions, and outcomes.",
  },
  notes: {
    intro:
      "for the lighter field-note version of what i'm noticing while building and operating systems, head to the",
    label: "notes index",
  },
  seo: {
    title: "about",
    description:
      "how dom works across systems, product, collaboration, current fit, and a compact resume view.",
  },
} satisfies PersonalPageData;
