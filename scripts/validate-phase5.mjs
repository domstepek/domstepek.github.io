import { access, readFile, stat } from "node:fs/promises";
import { constants as fsConstants } from "node:fs";
import { resolve } from "node:path";

const DIST_DIR = resolve(process.cwd(), "dist");
const INDEX_PATH = resolve(DIST_DIR, "index.html");
const ABOUT_PATH = resolve(DIST_DIR, "about", "index.html");
const NOTES_INDEX_PATH = resolve(DIST_DIR, "notes", "index.html");

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

const getElementTextByAttribute = (html, attributeName) => {
  const block = getFirstElementBlockByAttribute(html, attributeName);
  return block ? stripTags(block.innerHtml) : "";
};

const getAnchorsWithAttribute = (html, attributeName) =>
  getElementsWithAttribute(html, attributeName).filter((tag) => tag.name === "a");

const getLinkHref = (html, relation) => {
  const linkTag = getTags(html, "link").find((tag) =>
    (tag.attributes.rel ?? "")
      .split(/\s+/)
      .map((value) => value.toLowerCase())
      .includes(relation.toLowerCase()),
  );

  return linkTag?.attributes.href ?? "";
};

const getMetaContent = (html, name) => {
  const metaTag = getTags(html, "meta").find(
    (tag) => (tag.attributes.name ?? "").toLowerCase() === name.toLowerCase(),
  );

  return metaTag?.attributes.content ?? "";
};

const getTitle = (html) => html.match(/<title>\s*([^<]+?)\s*<\/title>/i)?.[1] ?? "";

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

const getBasePathFromCanonical = (canonicalHref) => {
  try {
    const canonicalUrl = new URL(canonicalHref);
    return normalizePathname(canonicalUrl.pathname);
  } catch {
    return "";
  }
};

const getDistArtifactPathFromHref = (basePath, href) => {
  const normalizedBasePath = normalizePathname(basePath);
  const normalizedHref = normalizePathname(href);

  if (!normalizedHref.startsWith(normalizedBasePath)) {
    return "";
  }

  const relativePath = normalizedHref.slice(normalizedBasePath.length).replace(/^\/+/, "");

  if (!relativePath) {
    return resolve(DIST_DIR, "index.html");
  }

  return resolve(DIST_DIR, relativePath, "index.html");
};

const getExpectedPaths = (basePath) => {
  const normalizedBasePath = normalizePathname(basePath);
  const aboutHref = joinPathname(normalizedBasePath, "about");
  const notesHref = joinPathname(normalizedBasePath, "notes");

  return {
    aboutHref,
    notesHref,
    resumeHref: `${aboutHref}#resume`,
  };
};

const getDateTimeValue = (html, attributeName) => {
  const element = getElementsWithAttribute(html, attributeName).find((tag) => tag.name === "time");
  return element?.attributes.datetime ?? "";
};

const validateHomepage = async () => {
  await expectFile(INDEX_PATH, "Homepage artifact");

  if (failures.some((failure) => failure.includes("Homepage artifact"))) {
    return {};
  }

  const homepageHtml = await readFile(INDEX_PATH, "utf8");
  const homepageCanonical = getLinkHref(homepageHtml, "canonical");

  expectAbsoluteHttpUrl(homepageCanonical, 'Homepage link rel="canonical"');

  const teaserSections = getElementsWithAttribute(homepageHtml, "data-home-personal-teaser");
  if (teaserSections.length !== 1) {
    failures.push(
      `Homepage should expose exactly 1 data-home-personal-teaser section, received ${teaserSections.length}.`,
    );
  } else {
    expectNonEmpty(
      getElementTextByAttribute(homepageHtml, "data-home-personal-teaser"),
      "Homepage personal teaser text",
    );
  }

  const basePath = getBasePathFromCanonical(homepageCanonical);
  const { aboutHref, resumeHref } = getExpectedPaths(basePath);

  const personalLinks = getAnchorsWithAttribute(homepageHtml, "data-home-personal-link");
  if (personalLinks.length !== 1) {
    failures.push(
      `Homepage should expose exactly 1 data-home-personal-link anchor, received ${personalLinks.length}.`,
    );
  } else {
    const href = personalLinks[0].attributes.href ?? "";
    expectNonEmpty(href, "Homepage personal link href");

    if (href && href !== aboutHref) {
      failures.push(`Homepage personal link should resolve to "${aboutHref}", received "${href}".`);
    }
  }

  const resumeLinks = getAnchorsWithAttribute(homepageHtml, "data-home-resume-link");
  if (resumeLinks.length !== 1) {
    failures.push(
      `Homepage should expose exactly 1 data-home-resume-link anchor, received ${resumeLinks.length}.`,
    );
  } else {
    const href = resumeLinks[0].attributes.href ?? "";
    expectNonEmpty(href, "Homepage resume link href");

    if (href && href !== resumeHref) {
      failures.push(`Homepage resume link should resolve to "${resumeHref}", received "${href}".`);
    }
  }

  return { basePath, aboutHref, notesHref: getExpectedPaths(basePath).notesHref };
};

