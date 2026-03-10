import type { DomainEntry } from "./types";

const infrastructure: DomainEntry = {
  slug: "infrastructure",
  order: 2,
  title: "infrastructure",
  summary:
    "deploy, routing, and platform foundations that make services easier to ship and safer to run.",
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
  flagships: [
    {
      slug: "cdk-eks",
      title: "cdk-eks",
      summary:
        "the shared aws cdk foundation for standing up EKS, core addons, access patterns, and environment rails the rest of the platform depended on.",
      problem:
        "the team needed one repeatable way to create and evolve cluster infrastructure instead of treating every environment change like a fresh manual setup exercise.",
      role:
        "i turned the platform requirements into reusable cdk stacks and deployment structure so networking, cluster primitives, and key addons could move together instead of drifting by environment.",
      constraints: [
        "the foundation had to cover dev, qa, and prod differences without forking the entire infrastructure story per environment.",
        "cluster access, secrets, ingress, and autoscaling had to be ready before application teams could use the platform with confidence.",
        "changes needed to fit the existing delivery flow, where infrastructure updates were reviewed and promoted instead of hand-applied from laptops.",
      ],
      decisions: [
        "split the platform into focused stacks for networking, core eks setup, addons, access, and supporting services so platform changes stayed understandable.",
        "kept environment-specific values in dedicated config layers instead of cloning the stack code per stage.",
        "treated the repo as the source of truth for bootstrap plus ongoing platform evolution, not a pile of one-off console steps.",
      ],
      outcomes: [
        "gave the team a repeatable cluster foundation instead of a one-time environment buildout.",
        "made later platform work like argo cd, external secrets, ingress, and autoscaling easier to add on the same rail.",
        "turned infrastructure changes into reviewable code that matched the broader release workflow.",
      ],
      stack: [
        "aws cdk",
        "python",
        "Amazon EKS",
        "vpc and networking",
        "karpenter",
        "external secrets",
        "argo cd",
      ],
      proofLinks: [
        {
          label: "repo",
          href: "https://github.com/tpr-datalabs/cdk-eks",
        },
      ],
    },
    {
      slug: "stargazer-applications",
      title: "stargazer applications",
      summary:
        "the GitOps repo that let services land on the shared cluster through Helm charts, environment values, and ArgoCD ApplicationSet discovery instead of bespoke deploy playbooks.",
      problem:
        "once the cluster existed, application delivery still needed a repeatable path so teams could ship services without inventing a new kubernetes rollout shape every time.",
      role:
        "i shaped the deployment rail around chart structure, config conventions, and ArgoCD discovery so app repos could plug into the platform without re-arguing the release process.",
      constraints: [
        "the same repo had to support multiple applications and environment-specific config without turning into copy-pasted yaml sprawl.",
        "deploys needed to stay legible to platform and product teams, not only the person who set the first app up.",
        "the workflow had to cooperate with image builds, registries, and argo cd instead of introducing a second release system.",
      ],
      decisions: [
        "used a consistent per-app Helm chart layout with config and env value files so new services started from a clear pattern.",
        "leaned on ApplicationSet discovery so argo cd could pick up applications automatically rather than hand-registering each one.",
        "kept application deploy concerns in the GitOps repo while app repos handled code and image builds.",
      ],
      outcomes: [
        "made 'ship this service onto the cluster' a repeatable GitOps path instead of a bespoke platform request.",
        "reduced deployment drift between environments by putting chart structure and values under the same repo conventions.",
        "connected the platform foundation to day-to-day application delivery in a way teams could actually reuse.",
      ],
      stack: [
        "Helm",
        "ArgoCD",
        "ApplicationSet",
        "kubernetes",
        "environment-specific values",
        "GitOps",
      ],
      proofLinks: [
        {
          label: "repo",
          href: "https://github.com/tpr-datalabs/stargazer-applications",
        },
      ],
      visual: {
        src: "highlights/infrastructure/stargazer-applications/gitops-workflow.svg",
        alt: "a GitOps flow showing app code building an image, config changes landing in the stargazer applications repo, and ArgoCD syncing the release into the cluster.",
        caption:
          "the point was a repeatable handoff from app repo to GitOps config to cluster sync, not a one-off kubernetes ritual.",
      },
    },
  ],
  supportingWork: [
    {
      title: "private cdn",
      context:
        "an internal CDN and proxy layer for caching assets and controlling delivery paths in one place.",
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
        "a reusable auth sidecar that put SSO in front of ECS and EKS services without rebuilding the same edge logic per app.",
      proofLinks: [
        {
          label: "repo",
          href: "https://github.com/tpr-datalabs/sso-reverse-proxy",
        },
      ],
      overlapNote: "the protected apps themselves live in",
      relatedDomains: ["product"],
    },
  ],
  relatedDomains: ["developer-experience", "analytics"],
};

export default infrastructure;
