export type DomainSlug =
  | "analytics"
  | "infrastructure"
  | "ai-ml"
  | "product"
  | "developer-experience";

export interface ProofLink {
  label: string;
  href: string;
}

export interface SupportingWorkItem {
  title: string;
  context: string;
  proofLinks?: ProofLink[];
}

export interface DomainEntry {
  slug: DomainSlug;
  order: number;
  title: string;
  summary: string;
  seoDescription: string;
  thesis: string;
  scope: string;
  belongsHere: string[];
  supportingWork: SupportingWorkItem[];
  relatedDomains?: DomainSlug[];
}
