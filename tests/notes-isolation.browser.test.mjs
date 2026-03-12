import assert from "node:assert/strict";
import { test } from "node:test";
import {
  getNotesRoutes,
  publicGateHtmlSnippets,
  readBuiltHtml,
} from "./helpers/site-boundary-fixtures.mjs";

const notesRoutes = await getNotesRoutes();

assert.ok(
  notesRoutes.length > 0,
  "Expected at least one notes route in dist/notes/*/index.html — is the site built?",
);

for (const route of notesRoutes) {
  test(`${route.route} contains no protected gate markers`, async () => {
    const html = await readBuiltHtml(route);

    for (const snippet of publicGateHtmlSnippets) {
      assert.ok(
        !html.includes(snippet),
        `Notes route ${route.route} should not contain gate marker "${snippet}" — gate scope may have leaked into notes`,
      );
    }
  });
}