const validateAboutPage = async (basePath, notesHref) => {
  await expectFile(ABOUT_PATH, "About artifact");

  if (failures.some((failure) => failure.includes("About artifact"))) {
    return;
  }

  const aboutHtml = await readFile(ABOUT_PATH, "utf8");
  const aboutCanonical = getLinkHref(aboutHtml, "canonical");
  const expectedAboutHref = getExpectedPaths(basePath).aboutHref;

  expectAbsoluteHttpUrl(aboutCanonical, 'About link rel="canonical"');

  const aboutPageBlocks = getElementBlocksWithAttribute(aboutHtml, "data-personal-page");
  if (aboutPageBlocks.length !== 1) {
    failures.push(
      `About page should expose exactly 1 data-personal-page block, received ${aboutPageBlocks.length}.`,
    );
  }

  for (const attributeName of [
    "data-how-i-work",
    "data-how-i-work-systems",
    "data-how-i-work-product",
    "data-how-i-work-collaboration",
    "data-open-to",
    "data-resume-section",
  ]) {
    expectNonEmpty(getElementTextByAttribute(aboutHtml, attributeName), `About page ${attributeName}`);
  }

  const notesLinks = getAnchorsWithAttribute(aboutHtml, "data-personal-notes-link");
  if (notesLinks.length !== 1) {
    failures.push(
      `About page should expose exactly 1 data-personal-notes-link anchor, received ${notesLinks.length}.`,
    );
  } else {
    const href = notesLinks[0].attributes.href ?? "";
    expectNonEmpty(href, "About page notes link href");

    if (href && href !== notesHref) {
      failures.push(`About page notes link should resolve to "${notesHref}", received "${href}".`);
    }
  }

  if (aboutCanonical) {
    try {
      const url = new URL(aboutCanonical);
      const actualAboutHref = normalizePathname(url.pathname);

      if (actualAboutHref !== expectedAboutHref) {
        failures.push(
          `About canonical pathname should resolve to "${expectedAboutHref}", received "${actualAboutHref}".`,
        );
      }
    } catch {
      // handled above by absolute URL validation
    }
  }
};

const extractNoteItems = (notesIndexHtml) =>
  getElementBlocksWithAttribute(notesIndexHtml, "data-note-item")
    .filter((item) => item.name === "article")
    .map((item, index) => {
      const title = getElementTextByAttribute(item.innerHtml, "data-note-title");
      const summary = getElementTextByAttribute(item.innerHtml, "data-note-summary");
      const dateText = getElementTextByAttribute(item.innerHtml, "data-note-date");
      const dateElement = getElementsWithAttribute(item.innerHtml, "data-note-date").find(
        (tag) => tag.name === "time",
      );
      const link = getAnchorsWithAttribute(item.innerHtml, "data-note-link")[0];

      expectNonEmpty(title, `Notes index item #${index + 1} title`);
      expectNonEmpty(summary, `Notes index item #${index + 1} summary`);
      expectNonEmpty(dateText, `Notes index item #${index + 1} date text`);
      expectNonEmpty(dateElement?.attributes.datetime ?? "", `Notes index item #${index + 1} datetime`);
      expectNonEmpty(link?.attributes.href ?? "", `Notes index item #${index + 1} href`);

      return {
        title,
        summary,
        dateText,
        datetime: dateElement?.attributes.datetime ?? "",
        href: link?.attributes.href ?? "",
      };
    });

const validateNoteIndexOrdering = (noteItems) => {
  for (let index = 1; index < noteItems.length; index += 1) {
    const previous = Date.parse(noteItems[index - 1].datetime);
    const current = Date.parse(noteItems[index].datetime);

    if (Number.isNaN(previous) || Number.isNaN(current)) {
      continue;
    }

    if (previous < current) {
      failures.push(
        "Notes index should be reverse-chronological by rendered datetime values, but a newer note appears after an older one.",
      );
      return;
    }
  }
};

