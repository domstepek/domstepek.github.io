/**
 * Public page acceptance tests — S02 slice verification
 *
 * Tests validate that public routes render with correct data-* markers,
 * contain no gate markers, and the notes pipeline works end-to-end.
 * Created in T01 as skeleton — most tests will fail until T02–T04.
 */

import { expect, test } from "@playwright/test";

// ---------------------------------------------------------------------------
// Test 1 — Home page renders with correct markers
// ---------------------------------------------------------------------------

test("public: home page has data-home-page, public visibility, and open gate state", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page.locator("[data-home-page]")).toBeVisible();
  await expect(
    page.locator('[data-route-visibility="public"]')
  ).toBeVisible();
  await expect(page.locator('[data-gate-state="open"]')).toBeVisible();
});

// ---------------------------------------------------------------------------
// Test 2 — About page renders with correct markers
// ---------------------------------------------------------------------------

test("public: about page has data-personal-page and public boundary markers", async ({
  page,
}) => {
  await page.goto("/about/");

  await expect(page.locator("[data-personal-page]")).toBeVisible();
  await expect(
    page.locator('[data-route-visibility="public"]')
  ).toBeVisible();
  await expect(page.locator('[data-gate-state="open"]')).toBeVisible();
});

// ---------------------------------------------------------------------------
// Test 3 — Resume page renders with correct markers
// ---------------------------------------------------------------------------

test("public: resume page has data-resume-page and public boundary markers", async ({
  page,
}) => {
  await page.goto("/resume/");

  await expect(page.locator("[data-resume-page]")).toBeVisible();
  await expect(
    page.locator('[data-route-visibility="public"]')
  ).toBeVisible();
  await expect(page.locator('[data-gate-state="open"]')).toBeVisible();
});

// ---------------------------------------------------------------------------
// Test 4 — Public pages contain no gate markers
// ---------------------------------------------------------------------------

test("public: home, about, resume contain no protected gate markers", async ({
  page,
}) => {
  const publicRoutes = ["/", "/about/", "/resume/"];

  for (const route of publicRoutes) {
    await page.goto(route);

    // None of these protected-route markers should be present
    await expect(page.locator("[data-protected-gate]")).toHaveCount(0);
    await expect(
      page.locator('[data-gate-state="locked"]')
    ).toHaveCount(0);
  }
});

// ---------------------------------------------------------------------------
// Test 5 — Notes index renders with markers and at least one note item
// ---------------------------------------------------------------------------

test("public: notes index has data-notes-index and at least one data-note-item", async ({
  page,
}) => {
  await page.goto("/notes/");

  await expect(page.locator("[data-notes-index]")).toBeVisible();
  await expect(page.locator("[data-note-item]").first()).toBeVisible();
});

// ---------------------------------------------------------------------------
// Test 6 — Note detail page renders with content
// ---------------------------------------------------------------------------

test("public: note detail has data-note-page and data-note-body with content", async ({
  page,
}) => {
  // Navigate to notes index first, then click the first note link
  await page.goto("/notes/");
  const firstNoteLink = page.locator("[data-note-item] a").first();
  await expect(firstNoteLink).toBeVisible();
  const href = await firstNoteLink.getAttribute("href");
  expect(href).toBeTruthy();

  await page.goto(href!);
  await expect(page.locator("[data-note-page]")).toBeVisible();

  const noteBody = page.locator("[data-note-body]");
  await expect(noteBody).toBeVisible();

  // Body should have rendered HTML content (not empty)
  const bodyContent = await noteBody.innerHTML();
  expect(bodyContent.trim().length).toBeGreaterThan(0);
});

// ---------------------------------------------------------------------------
// Test 7 — Unknown route shows 404 content
// ---------------------------------------------------------------------------

test("public: unknown route shows 404 page", async ({ page }) => {
  const response = await page.goto("/this-route-definitely-does-not-exist/");

  // Next.js returns 404 status
  expect(response?.status()).toBe(404);

  // Custom 404 page renders with content and home link
  await expect(page.locator("[data-not-found-page]")).toBeVisible();
  await expect(page.getByText("page not found")).toBeVisible();
  await expect(page.getByRole("link", { name: /return home/i })).toBeVisible();
});

// ---------------------------------------------------------------------------
// Test 8 — Notes routes have no gate markers
// ---------------------------------------------------------------------------

test("public: notes routes have no gate markers", async ({ page }) => {
  // Check notes index
  await page.goto("/notes/");
  await expect(page.locator("[data-protected-gate]")).toHaveCount(0);
  await expect(page.locator('[data-gate-state="locked"]')).toHaveCount(0);

  // Check first note detail if available
  const firstNoteLink = page.locator("[data-note-item] a").first();
  const linkCount = await page.locator("[data-note-item] a").count();
  if (linkCount > 0) {
    const href = await firstNoteLink.getAttribute("href");
    if (href) {
      await page.goto(href);
      await expect(page.locator("[data-protected-gate]")).toHaveCount(0);
      await expect(
        page.locator('[data-gate-state="locked"]')
      ).toHaveCount(0);
    }
  }
});
