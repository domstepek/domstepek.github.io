/**
 * Normalized view-model for a domain's proof content.
 * Used by both the Astro cold-render (DomainPage) and the browser
 * unlock path (domain-gate-client) so proof layout lives in one shape.
 */

import { getDomainBySlug } from "./index";
import type { DomainEntry, DomainSlug, ProofLink } from "./types";

/* ── resolved types ────────────────────────────────── */

export interface ResolvedProofLink extends ProofLink {}

export interface ResolvedVisual {
  src?: string;
  alt: string;
  caption?: string;
  mermaid?: string;
}

export interface ResolvedScreenshot {
  src: string;
  alt: string;
  caption?: string;
}

export interface ResolvedFlagship {
  slug: string;
  title: string;
  summary: string;
  problem: string;
  role: string;
  constraints: string[];
  decisions: string[];
  outcomes: string[];
  stack: string[];
  proofLinks: ResolvedProofLink[];
  visual?: ResolvedVisual;
  screenshots: ResolvedScreenshot[];
}

export interface ResolvedSupportingItem {
  title: string;
  context: string;
  proofLinks: ResolvedProofLink[];
  overlapNote?: string;
  relatedEntries: { slug: DomainSlug; title: string; href: string }[];
}

export interface ResolvedRelatedDomain {
  slug: DomainSlug;
  title: string;
  href: string;
}

export interface DomainProofViewModel {
  slug: DomainSlug;
  title: string;
  thesis: string;
  scope: string;
  belongsHere: string[];
  flagships: ResolvedFlagship[];
  supportingItems: ResolvedSupportingItem[];
  relatedDomains: ResolvedRelatedDomain[];
}

/* ── helpers ───────────────────────────────────────── */

const toVisualSrc = (source: string, assetPath: (p: string) => string): string =>
  source.startsWith("http://") || source.startsWith("https://")
    ? source
    : assetPath(source);

const resolveRelated = (
  slugs: DomainSlug[],
  domainPath: (s: string) => string,
): ResolvedRelatedDomain[] =>
  slugs
    .map((s) => {
      const entry = getDomainBySlug(s);
      return entry ? { slug: entry.slug, title: entry.title, href: domainPath(entry.slug) } : null;
    })
    .filter((e): e is ResolvedRelatedDomain => e !== null);

/* ── builder ───────────────────────────────────────── */

export function buildDomainProofViewModel(
  domain: DomainEntry,
  assetPath: (p: string) => string,
  domainPath: (s: string) => string,
): DomainProofViewModel {
  const flagships: ResolvedFlagship[] = (domain.flagships ?? []).map((f) => ({
    slug: f.slug,
    title: f.title,
    summary: f.summary,
    problem: f.problem,
    role: f.role,
    constraints: f.constraints,
    decisions: f.decisions,
    outcomes: f.outcomes,
    stack: f.stack,
    proofLinks: f.proofLinks ?? [],
    visual: f.visual
      ? {
          ...f.visual,
          src: f.visual.src ? toVisualSrc(f.visual.src, assetPath) : undefined,
        }
      : undefined,
    screenshots: (f.screenshots ?? []).map((s) => ({
      ...s,
      src: toVisualSrc(s.src, assetPath),
    })),
  }));

  const supportingItems: ResolvedSupportingItem[] = domain.supportingWork.map((item) => ({
    title: item.title,
    context: item.context,
    proofLinks: item.proofLinks ?? [],
    overlapNote: item.overlapNote,
    relatedEntries: resolveRelated(item.relatedDomains ?? [], domainPath).map((e) => ({
      slug: e.slug,
      title: e.title,
      href: e.href,
    })),
  }));

  return {
    slug: domain.slug,
    title: domain.title,
    thesis: domain.thesis,
    scope: domain.scope,
    belongsHere: domain.belongsHere,
    flagships,
    supportingItems,
    relatedDomains: resolveRelated(domain.relatedDomains ?? [], domainPath),
  };
}
