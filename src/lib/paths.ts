import { siteConfig } from "../data/site";

const trimSlashes = (value: string) => value.replace(/^\/+|\/+$/g, "");
const basePrefix = siteConfig.basePath === "/" ? "" : siteConfig.basePath;
const absoluteUrlPattern = /^https?:\/\//;

export const routePath = (...segments: string[]) => {
  const path = segments.map(trimSlashes).filter(Boolean).join("/");

  if (!path) {
    return basePrefix ? `${basePrefix}/` : "/";
  }

  return basePrefix ? `${basePrefix}/${path}/` : `/${path}/`;
};

export const homePath = routePath();

export const aboutPath = routePath("about");

export const domainPath = (slug: string) => routePath("domains", slug);

export const notesPath = routePath("notes");

export const notePath = (slug: string) => routePath("notes", slug);

export const resumePath = `${aboutPath}#resume`;

export const assetPath = (asset: string) => {
  const normalizedAsset = trimSlashes(asset);

  if (!normalizedAsset) {
    return homePath;
  }

  return basePrefix ? `${basePrefix}/${normalizedAsset}` : `/${normalizedAsset}`;
};

const normalizeCanonicalPath = (path: string) => {
  if (!path || path === "/") {
    return homePath;
  }

  if (basePrefix && (path === basePrefix || path.startsWith(`${basePrefix}/`))) {
    return path.endsWith("/") ? path : `${path}/`;
  }

  return routePath(path);
};

export const canonicalUrl = (path = "/") => {
  if (absoluteUrlPattern.test(path)) {
    return path;
  }

  return new URL(normalizeCanonicalPath(path), siteConfig.siteUrl).toString();
};