const validateNotePage = async (basePath, noteItem, index) => {
  const labelPrefix = `Note page #${index + 1}`;
  const artifactPath = getDistArtifactPathFromHref(basePath, noteItem.href);

  if (!artifactPath) {
    failures.push(`${labelPrefix} href "${noteItem.href}" does not resolve under the base-aware notes path.`);
    return;
  }

  await expectFile(artifactPath, `${labelPrefix} artifact`);

  if (failures.some((failure) => failure.includes(`${labelPrefix} artifact`))) {
    return;
  }

  const html = await readFile(artifactPath, "utf8");
  const canonicalHref = getLinkHref(html, "canonical");
  const titleTag = getTitle(html);
  const metaDescription = getMetaContent(html, "description");
  const pageTitle = getElementTextByAttribute(html, "data-note-title");
  const pageDateText = getElementTextByAttribute(html, "data-note-date");
  const pageDateTime = getDateTimeValue(html, "data-note-date");
  const pageBodyText = getElementTextByAttribute(html, "data-note-body");

  expectAbsoluteHttpUrl(canonicalHref, `${labelPrefix} link rel="canonical"`);
  expectNonEmpty(titleTag, `${labelPrefix} <title>`);
  expectNonEmpty(metaDescription, `${labelPrefix} meta description`);
  expectNonEmpty(pageTitle, `${labelPrefix} data-note-title text`);
  expectNonEmpty(pageDateText, `${labelPrefix} data-note-date text`);
  expectNonEmpty(pageDateTime, `${labelPrefix} data-note-date datetime`);
  expectNonEmpty(pageBodyText, `${labelPrefix} data-note-body text`);

  if (titleTag && pageTitle && !titleTag.toLowerCase().includes(pageTitle.toLowerCase())) {
    failures.push(
      `${labelPrefix} <title> should include the rendered note title "${pageTitle}", received "${titleTag}".`,
    );
  }

  if (metaDescription && noteItem.summary && metaDescription !== noteItem.summary) {
    failures.push(
      `${labelPrefix} meta description should match the note summary from the index. Expected "${noteItem.summary}", received "${metaDescription}".`,
    );
  }
};

const validateNotesIndex = async (basePath, notesHref) => {
  await expectFile(NOTES_INDEX_PATH, "Notes index artifact");

  if (failures.some((failure) => failure.includes("Notes index artifact"))) {
    return;
  }

  const notesIndexHtml = await readFile(NOTES_INDEX_PATH, "utf8");
  const canonicalHref = getLinkHref(notesIndexHtml, "canonical");

  expectAbsoluteHttpUrl(canonicalHref, 'Notes index link rel="canonical"');

  const notesIndexBlocks = getElementBlocksWithAttribute(notesIndexHtml, "data-notes-index");
  if (notesIndexBlocks.length !== 1) {
    failures.push(
      `Notes index should expose exactly 1 data-notes-index block, received ${notesIndexBlocks.length}.`,
    );
  }

  const noteItems = extractNoteItems(notesIndexHtml);
  if (noteItems.length < 2) {
    failures.push(`Notes index should render at least 2 note items, received ${noteItems.length}.`);
  }

  if (canonicalHref) {
    try {
      const url = new URL(canonicalHref);
      const actualNotesHref = normalizePathname(url.pathname);

      if (actualNotesHref !== notesHref) {
        failures.push(
          `Notes canonical pathname should resolve to "${notesHref}", received "${actualNotesHref}".`,
        );
      }
    } catch {
      // handled above by absolute URL validation
    }
  }

  noteItems.forEach((noteItem, index) => {
    if (!noteItem.href.startsWith(notesHref)) {
      failures.push(
        `Notes index item #${index + 1} should use a base-aware notes path beginning with "${notesHref}", received "${noteItem.href}".`,
      );
    }
  });

  validateNoteIndexOrdering(noteItems);

  await Promise.all(noteItems.map((noteItem, index) => validateNotePage(basePath, noteItem, index)));
};

const { basePath = "", notesHref = "" } = await validateHomepage();

if (basePath && notesHref) {
  await validateAboutPage(basePath, notesHref);
  await validateNotesIndex(basePath, notesHref);
}

if (failures.length > 0) {
  console.error("Phase 5 validation failed:");

  for (const failure of failures) {
    console.error(`- ${failure}`);
  }

  process.exit(1);
}

console.log("Phase 5 validation passed.");
console.log("- Homepage personal teaser links resolve to the about page and resume anchor.");
console.log("- About page profile markers, resume section, and notes entry point are present.");
console.log("- Notes index and linked note pages render with stable metadata and content markers.");
