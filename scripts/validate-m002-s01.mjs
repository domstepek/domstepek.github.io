import {
  getProtectedBoundaryMarkerIssues,
  getProtectedProofLeakIssues,
  getPublicRouteBoundaryIssues,
  protectedRoutes,
  publicRoutes,
  readBuiltHtml,
} from "../tests/helpers/site-boundary-fixtures.mjs";

const errors = [];

for (const route of publicRoutes) {
  const html = await readBuiltHtml(route);
  errors.push(...getPublicRouteBoundaryIssues(route, html));
}

for (const route of protectedRoutes) {
  const html = await readBuiltHtml(route);
  errors.push(...getProtectedBoundaryMarkerIssues(route, html));
  errors.push(...getProtectedProofLeakIssues(route, html));
}

if (errors.length > 0) {
  console.error("[validate:m002:s01] Route boundary contract failed:\n");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exitCode = 1;
} else {
  console.log(
    `[validate:m002:s01] Route boundary contract passed for ${publicRoutes.length} public routes and ${protectedRoutes.length} protected routes.`,
  );
}
