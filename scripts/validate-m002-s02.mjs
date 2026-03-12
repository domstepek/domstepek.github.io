import {
  getProtectedRequestAccessIssues,
  protectedBoundaryHtmlSnippets,
  protectedGateUiHtmlSnippets,
  protectedRoutes,
  readBuiltHtml,
} from "../tests/helpers/site-boundary-fixtures.mjs";

const PREFIX = "[validate:m002:s02]";
const errors = [];

for (const route of protectedRoutes) {
  const html = await readBuiltHtml(route);

  // S02 gate-message contract: request-access links and copy present
  errors.push(...getProtectedRequestAccessIssues(route, html));

  // S02 locked-shell markers still intact (locked state, protected gate, proof withheld)
  for (const [markerName, snippet] of Object.entries(protectedBoundaryHtmlSnippets)) {
    if (!html.includes(snippet)) {
      errors.push(
        `Protected route ${route.route} is missing locked-shell marker ${markerName} (${snippet}) in built HTML`,
      );
    }
  }

  // S02 gate-form UI markers present in cold-load HTML
  for (const [markerName, snippet] of Object.entries(protectedGateUiHtmlSnippets)) {
    if (!html.includes(snippet)) {
      errors.push(
        `Protected route ${route.route} is missing gate UI marker ${markerName} (${snippet}) in built HTML`,
      );
    }
  }
}

if (errors.length > 0) {
  console.error(`${PREFIX} Gate messaging and locked-shell contract failed:\n`);
  for (const error of errors) {
    console.error(`  - ${error}`);
  }
  process.exitCode = 1;
} else {
  console.log(
    `${PREFIX} Gate messaging and locked-shell contract passed for ${protectedRoutes.length} protected routes.`,
  );
}
