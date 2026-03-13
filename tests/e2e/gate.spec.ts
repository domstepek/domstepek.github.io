/**
 * Gate acceptance tests — S01 slice verification
 *
 * Tests are written against the gate contract defined in M002/D015.
 * All selectors use explicit data-* attributes. These tests are expected
 * to FAIL until T03/T04 implement the gate routes and server actions.
 *
 * Five test cases:
 *   1. Gate markers on cold load (locked state DOM attributes present)
 *   2. Zero HTML leakage (proof selectors absent from raw response body)
 *   3. Wrong passcode shows error
 *   4. Correct passcode authenticates and reveals proof
 *   5. Cross-route session persists without re-auth
 */

import { expect, test } from "@playwright/test";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Assert that GATE_TEST_PASSCODE is available in the test process.
 * If missing, fail with a descriptive error rather than a confusing
 * "value is undefined" assertion failure.
 */
function requireTestPasscode(): string {
  const passcode = process.env.GATE_TEST_PASSCODE;
  if (!passcode) {
    throw new Error(
      "GATE_TEST_PASSCODE is not set. " +
        "Ensure .env.local contains GATE_TEST_PASSCODE and playwright.config.ts loads it."
    );
  }
  return passcode;
}

// ---------------------------------------------------------------------------
// Test 1 — Gate markers present on cold load (unauthenticated)
// ---------------------------------------------------------------------------

test("gate: cold load shows locked gate with correct DOM markers", async ({
  page,
}) => {
  await page.goto("/domains/product/");

  // Gate container is rendered
  await expect(page.locator("[data-protected-gate]")).toBeVisible();

  // Gate state is explicitly "locked"
  await expect(page.locator("[data-gate-state='locked']")).toBeVisible();

  // Proof section withheld — not rendered to client
  await expect(
    page.locator("[data-protected-proof-state='withheld']")
  ).toBeVisible();

  // Route is marked as protected
  await expect(
    page.locator("[data-route-visibility='protected']")
  ).toBeVisible();
});

// ---------------------------------------------------------------------------
// Test 2 — Zero HTML leakage on unauthenticated request
// ---------------------------------------------------------------------------

test("gate: unauthenticated response body contains no proof selectors", async ({
  request,
}) => {
  const response = await request.get("/domains/product/");
  const body = await response.text();

  // These data attributes identify proof content — must not appear in HTML
  expect(body).not.toContain("data-flagship-highlights");
  expect(body).not.toContain("data-supporting-work");
  expect(body).not.toContain("data-flagship");
  expect(body).not.toContain("data-supporting-item");
});

// ---------------------------------------------------------------------------
// Test 3 — Wrong passcode shows error, does not unlock
// ---------------------------------------------------------------------------

test("gate: wrong passcode shows error without unlocking", async ({ page }) => {
  await page.goto("/domains/product/");

  // Fill and submit the wrong passcode
  await page.fill("[data-passcode-input]", "wrongpasscode");
  await page.click("[data-passcode-submit]");

  // Error message must be visible
  await expect(page.locator("[data-gate-error]")).toBeVisible();

  // Gate must still be locked
  await expect(page.locator("[data-gate-state='locked']")).toBeVisible();
});

// ---------------------------------------------------------------------------
// Test 4 — Correct passcode authenticates and reveals proof
// ---------------------------------------------------------------------------

test("gate: correct passcode unlocks gate and reveals proof content", async ({
  page,
}) => {
  const passcode = requireTestPasscode();

  await page.goto("/domains/product/");

  // Submit the correct passcode
  await page.fill("[data-passcode-input]", passcode);
  await page.click("[data-passcode-submit]");

  // Expect redirect back to the same domain route after auth
  await page.waitForURL("/domains/product/");

  // Proof section must now be revealed
  await expect(
    page.locator("[data-protected-proof-state='revealed']")
  ).toBeVisible();

  // Flagship highlights section visible — proof content rendered
  await expect(page.locator("[data-flagship-highlights]")).toBeVisible();
});

// ---------------------------------------------------------------------------
// Test 5 — Cross-route session: auth persists across domain routes
// ---------------------------------------------------------------------------

test("gate: session cookie persists across domain routes without re-auth", async ({
  page,
}) => {
  const passcode = requireTestPasscode();

  // Authenticate on the product domain
  await page.goto("/domains/product/");
  await page.fill("[data-passcode-input]", passcode);
  await page.click("[data-passcode-submit]");
  await page.waitForURL("/domains/product/");
  await expect(
    page.locator("[data-protected-proof-state='revealed']")
  ).toBeVisible();

  // Navigate to a different domain route — must not require re-auth
  await page.goto("/domains/analytics-ai/");

  // Proof must be revealed without submitting a passcode again
  await expect(
    page.locator("[data-protected-proof-state='revealed']")
  ).toBeVisible();

  // Confirm proof content is visible on the second route
  await expect(page.locator("[data-flagship-highlights]")).toBeVisible();
});
