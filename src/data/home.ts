export type HomeContactKey = "github" | "linkedin" | "email";

export interface HomeContactLink {
  key: HomeContactKey;
  label: string;
  href: string;
}

export interface HomePersonalTeaser {
  heading: string;
  body: string;
  aboutLabel: string;
  resumeLabel: string;
}

export interface HomePageData {
  eyebrow: string;
  title: string;
  lead: string;
  domainIntro: string;
  personalTeaser: HomePersonalTeaser;
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
  eyebrow: "dom stepek / systems, products, and tooling",
  title:
    "i work across analytics, infrastructure, ai / ml, product, and developer experience.",
  lead:
    "the projects here sit where data, platform, workflow, and internal tooling overlap. this homepage is a quick route into the five areas where that work shows up most often.",
  domainIntro:
    "pick the domain that matches the problem. the links below are the main route through the site, not a side gallery.",
  personalTeaser: {
    heading: "personal context",
    body:
      "if you want the shorter version of how i work, what kinds of teams i fit best, and where the compact resume lives, start here.",
    aboutLabel: "about",
    resumeLabel: "resume",
  },
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
      "refining the homepage so the five domains read like a quick map instead of a project list.",
    note: "last updated march 2026.",
  },
  seo: {
    title: "systems, products, and tooling",
    description:
      "homepage for dom's work across analytics platforms, infrastructure, ai / ml tooling, product systems, and developer experience.",
  },
} satisfies HomePageData;
