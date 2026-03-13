/**
 * Astro environment type compatibility shim.
 * Extends ImportMeta so that Astro source files (src/data/site.ts etc.)
 * that use import.meta.env remain type-safe while coexisting with the
 * Next.js App Router during migration. These Astro files are removed in S04.
 */
interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL?: string;
  readonly PUBLIC_BASE_PATH?: string;
  readonly [key: string]: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
