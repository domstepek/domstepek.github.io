import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import puppeteer from "puppeteer";
import {
  gateCopyExpectations,
  protectedBoundarySelectors,
  protectedProofSelectors,
  protectedRouteCarryoverCases,
  requestAccessLinks,
  sessionUnlockStorageKey,
  startBuiltSiteServer,
  toAbsoluteUrl,
  unlockTestInputs,
} from "./helpers/site-boundary-fixtures.mjs";

let browser;
let server;

const launchArgs = ["--no-sandbox", "--disable-setuid-sandbox"];
const [{ route: primaryRoute, nextRoute: secondaryRoute }] = protectedRouteCarryoverCases;

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

const snapshotGate = async (page) =>
  page.evaluate(
    ({ selectors, storageKey }) => ({
      routeVisibility: document.querySelector("[data-route-visibility]")?.getAttribute("data-route-visibility") ?? null,
      gateState: document.querySelector("[data-gate-state]")?.getAttribute("data-gate-state") ?? null,
      protectedProofState:
        document.querySelector("[data-protected-proof-state]")?.getAttribute("data-protected-proof-state") ?? null,
      hasProtectedGate: Boolean(document.querySelector(selectors.protectedGate)),
      hasRequestAccessPanel: Boolean(document.querySelector(selectors.requestAccessPanel)),
      hasGateForm: Boolean(document.querySelector(selectors.gateForm)),
      hasPasscodeInput: Boolean(document.querySelector(selectors.gatePasscodeInput)),
      hasSubmitButton: Boolean(document.querySelector(selectors.gateSubmitButton)),
      hasGateStatus: Boolean(document.querySelector(selectors.gateStatus)),
      hasGateError: Boolean(document.querySelector(selectors.gateError)),
      emailHref: document.querySelector(selectors.requestAccessEmailLink)?.getAttribute("href") ?? null,
      linkedInHref: document.querySelector(selectors.requestAccessLinkedInLink)?.getAttribute("href") ?? null,
      proofNodeCount: document.querySelectorAll(selectors.proofSelectors).length,
      bodyText: document.body.textContent ?? "",
      sessionUnlockValue: sessionStorage.getItem(storageKey),
      passcodeInputType: document.querySelector(selectors.gatePasscodeInput)?.getAttribute("type") ?? null,
    }),
    {
      selectors: {
        ...protectedBoundarySelectors,
        proofSelectors: protectedProofSelectors.join(", "),
      },
      storageKey: sessionUnlockStorageKey,
    },
  );

const openProtectedRoute = async (context, route) => {
  const page = await context.newPage();
  await page.goto(toAbsoluteUrl(server.baseUrl, route.route), {
    waitUntil: "networkidle0",
  });
  return page;
};

const expectColdLockedRoute = (route, snapshot) => {
  assert.equal(snapshot.routeVisibility, "protected", `Protected route ${route.route} should identify as protected`);
  assert.equal(snapshot.gateState, "locked", `Protected route ${route.route} should cold-load in the locked state`);
  assert.equal(snapshot.protectedProofState, "withheld", `Protected route ${route.route} should keep proof withheld on cold load`);
  assert.equal(snapshot.hasProtectedGate, true, `Protected route ${route.route} should render the protected gate shell`);
  assert.equal(snapshot.hasRequestAccessPanel, true, `Protected route ${route.route} should render a request-access panel`);
  assert.equal(snapshot.emailHref, requestAccessLinks.email.href, `Protected route ${route.route} should expose the canonical email request link`);
  assert.equal(snapshot.linkedInHref, requestAccessLinks.linkedin.href, `Protected route ${route.route} should expose the canonical LinkedIn request link`);
  assert.equal(snapshot.hasGateForm, true, `Protected route ${route.route} should expose a gate form on cold load`);
  assert.equal(snapshot.hasPasscodeInput, true, `Protected route ${route.route} should expose a passcode input on cold load`);
  assert.equal(snapshot.passcodeInputType, "password", `Protected route ${route.route} should mask the passcode input`);
  assert.equal(snapshot.hasSubmitButton, true, `Protected route ${route.route} should expose a gate submit button`);
  assert.equal(snapshot.hasGateStatus, true, `Protected route ${route.route} should expose a stable gate status surface`);

  for (const [copyName, pattern] of Object.entries(gateCopyExpectations)) {
    assert.match(snapshot.bodyText, pattern, `Protected route ${route.route} should show ${copyName} copy on cold load`);
  }
};

const assertUnlockFormPresent = (route, snapshot) => {
  assert.equal(snapshot.hasGateForm, true, `Protected route ${route.route} should expose [data-gate-form] before unlock attempts`);
  assert.equal(
    snapshot.hasPasscodeInput,
    true,
    `Protected route ${route.route} should expose [data-gate-passcode-input] before unlock attempts`,
  );
  assert.equal(
    snapshot.hasSubmitButton,
    true,
    `Protected route ${route.route} should expose [data-gate-submit] before unlock attempts`,
  );
};

