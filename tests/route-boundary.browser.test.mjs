import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import puppeteer from "puppeteer";
import {
  protectedRoutes,
  publicRoutes,
  startBuiltSiteServer,
  toAbsoluteUrl,
} from "./helpers/site-boundary-fixtures.mjs";

let browser;
let server;

const launchArgs = ["--no-sandbox", "--disable-setuid-sandbox"];

before(async () => {
  server = await startBuiltSiteServer();
  browser = await puppeteer.launch({
    headless: true,
    args: launchArgs,
  });
});

after(async () => {
  await Promise.allSettled([
    browser?.close(),
    server?.close(),
  ]);
});

const visitRoute = async (route) => {
  const context = await browser.createBrowserContext();
  const page = await context.newPage();

  try {
    await page.goto(toAbsoluteUrl(server.baseUrl, route.route), {
      waitUntil: "networkidle0",
    });

    return await page.evaluate(() => ({
      gateVisible: Boolean(document.querySelector("[data-protected-gate]")),
      lockedGateState: document.querySelector("[data-gate-state]")?.getAttribute("data-gate-state") ?? null,
      routeVisibility: document.querySelector("[data-route-visibility]")?.getAttribute("data-route-visibility") ?? null,
      protectedProofState:
        document.querySelector("[data-protected-proof-state]")?.getAttribute("data-protected-proof-state") ?? null,
      proofNodeCount: document.querySelectorAll(
        "[data-flagship-highlights], [data-supporting-work], [data-flagship], [data-supporting-item]",
      ).length,
      bodyText: document.body.textContent ?? "",
      smokeSelectors: {
        home: Boolean(document.querySelector("[data-home-page]")),
        about: Boolean(document.querySelector("[data-personal-page]")),
        resume: Boolean(document.querySelector("[data-resume-page]")),
      },
    }));
  } finally {
    await page.close();
    await context.close();
  }
};

for (const route of publicRoutes) {
  test(`${route.route} stays ungated in a real browser cold load`, async () => {
    const snapshot = await visitRoute(route);

    if (route.route === "/") {
      assert.equal(snapshot.smokeSelectors.home, true, `Expected ${route.route} to render its public home shell`);
    }

    if (route.route === "/about/") {
      assert.equal(snapshot.smokeSelectors.about, true, `Expected ${route.route} to render its public about shell`);
    }

    if (route.route === "/resume/") {
      assert.equal(snapshot.smokeSelectors.resume, true, `Expected ${route.route} to render its public resume shell`);
    }

    assert.equal(snapshot.gateVisible, false, `Public route ${route.route} should not show the protected gate shell`);
    assert.notEqual(snapshot.lockedGateState, "locked", `Public route ${route.route} should not expose a locked gate state`);
    assert.notEqual(snapshot.routeVisibility, "protected", `Public route ${route.route} should not identify itself as protected`);
  });
}

for (const route of protectedRoutes) {
  test(`${route.route} cold browser load shows the locked shell markers`, async () => {
    const snapshot = await visitRoute(route);

    assert.equal(snapshot.gateVisible, true, `Protected route ${route.route} should show [data-protected-gate] on cold load`);
    assert.equal(
      snapshot.routeVisibility,
      "protected",
      `Protected route ${route.route} should expose data-route-visibility=\"protected\" on cold load`,
    );
    assert.equal(
      snapshot.lockedGateState,
      "locked",
      `Protected route ${route.route} should expose data-gate-state=\"locked\" on cold load`,
    );
    assert.equal(
      snapshot.protectedProofState,
      "withheld",
      `Protected route ${route.route} should expose data-protected-proof-state=\"withheld\" on cold load`,
    );
  });

  test(`${route.route} cold browser load withholds flagship and supporting proof`, async () => {
    const snapshot = await visitRoute(route);

    assert.equal(
      snapshot.proofNodeCount,
      0,
      `Protected route ${route.route} should not render flagship/supporting proof nodes before unlock; found ${snapshot.proofNodeCount}`,
    );
    assert.doesNotMatch(
      snapshot.bodyText,
      /flagship highlights|supporting work/i,
      `Protected route ${route.route} should not show flagship/supporting proof copy before unlock`,
    );
  });
}
