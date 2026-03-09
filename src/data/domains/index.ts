import aiMl from "./ai-ml";
import analytics from "./analytics";
import developerExperience from "./developer-experience";
import infrastructure from "./infrastructure";
import product from "./product";
import type { DomainEntry, DomainSlug } from "./types";

export const domains: DomainEntry[] = [
  analytics,
  infrastructure,
  aiMl,
  product,
  developerExperience,
].sort((left, right) => left.order - right.order);

export const domainSlugs: DomainSlug[] = domains.map((domain) => domain.slug);

export const getDomainBySlug = (slug: string) =>
  domains.find((domain) => domain.slug === slug);
