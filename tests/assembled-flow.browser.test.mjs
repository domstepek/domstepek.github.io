import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import puppeteer from "puppeteer";
import {
  protectedBoundarySelectors,
  protectedRoutes,
  startBuiltSiteServer,
  toAbsoluteUrl,
  unlockTestInputs,
  visualStateSelectors,
} from "./helpers/site-boundary-fixtures.mjs";

let browser;
let server;

const launchArgs = ["--no-sandbox", "--disable-setuid-sandbox"];
const primaryRoute = protectedRoutes[0];
const secondaryRoute = protectedRoutes[1];

before(async () => {
  server = await startBuiltSiteServer();
  browser = await puppeteer.launch({
    headless: true,
    args: launchArgs,
  });
});

after(async () => {
  await Promise.allSettled([browser?.close(), server?.close()]);
});

test("Assembled flow: cold-lock → wrong passcode → correct unlock → visual reveal → cross-route carryover", async () => {
  const context = await browser.createBrowserContext();

  try {
    // --- Phase 1: Cold-load a protected route → assert locked state ---
    const page = await context.newPage();
    await page.goto(toAbsoluteUrl(server.baseUrl, primaryRoute.route), {
      waitUntil: "networkidle0",
    });

    await page.waitForSelector(protectedBoundarySelectors.lockedGateState, { timeout: 5000 });
    await page.waitForSelector(protectedBoundarySelectors.protectedProofWithheld, { timeout: 5000 });

    // Confirm no visual-state marker on cold load
    const coldVisualState = await page.$(visualStateSelectors.visualStateAttr);
    assert.equal(
      coldVisualState,
      null,
      `${primaryRoute.route} should have no data-visual-state on cold load`,
    );

    // --- Phase 2: Submit wrong passcode → assert error state ---
    await page.locator(protectedBoundarySelectors.gatePasscodeInput).fill(unlockTestInputs.invalidPasscode);
    await page.locator(protectedBoundarySelectors.gateSubmitButton).click();
    await page.waitForNetworkIdle();

    await page.waitForSelector(protectedBoundarySelectors.gateError, { timeout: 5000 });

    const gateStateAfterWrong = await page.$eval("[data-gate-state]", (el) =>
      el.getAttribute("data-gate-state"),
    );
    assert.equal(
      gateStateAfterWrong,
      "locked",
      `${primaryRoute.route} should stay locked after wrong passcode`,
    );

    // --- Phase 3: Submit correct passcode → assert unlock ---
    await page.locator(protectedBoundarySelectors.gatePasscodeInput).fill(unlockTestInputs.validPasscode);
    await page.locator(protectedBoundarySelectors.gateSubmitButton).click();
    await page.waitForNetworkIdle();

    await page.waitForSelector(protectedBoundarySelectors.gateUnlocked, { timeout: 5000 });

    const proofState = await page.$eval("[data-protected-proof-state]", (el) =>
      el.getAttribute("data-protected-proof-state"),
    );
    assert.equal(
      proofState,
      "mounted",
      `${primaryRoute.route} should have data-protected-proof-state="mounted" after correct passcode`,
    );

    // --- Phase 4: Wait for visual reveal ---
    await page.waitForSelector(visualStateSelectors.visualStateRevealed, { timeout: 10000 });

    const visualState = await page.$eval("[data-visual-state]", (el) =>
      el.getAttribute("data-visual-state"),
    );
    assert.equal(
      visualState,
      "revealed",
      `${primaryRoute.route} should reach data-visual-state="revealed" after unlock`,
    );

    // --- Phase 5: Navigate to second protected route → assert cross-route carryover ---
    await page.goto(toAbsoluteUrl(server.baseUrl, secondaryRoute.route), {
      waitUntil: "networkidle0",
    });

    await page.waitForSelector(protectedBoundarySelectors.gateUnlocked, { timeout: 5000 });

    const secondGateState = await page.$eval("[data-gate-state]", (el) =>
      el.getAttribute("data-gate-state"),
    );
    assert.equal(
      secondGateState,
      "open",
      `${secondaryRoute.route} should auto-unlock via cross-route carryover`,
    );

    await page.waitForSelector(visualStateSelectors.visualStateRevealed, { timeout: 10000 });

    const secondVisualState = await page.$eval("[data-visual-state]", (el) =>
      el.getAttribute("data-visual-state"),
    );
    assert.equal(
      secondVisualState,
      "revealed",
      `${secondaryRoute.route} should reach data-visual-state="revealed" via cross-route carryover`,
    );

    await page.close();
  } finally {
    await context.close();
  }
});
