export type HomeContactKey = "github" | "linkedin" | "email";

export interface HomeContactLink {
  key: HomeContactKey;
  label: string;
  href: string;
}

export interface HomePageData {
  eyebrow: string;
  title: string;
  lead: string;
  domainIntro: string;
  contactHeading: string;
  contactLinks: HomeContactLink[];
  freshness: {
    label: string;
    value: string;
    note: string;
  };
  seo: {
    title: string;
    description: string;
  };
}

export const homePage = {
  eyebrow: "dom stepek",
  title:
    "i build analytics platforms, infrastructure, ai / ml tooling, product systems, and developer experience rails.",
  lead:
    "most of the work lives where analytics, platform, product, ai / ml, and developer tooling overlap, so this site is organized by the kind of problem being solved instead of by a flat project list.",
  domainIntro:
    "start with the domain that matches the problem you care about. each page goes deeper without turning the homepage into a generic gallery.",
  contactHeading: "contact",
  contactLinks: [
    {
      key: "github",
      label: "github",
      href: "https://github.com/domstepek",
    },
    {
      key: "linkedin",
      label: "linkedin",
      href: "https://linkedin.com/in/jean-dominique-stepek",
    },
    {
      key: "email",
      label: "email",
      href: "mailto:domstepek@gmail.com",
    },
  ],
  freshness: {
    label: "currently",
    value:
      "tightening this site into a clearer map of the systems, products, and tooling i keep coming back to.",
    note: "last updated march 2026.",
  },
  seo: {
    title: "systems, products, and tooling",
    description:
      "homepage for dom's work across analytics platforms, infrastructure, ai / ml tooling, product systems, and developer experience.",
  },
} satisfies HomePageData;
