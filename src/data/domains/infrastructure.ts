import type { DomainEntry } from "./types";

const infrastructure: DomainEntry = {
  slug: "infrastructure",
  order: 2,
  title: "infrastructure",
  summary:
    "platform foundations, deploy rails, and edge systems that make services easier to ship and safer to run.",
  seoDescription:
    "infrastructure domain page for deploy rails, kubernetes foundations, and edge systems Dom builds.",
  thesis:
    "i do infrastructure work when the product problem is really a reliability, delivery, or platform problem in disguise.",
  scope:
    "if the hard part is provisioning, deploying, routing, or securing the system, it belongs here; if the main user win is inside the workflow itself, that is product.",
  belongsHere: [
    "cluster, network, and GitOps foundations that keep teams from hand-building every environment",
    "shared edge services for auth, caching, routing, and delivery policies",
    "operational systems that remove release anxiety and reduce platform drift",
  ],
  supportingWork: [
    {
      title: "cdk-eks",
      context:
        "the EKS foundation repo covering cluster creation, addons, Karpenter, external secrets, ingress, and ArgoCD.",
      proofLinks: [
        {
          label: "repo",
          href: "https://github.com/tpr-datalabs/cdk-eks",
        },
      ],
    },
    {
      title: "stargazer applications",
      context:
        "the GitOps repo for shipping Kubernetes applications through ArgoCD with environment-specific Helm values instead of ad hoc deploys.",
      proofLinks: [
        {
          label: "repo",
          href: "https://github.com/tpr-datalabs/stargazer-applications",
        },
      ],
    },
    {
      title: "private cdn",
      context:
        "an internal CDN and proxy service that combined caching and controlled delivery paths for assets and app traffic.",
      proofLinks: [
        {
          label: "repo",
          href: "https://github.com/tpr-datalabs/private_cdn",
        },
      ],
    },
    {
      title: "sso reverse proxy",
      context:
        "a reusable reverse-proxy sidecar that put SSO in front of ECS and EKS services without making every app rebuild the same edge behavior.",
      proofLinks: [
        {
          label: "repo",
          href: "https://github.com/tpr-datalabs/sso-reverse-proxy",
        },
      ],
    },
  ],
  relatedDomains: ["developer-experience", "analytics"],
};

export default infrastructure;
