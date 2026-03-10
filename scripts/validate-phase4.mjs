import { access, readFile, stat } from "node:fs/promises";
import { constants as fsConstants } from "node:fs";
import { resolve } from "node:path";

const DIST_DIR = resolve(process.cwd(), "dist");
const DOMAIN_SLUGS = [
  "analytics",
  "infrastructure",
  "ai-ml",
  "product",
  "developer-experience",
];
const REMOTE_URL_PATTERN = /^https?:\/\//i;

const failures = [];

const normalizePathname = (value) => {
  if (!value || value === "/") {
    return "/";
  }

  const withLeadingSlash = value.startsWith("/") ? value : `/${value}`;
  return withLeadingSlash.endsWith("/") ? withLeadingSlash : `${withLeadingSlash}/`;
};

const joinPathname = (basePath, ...segments) => {
  const normalizedBasePath = normalizePathname(basePath);
  const normalizedSegments = segments
    .map((segment) => String(segment).replace(/^\/+|\/+$/g, ""))
    .filter(Boolean);

  if (normalizedSegments.length === 0) {
    return normalizedBasePath;
  }

  if (normalizedBasePath === "/") {
    return `/${normalizedSegments.join("/")}/`;
  }

  return `${normalizedBasePath}${normalizedSegments.join("/")}/`;
};

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const stripTags = (value) => value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

