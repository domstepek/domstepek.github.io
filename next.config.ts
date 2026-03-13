import type { NextConfig } from 'next';

const config: NextConfig = {
  trailingSlash: true,
  typescript: {
    // Astro source files (src/pages/, src/components/, src/data/site.ts, etc.)
    // coexist on disk during the Astro→Next.js migration and produce TS errors
    // because astro/client types are no longer installed. These files are
    // removed in S04. Re-enable strict type checking after that slice completes.
    ignoreBuildErrors: true,
  },
};

export default config;
