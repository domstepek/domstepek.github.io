import type { DomainEntry } from "./types";

const developerExperience: DomainEntry = {
  slug: "developer-experience",
  order: 5,
  title: "developer experience",
  summary:
    "tooling, automation, and shared systems that make engineers faster, safer, and less likely to reinvent the same thing.",
  seoDescription:
    "developer experience domain page for team tooling, design systems, and qa automation Dom builds.",
  thesis:
    "i invest in developer experience when the team keeps burning time on the same setup, regression, or ui tax.",
  scope:
    "if the primary user win is for engineers shipping or maintaining software, it belongs here; if the main outcome is customer or operator workflow value, that belongs in product.",
  belongsHere: [
    "shared tooling that replaces repeated setup, config edits, and release chores",
    "quality systems that catch regressions before they become somebody else's fire drill",
    "reusable ui or workflow primitives that keep teams from rebuilding the same patterns",
  ],
  supportingWork: [
    {
      title: "global design system",
      context:
        "a shared component library and Storybook workflow for keeping product surfaces more consistent without copy-pasting UI primitives.",
      proofLinks: [
        {
          label: "repo",
          href: "https://github.com/tpr-datalabs/global-design-system",
        },
      ],
    },
    {
      title: "web portal qa bdd",
      context:
        "a WebdriverIO and Cucumber automation suite covering portal workflows and API paths that were too important to leave to manual regression testing.",
      proofLinks: [
        {
          label: "repo",
          href: "https://github.com/tpr-datalabs/web-portal-qa-bdd",
        },
      ],
    },
    {
      title: "product team cli",
      context:
        "an internal CLI for environment setup, config edits, and feature toggles so recurring product-team tasks became guided and scriptable.",
      proofLinks: [
        {
          label: "repo",
          href: "https://github.com/tpr-datalabs/product-team-cli",
        },
      ],
    },
    {
      title: "product migration scripts",
      context:
        "migration tooling for moving analytics product data and configuration without turning every rollout into a manual cleanup project.",
      proofLinks: [
        {
          label: "repo",
          href: "https://github.com/tpr-datalabs/product-migration-scripts",
        },
      ],
    },
  ],
  relatedDomains: ["infrastructure", "product"],
};

export default developerExperience;