const parseAttributes = (tag) => {
  const attributes = {};
  const innerTag = tag.replace(/^<[^\s>]+\s*/, "").replace(/\s*\/?>$/, "");
  const attributePattern =
    /([^\s=\/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;

  for (const [, rawName, doubleQuoted, singleQuoted, bareValue] of innerTag.matchAll(
    attributePattern,
  )) {
    const name = rawName.toLowerCase();

    if (!name || name === "/") {
      continue;
    }

    attributes[name] = (doubleQuoted ?? singleQuoted ?? bareValue ?? "").trim();
  }

  return attributes;
};

const getStartTags = (html) =>
  Array.from(html.matchAll(/<([a-zA-Z][\w:-]*)(?:\s[^>]*?)?>/g), (match) => ({
    tag: match[0],
    name: match[1].toLowerCase(),
    attributes: parseAttributes(match[0]),
    index: match.index ?? 0,
  }));

const getTags = (html, tagName) =>
  getStartTags(html).filter((tag) => tag.name === tagName.toLowerCase());

const getElementsWithAttribute = (html, attributeName) =>
  getStartTags(html).filter((tag) =>
    Object.prototype.hasOwnProperty.call(tag.attributes, attributeName.toLowerCase()),
  );

const getElementRange = (html, element) => {
  const tagPattern = new RegExp(`<\\/?${escapeRegExp(element.name)}\\b[^>]*>`, "gi");
  tagPattern.lastIndex = element.index;

  let depth = 0;
  let match;

  while ((match = tagPattern.exec(html))) {
    const tag = match[0];
    const isClosing = tag.startsWith("</");
    const isSelfClosing = tag.endsWith("/>");

    if (!isClosing) {
      depth += 1;

      if (isSelfClosing) {
        depth -= 1;
      }

      continue;
    }

    depth -= 1;

    if (depth === 0) {
      return {
        innerStart: element.index + element.tag.length,
        innerEnd: match.index,
      };
    }
  }

  return null;
};

const getElementBlocksWithAttribute = (html, attributeName) =>
  getElementsWithAttribute(html, attributeName)
    .map((element) => {
      const range = getElementRange(html, element);

      if (!range) {
        return null;
      }

      return {
        ...element,
        innerHtml: html.slice(range.innerStart, range.innerEnd),
      };
    })
    .filter(Boolean);

const getFirstElementBlockByAttribute = (html, attributeName) =>
  getElementBlocksWithAttribute(html, attributeName)[0] ?? null;

const getListItemTexts = (html) =>
  Array.from(html.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi), ([, innerHtml]) =>
    stripTags(innerHtml),
  ).filter(Boolean);

const stripLeadingLabel = (value, label) =>
  value.replace(new RegExp(`^${escapeRegExp(label)}\\s*:\\s*`, "i"), "").trim();

const expectFile = async (filePath, label) => {
  try {
    await access(filePath, fsConstants.F_OK);
    const fileStats = await stat(filePath);

    if (fileStats.size === 0) {
      failures.push(`${label} exists but is empty (${filePath}).`);
    }
  } catch {
    failures.push(`${label} is missing (${filePath}).`);
  }
};

const expectNonEmpty = (value, label) => {
  if (!value?.trim()) {
    failures.push(`${label} is missing or empty.`);
  }
};

const expectAbsoluteHttpUrl = (value, label) => {
  expectNonEmpty(value, label);

  if (!value?.trim()) {
    return;
  }

  try {
    const url = new URL(value);

    if (!["http:", "https:"].includes(url.protocol)) {
      failures.push(`${label} must use http or https, received "${value}".`);
    }
  } catch {
    failures.push(`${label} must be an absolute http(s) URL, received "${value}".`);
  }
};

const getLinkHref = (html, relation) => {
  const linkTag = getTags(html, "link").find((tag) =>
    (tag.attributes.rel ?? "")
      .split(/\s+/)
      .map((value) => value.toLowerCase())
      .includes(relation.toLowerCase()),
  );

  return linkTag?.attributes.href ?? "";
};

const getExpectedHomeHref = (canonicalHref, slug) => {
  try {
    const canonicalUrl = new URL(canonicalHref);
    const suffix = `/domains/${slug}/`;

    if (!canonicalUrl.pathname.endsWith(suffix)) {
      failures.push(
        `${slug}: canonical URL pathname should end with "${suffix}", received "${canonicalUrl.pathname}".`,
      );
      return "";
    }

    const homePath = canonicalUrl.pathname.slice(0, -suffix.length) || "/";
    return normalizePathname(homePath);
  } catch {
    return "";
  }
};

const getFieldText = (html, attributeName, label = "") => {
  const block = getFirstElementBlockByAttribute(html, attributeName);

  if (!block) {
    return "";
  }

  const text = stripTags(block.innerHtml);
  return label ? stripLeadingLabel(text, label) : text.trim();
};

const getGroupContentText = (html, attributeName, label) => {
  const block = getFirstElementBlockByAttribute(html, attributeName);

  if (!block) {
    return "";
  }

  const items = getListItemTexts(block.innerHtml);
  if (items.length > 0) {
    return items.join(" ").trim();
  }

  return stripLeadingLabel(stripTags(block.innerHtml), label);
};

const getGroupItems = (html, attributeName) => {
  const block = getFirstElementBlockByAttribute(html, attributeName);
  return block ? getListItemTexts(block.innerHtml) : [];
};

const validateVisualBlock = async (visualBlock, slug, flagshipNumber, expectedHomeHref) => {
  const images = getTags(visualBlock.innerHtml, "img");

  if (images.length === 0) {
    failures.push(`${slug}: flagship #${flagshipNumber} visual is missing an <img>.`);
    return;
  }

  const expectedLocalPrefix = expectedHomeHref ? joinPathname(expectedHomeHref, "highlights") : "";

  for (const [imageIndex, image] of images.entries()) {
    const imageLabel = `${slug}: flagship #${flagshipNumber} visual image #${imageIndex + 1}`;
    const src = image.attributes.src ?? "";
    const alt = image.attributes.alt ?? "";

    expectNonEmpty(src, `${imageLabel} src`);
    expectNonEmpty(alt, `${imageLabel} alt`);

    if (!src.trim()) {
      continue;
    }

    if (REMOTE_URL_PATTERN.test(src)) {
      expectAbsoluteHttpUrl(src, `${imageLabel} src`);
      continue;
    }

    if (!expectedLocalPrefix) {
      continue;
    }

    if (!src.startsWith(expectedLocalPrefix)) {
      failures.push(
        `${imageLabel} should use the base-aware local highlights path "${expectedLocalPrefix}", received "${src}".`,
      );
      continue;
    }

    const relativeAssetPath = src.slice(expectedHomeHref.length).replace(/^\/+/, "");
    const assetPath = resolve(DIST_DIR, relativeAssetPath);
    await expectFile(assetPath, `${imageLabel} asset`);
  }
};

const validateFlagship = async (flagshipBlock, slug, flagshipNumber, expectedHomeHref) => {
  const fieldPrefix = `${slug}: flagship #${flagshipNumber}`;

  expectNonEmpty(
    getFieldText(flagshipBlock.innerHtml, "data-flagship-title"),
    `${fieldPrefix} title`,
  );
  expectNonEmpty(
    getFieldText(flagshipBlock.innerHtml, "data-flagship-problem", "problem"),
    `${fieldPrefix} problem`,
  );
  expectNonEmpty(
    getFieldText(flagshipBlock.innerHtml, "data-flagship-role", "role"),
    `${fieldPrefix} role`,
  );
  expectNonEmpty(
    getGroupContentText(flagshipBlock.innerHtml, "data-flagship-outcomes", "outcomes"),
    `${fieldPrefix} outcomes`,
  );

  const constraints = getGroupItems(flagshipBlock.innerHtml, "data-flagship-constraints");
  const decisions = getGroupItems(flagshipBlock.innerHtml, "data-flagship-decisions");
  const stack = getGroupItems(flagshipBlock.innerHtml, "data-flagship-stack");

  if (constraints.length === 0) {
    failures.push(`${fieldPrefix} must include at least one constraint item.`);
  }

  if (decisions.length === 0) {
    failures.push(`${fieldPrefix} must include at least one decision item.`);
  }

  if (stack.length === 0) {
    failures.push(`${fieldPrefix} must include at least one stack item.`);
  }

  const proofLinks = getElementsWithAttribute(flagshipBlock.innerHtml, "data-flagship-proof-link").filter(
    (tag) => tag.name === "a",
  );

  proofLinks.forEach((tag, index) => {
    expectAbsoluteHttpUrl(
      tag.attributes.href ?? "",
      `${fieldPrefix} proof link #${index + 1} href`,
    );
  });

  const visualBlocks = getElementBlocksWithAttribute(flagshipBlock.innerHtml, "data-flagship-visual");

  await Promise.all(
    visualBlocks.map((visualBlock) =>
      validateVisualBlock(visualBlock, slug, flagshipNumber, expectedHomeHref),
    ),
  );
};

const validateDomainArtifact = async (slug) => {
  const artifactPath = resolve(DIST_DIR, "domains", slug, "index.html");

  await expectFile(artifactPath, `${slug} domain artifact`);

  if (failures.some((failure) => failure.includes(`${slug} domain artifact`))) {
    return;
  }

  const html = await readFile(artifactPath, "utf8");
  const canonicalHref = getLinkHref(html, "canonical");

  expectAbsoluteHttpUrl(canonicalHref, `${slug}: link rel="canonical"`);

  const flagshipSections = getElementsWithAttribute(html, "data-flagship-highlights");
  if (flagshipSections.length !== 1) {
    failures.push(
      `${slug}: should expose exactly 1 data-flagship-highlights section, received ${flagshipSections.length}.`,
    );
  }

  const flagshipBlocks = getElementBlocksWithAttribute(html, "data-flagship").filter(
    (element) => element.name === "article",
  );

  if (flagshipBlocks.length < 1 || flagshipBlocks.length > 2) {
    failures.push(
      `${slug}: should render between 1 and 2 data-flagship entries, received ${flagshipBlocks.length}.`,
    );
  }

  const expectedHomeHref = getExpectedHomeHref(canonicalHref, slug);

  await Promise.all(
    flagshipBlocks.map((flagshipBlock, index) =>
      validateFlagship(flagshipBlock, slug, index + 1, expectedHomeHref),
    ),
  );
};

await Promise.all(DOMAIN_SLUGS.map((slug) => validateDomainArtifact(slug)));

if (failures.length > 0) {
  console.error("Phase 4 validation failed:");

  for (const failure of failures) {
    console.error(`- ${failure}`);
  }

  process.exit(1);
}

console.log("Phase 4 validation passed.");
console.log("- All five domain artifacts exist and expose one flagship highlights section.");
console.log("- Each page renders 1 to 2 flagship entries with the required structural depth.");
console.log("- Proof links are absolute http(s) URLs and optional visuals stay base-aware.");
