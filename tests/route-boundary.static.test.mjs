import test from "node:test";
import {
  assertNoBoundaryIssues,
  getProtectedBoundaryMarkerIssues,
  getProtectedProofLeakIssues,
  getProtectedRequestAccessIssues,
  getPublicRouteBoundaryIssues,
  protectedRoutes,
  publicRoutes,
  readBuiltHtml,
} from "./helpers/site-boundary-fixtures.mjs";

for (const route of publicRoutes) {
  test(`${route.route} stays public in built HTML`, async () => {
    const html = await readBuiltHtml(route);
    assertNoBoundaryIssues(getPublicRouteBoundaryIssues(route, html));
  });
}

for (const route of protectedRoutes) {
  test(`${route.route} cold HTML exposes protected boundary markers`, async () => {
    const html = await readBuiltHtml(route);
    assertNoBoundaryIssues(getProtectedBoundaryMarkerIssues(route, html));
  });

  test(`${route.route} cold HTML exposes request-access messaging and gate form markers`, async () => {
    const html = await readBuiltHtml(route);
    assertNoBoundaryIssues(getProtectedRequestAccessIssues(route, html));
  });

  test(`${route.route} cold HTML withholds protected proof`, async () => {
    const html = await readBuiltHtml(route);
    assertNoBoundaryIssues(getProtectedProofLeakIssues(route, html));
  });
}
