import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { getDomainBySlug } from '@/data/domains/index';
import { DomainGatePage } from '@/components/domains/DomainGatePage';
import { DomainProofPage } from '@/components/domains/DomainProofPage';

/**
 * Force dynamic rendering — auth state is per-request (HttpOnly cookie).
 * Static generation would bake in one auth state for all visitors.
 */
export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Domain route — server component.
 *
 * Unauthenticated: renders DomainGatePage (gate markers, no proof content).
 * Authenticated: renders proof page (stub — full proof wired in T04).
 *
 * Cookie check via `await cookies()` — never synchronous (D033).
 * D036: Gate and proof render at the same URL (/domains/[slug]/).
 */
export default async function DomainPage({ params }: PageProps) {
  const { slug } = await params;

  const domain = getDomainBySlug(slug);
  if (!domain) {
    notFound();
  }

  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.has('portfolio-gate');

  if (!isAuthenticated) {
    return <DomainGatePage slug={slug} domain={domain} />;
  }

  return <DomainProofPage domain={domain} />;
}