test(`${primaryRoute.route} cold browser load keeps proof locked while showing request-access links`, async () => {
  const context = await browser.createBrowserContext();

  try {
    const page = await openProtectedRoute(context, primaryRoute);
    const snapshot = await snapshotGate(page);

    expectColdLockedRoute(primaryRoute, snapshot);
    assert.equal(snapshot.proofNodeCount, 0, `Protected route ${primaryRoute.route} should not render proof nodes before unlock`);
    await page.close();
  } finally {
    await context.close();
  }
});

test(`${primaryRoute.route} wrong passcode stays locked and surfaces an explicit error state`, async () => {
  const context = await browser.createBrowserContext();

  try {
    const page = await openProtectedRoute(context, primaryRoute);
    const initialSnapshot = await snapshotGate(page);
    assertUnlockFormPresent(primaryRoute, initialSnapshot);

    await page.locator(protectedBoundarySelectors.gatePasscodeInput).fill(unlockTestInputs.invalidPasscode);
    await page.locator(protectedBoundarySelectors.gateSubmitButton).click();
    await page.waitForNetworkIdle();

    const snapshot = await snapshotGate(page);

    assert.equal(snapshot.gateState, "locked", `Protected route ${primaryRoute.route} should stay locked after an invalid passcode`);
    assert.equal(snapshot.hasGateError, true, `Protected route ${primaryRoute.route} should expose [data-gate-status="error"] after an invalid passcode`);
    assert.equal(snapshot.proofNodeCount, 0, `Protected route ${primaryRoute.route} should continue withholding proof after an invalid passcode`);
    await page.close();
  } finally {
    await context.close();
  }
});

test(`${primaryRoute.route} correct passcode unlocks the current route`, async () => {
  const context = await browser.createBrowserContext();

  try {
    const page = await openProtectedRoute(context, primaryRoute);
    const initialSnapshot = await snapshotGate(page);
    assertUnlockFormPresent(primaryRoute, initialSnapshot);

    await page.locator(protectedBoundarySelectors.gatePasscodeInput).fill(unlockTestInputs.validPasscode);
    await page.locator(protectedBoundarySelectors.gateSubmitButton).click();
    await page.waitForNetworkIdle();

    const snapshot = await snapshotGate(page);

    assert.equal(snapshot.gateState, "open", `Protected route ${primaryRoute.route} should flip to the open gate state after a valid passcode`);
    assert.notEqual(snapshot.proofNodeCount, 0, `Protected route ${primaryRoute.route} should render protected proof after a valid passcode`);
    assert.ok(snapshot.sessionUnlockValue, `Protected route ${primaryRoute.route} should persist a session unlock marker after a valid passcode`);
    await page.close();
  } finally {
    await context.close();
  }
});

test(`${primaryRoute.route} unlock carries to ${secondaryRoute.route} in the same browser context but not a fresh one`, async () => {
  const warmContext = await browser.createBrowserContext();
  const coldContext = await browser.createBrowserContext();

  try {
    const unlockedPage = await openProtectedRoute(warmContext, primaryRoute);
    const initialSnapshot = await snapshotGate(unlockedPage);
    assertUnlockFormPresent(primaryRoute, initialSnapshot);

    await unlockedPage.locator(protectedBoundarySelectors.gatePasscodeInput).fill(unlockTestInputs.validPasscode);
    await unlockedPage.locator(protectedBoundarySelectors.gateSubmitButton).click();
    await unlockedPage.waitForNetworkIdle();
    await unlockedPage.close();

    const warmCarryoverPage = await openProtectedRoute(warmContext, secondaryRoute);
    const warmSnapshot = await snapshotGate(warmCarryoverPage);
    assert.equal(
      warmSnapshot.gateState,
      "open",
      `Protected route ${secondaryRoute.route} should stay unlocked after unlocking ${primaryRoute.route} in the same browser context`,
    );
    assert.notEqual(
      warmSnapshot.proofNodeCount,
      0,
      `Protected route ${secondaryRoute.route} should render proof when the session is already unlocked`,
    );
    assert.ok(
      warmSnapshot.sessionUnlockValue,
      `Protected route ${secondaryRoute.route} should reuse the ${sessionUnlockStorageKey} session unlock marker in the same browser context`,
    );
    await warmCarryoverPage.close();

    const coldPage = await openProtectedRoute(coldContext, secondaryRoute);
    const coldSnapshot = await snapshotGate(coldPage);
    assert.equal(coldSnapshot.gateState, "locked", `Protected route ${secondaryRoute.route} should relock in a fresh browser context`);
    assert.equal(coldSnapshot.proofNodeCount, 0, `Protected route ${secondaryRoute.route} should withhold proof in a fresh browser context`);
    assert.equal(
      coldSnapshot.sessionUnlockValue,
      null,
      `Protected route ${secondaryRoute.route} should not inherit ${sessionUnlockStorageKey} in a fresh browser context`,
    );
    await coldPage.close();
  } finally {
    await Promise.allSettled([warmContext.close(), coldContext.close()]);
  }
});
