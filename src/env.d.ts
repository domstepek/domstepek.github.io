/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL?: string;
  readonly PUBLIC_BASE_PATH?: string;
  /** SHA-256 hex hash of the domain gate passcode (public, non-secret) */
  readonly PUBLIC_GATE_HASH?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
