import analyticsAi from "./analytics-ai";
import developerExperience from "./developer-experience";
import product from "./product";
import type { DomainEntry, DomainSlug } from "./types";

export const domains: DomainEntry[] = [
  product,
  analyticsAi,
  developerExperience,
].sort((left, right) => left.order - right.order);

export const domainSlugs: DomainSlug[] = domains.map((domain) => domain.slug);

export const getDomainBySlug = (slug: string) =>
  domains.find((domain) => domain.slug === slug);
