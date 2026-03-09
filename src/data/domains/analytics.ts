import type { DomainEntry } from "./types";

const analytics: DomainEntry = {
  slug: "analytics",
  order: 1,
  title: "analytics",
  summary:
    "reporting surfaces, measurement workflows, and data tools that help teams trust what they are looking at.",
  seoDescription:
    "analytics domain page for reporting surfaces, measurement workflows, and data tools Dom builds.",
  thesis:
    "i build analytics systems when the real bottleneck is understanding the business, not collecting one more table.",
  scope:
    "if the job is helping people inspect, compare, or trust the data itself, it belongs here; if the hard part is shipping the platform or model behavior, it belongs somewhere else.",
  belongsHere: [
    "reporting products that turn warehouse or event data into daily operator workflows",
    "measurement layers that make trends, exceptions, and drill-down paths obvious before a team is flying blind",
    "data-heavy interfaces where query depth, filters, and clarity matter as much as frontend polish",
  ],
  supportingWork: [
    {
      title: "web portal",
      context:
        "the main analytics web portal for exploring and acting on data-heavy product workflows in one place.",
      proofLinks: [
        {
          label: "repo",
          href: "https://github.com/tpr-datalabs/web-portal",
        },
      ],
    },
    {
      title: "umami",
      context:
        "a self-hosted analytics deployment in AWS so measurement stayed inside our own stack instead of disappearing into a black box SaaS.",
      proofLinks: [
        {
          label: "repo",
          href: "https://github.com/tpr-datalabs/umami",
        },
      ],
    },
    {
      title: "superset on stargazer",
      context:
        "a Helm and ArgoCD path for running Apache Superset on the shared EKS platform, with room for dashboards, caching, and worker-based jobs.",
      proofLinks: [
        {
          label: "repo",
          href: "https://github.com/tpr-datalabs/stargazer-applications",
        },
      ],
    },
  ],
  relatedDomains: ["product", "ai-ml"],
};

export default analytics;
