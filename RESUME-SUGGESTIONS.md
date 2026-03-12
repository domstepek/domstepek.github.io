# Resume Improvement Suggestions

> Comparing the current PDF resume against software engineering best practices (2025-2026) and the portfolio website's richer project content.

---

## 1. Structural Issues

### 1a. Add a professional headline
**Current:** Name + contact info only.
**Suggested:** Add a one-line positioning statement below your name:

> Full-Stack & Platform Engineer | Analytics, Infrastructure, Internal Tooling

This anchors the recruiter's mental model in the first second. The portfolio site already has this framing ("i work across analytics, infrastructure, ai / ml, product, and developer experience") — distill it to ~10 words for the resume.

### 1b. Reorder sections
**Current order:** Technical Skills → Professional Experience → Internships → Education
**Suggested order:** Contact + Headline → Technical Skills → Professional Experience → Projects (new) → Education

- **Drop the "Internships" header.** Fold Sacramento County into Professional Experience if you keep it, or cut it entirely (see Section 4). At 4+ years of full-time experience, internship headers signal junior positioning.
- **Add a Projects section** with 1-2 portfolio flagships that have live demos/repos (MCP Demo is the strongest candidate — it has a live link).
- **Minimize Education.** One line each, no elaboration needed.

### 1c. Add your portfolio URL
**Current:** GitHub and LinkedIn only.
**Suggested contact line:**

> (916) 342-9303 | domstepek@gmail.com | domstepek.dev | github.com/domstepek | linkedin.com/in/jean-dominique-stepek

Your portfolio site is the depth layer for everything the resume summarizes. It should be the first link a recruiter sees.

---

## 2. Technical Skills Section

### 2a. Recategorize and modernize
**Current categories:** Front End / Back End / Misc.
**Problems:**
- "Misc." is a throwaway label for what includes AWS (your most important platform skill) and Docker
- Missing infrastructure/platform skills that the portfolio demonstrates extensively (CDK, EKS, Kubernetes, Helm, ArgoCD, Karpenter)
- Missing AI/ML tooling (LangChain, LangGraph, MCP SDK, Bedrock)
- Lists Webpack (less relevant now) but not tools you actively use
- "Agile/Scrum/Squads" and "Jira, Notion, Figma" are resume filler — every engineer uses project tools

**Suggested restructure:**

```
Languages:        TypeScript, Python, SQL, GraphQL
Frontend:         React, Next.js, Vite, Redux, Mantine, D3/visx, Tailwind CSS
Backend:          Node.js, Express, Apollo GraphQL, FastAPI, Prisma
Data:             PostgreSQL, Snowflake, Redis, BullMQ, DynamoDB
Infrastructure:   AWS (CDK, EKS, Bedrock, Cognito, Amplify), Kubernetes, Helm, ArgoCD, Docker
AI / ML:          LangChain, LangGraph, MCP SDK, AWS Bedrock, RAG pipelines
Testing:          Jest, WebdriverIO, Cucumber
```

**Key changes:**
- Infrastructure skills promoted from invisible to prominent — this is a major gap given the CDK-EKS and Stargazer work
- AI/ML gets its own category — this is a differentiator in 2025-2026
- Cut: Agile/Scrum/Squads, Jira, Notion, Figma, Webpack, SASS (still valid but lower priority), Serverless Framework
- Added: Everything from the portfolio that's missing (Prisma, Mantine, BullMQ, Helm, ArgoCD, Karpenter, LangChain, LangGraph, MCP SDK)

### 2b. DGraph — keep or cut?
DGraph appears only in the Charla.cc role. If you wouldn't want to discuss it in an interview or use it again, cut it to save space.

---

## 3. Experience Bullets — The Biggest Opportunity

### 3a. Problem: duties over outcomes
Most bullets describe *what you built* but not *what it achieved*. The portfolio site actually has stronger outcome language than the resume in several places.

### 3b. Tapestry — Collection Curator bullets

**Current bullet 1:**
> "Developed core fullstack features for an analytics platform with React, TypeScript, Vite, and GraphQL, collaborating closely with product and design teams."

**Problem:** Generic duty statement. "Developed core features" and "collaborating closely" say nothing specific.

**Suggested:**
> "Shaped the reporting workflow for an operator-facing analytics portal — filters, drill-downs, and follow-up actions in one surface — replacing scattered tools and ad hoc data pulls."

*(Pulls from portfolio's web portal flagship, which is the same product.)*

---

**Current bullet 2 (Analyzer module):**
> "Built a customizable table interface—similar in nature to Notion's data tables—allowing users to curate seasonal collections..."

**Problem:** Decent specificity but no outcome. "Similar in nature to Notion's data tables" is an odd comparison that undersells the work.

**Suggested:**
> "Built a configurable table interface for seasonal collection curation with custom column types (multiselects, dates, tags), enabling analysts to filter and organize product data without ad hoc spreadsheet work."

---

**Current bullet 3 (Visualizer module):**
> "Led frontend development of a PowerPoint-style presentation tool with React and Styled Components, including drag-and-drop, keyboard navigation, and export-to-PDF features."

**This bullet is solid.** "Led" is a strong verb, the features are specific. Consider adding a one-line outcome: "...used by [N] teams for [purpose]" if you can quantify it.

---

**Current bullet 4 (GenAI chatbot):**
> "Created an internal GenAI chatbot for answering platform-related user queries—cutting support tickets by 50%."

**This is your strongest bullet** because it has a metric. Keep it. Consider specifying the tech: "...using AWS Bedrock and RAG retrieval, cutting support tickets by 50%."

---

**Current bullet 5 (MCP server):**
> "Created an MCP server for our analytics platform with an agent for executing tools on the MCP server to increase user productivity."

**Problem:** Vague outcome ("increase user productivity"). The portfolio's MCP demo description is much stronger.

**Suggested:**
> "Built an MCP server and agent layer for the analytics platform, giving stakeholders a working example of model-driven tool use that made the tradeoffs between user-driven and agent-driven actions concrete."

---

**Current bullet 6 (WebGPU landing page):**
> "Built a high-performance landing page featuring a WebGPU-driven mesh gradient animation for a visually compelling user experience."

**Problem:** This is the weakest bullet. A landing page animation doesn't demonstrate the systems/platform/product depth that defines your portfolio. Consider cutting it entirely and replacing with infrastructure or platform work that's currently missing from the resume.

**Suggested replacement — pull from CDK-EKS/Stargazer work:**
> "Stood up the shared EKS platform foundation with AWS CDK — networking, cluster primitives, ArgoCD, and environment-specific config — so service deployments became repeatable GitOps operations instead of manual buildouts."

This is a *massive* gap: the resume has zero infrastructure content despite it being an entire domain in your portfolio.

### 3c. Tapestry — Supply Chain bullets

**Current bullet 1:**
> "Spearheaded full-stack development of a predictive analytics platform, reducing inventory waste by $30M/year."

**This is excellent.** $30M/year is a strong, specific metric. Keep as-is.

**Current bullet 2:**
> "Implemented a large, customizable data table with three column groups..."

**Problem:** Too implementation-focused. The three column groups detail is resume noise.

**Suggested:**
> "Designed the forecasting interface around fiscal season targets and receipt predictions, enabling inventory planners to adjust forecasts without falling back to spreadsheet workflows."

**Current bullet 3:**
> "Built with React, TypeScript, GraphQL, Express (REST API), and Snowflake, enabling efficient forecasting workflows."

**Problem:** This is a tech list disguised as a bullet. Fold the tech into bullet 1 or 2 and cut this line.

### 3d. Charla.cc bullets

**Current state:** Four bullets, several are redundant.

**Problems:**
- Bullets 2 and 3 describe the same thing (data pipelines from social media to DGraph) with different wording
- "Set up CI/CD pipelines" is generic

**Suggested — consolidate to 2-3 bullets:**
> "Co-founded and built a social analytics platform tracking community engagement patterns across social media APIs, with unified customer profiles and proprietary metrics."
>
> "Built data ingestion pipelines from social media APIs to DGraph using Go and AWS Lambda, processing community data into actionable analytics."
>
> "Owned infrastructure and deployment: Dockerized services, configured CI/CD with AWS CodePipeline, managed EC2 and Lambda compute."

### 3e. Internships — cut or compress

**Sacramento County (6 months):** The "microservices migration" bullet is decent but Angular/.NET is off-stack for your current direction. If you need to fill space, keep it as one line. Otherwise cut it.

**Design Hub (5 months):** Raspberry Pi and RFID inventory management is interesting but very early-career. Cut it to save space for stronger content.

---

## 4. Major Content Gaps (Resume vs. Portfolio)

These are things the portfolio proves that the resume doesn't mention at all:

| Portfolio Domain | Resume Coverage | Gap |
|---|---|---|
| **Infrastructure** (CDK-EKS, Stargazer, SSO proxy, CDN) | Zero mention | Critical — add at least one infrastructure bullet |
| **Developer Experience** (design system, QA BDD, CLI, migration scripts) | Zero mention | Significant — the design system across 4 apps is strong resume material |
| **Platform/DevOps** (Kubernetes, Helm, ArgoCD, GitOps) | Zero mention | Critical — these are high-demand skills completely absent from resume |
| **AI/ML depth** (LangChain, LangGraph, MCP SDK, Bedrock, RAG) | Partial (chatbot + MCP bullets exist but lack tech specificity) | Moderate — add tech names to existing bullets |
| **Apache Superset** deployment on shared platform | Zero mention | Minor but worth a supporting bullet |
| **Testing/QA automation** (WebdriverIO, Cucumber, BDD) | Zero mention | Moderate — shows engineering maturity |

**The infrastructure gap is the most damaging.** Your portfolio has two detailed infrastructure flagships (CDK-EKS and Stargazer Applications) plus supporting work (CDN, SSO proxy). The resume reads as purely application-level, which contradicts the "platform engineer" positioning the portfolio conveys.

---

## 5. Quantification Gaps

The resume has one strong metric ($30M/year waste reduction) and one good one (50% ticket reduction). Everything else lacks numbers.

**Opportunities to quantify (estimate if exact numbers unavailable):**

- Web Portal: "used daily by ~N operators" or "replaced N separate tools"
- Design System: "shared across 4 product surfaces" (the portfolio already says this)
- CDK-EKS: "supporting N services across dev/qa/prod environments"
- Stargazer GitOps: "reduced deploy setup from N hours to N minutes" or "standardized deployment for N services"
- QA BDD: "automated regression coverage for N high-risk user flows"
- Charla.cc: any user/data scale numbers

Even directional metrics help: "reduced by half," "across 4 apps," "supporting 3 environments."

---

## 6. Formatting and ATS Optimization

- **Single column layout** — if the current PDF uses multi-column, switch to single. ATS systems parse top-to-bottom.
- **Standard section headers** — "Technical Skills," "Experience," "Education," "Projects." Don't get creative with header names.
- **Export as PDF from Google Docs or Word**, not from a design tool. Ensures text is selectable/parseable.
- **No icons, graphics, or skill bars.** ATS can't read them.
- **Consistent date formatting** — use "Jun 2022 – Present" style throughout.

---

## 7. Suggested Final Structure (One Page)

```
JEAN-DOMINIQUE STEPEK
(916) 342-9303 | domstepek@gmail.com | domstepek.dev
github.com/domstepek | linkedin.com/in/jean-dominique-stepek

Full-Stack & Platform Engineer | Analytics, Infrastructure, Internal Tooling

SKILLS
Languages:        TypeScript, Python, SQL, GraphQL
Frontend:         React, Next.js, Vite, Redux, Mantine, D3/visx
Backend:          Node.js, Express, Apollo GraphQL, FastAPI, Prisma
Data:             PostgreSQL, Snowflake, Redis, BullMQ
Infrastructure:   AWS (CDK, EKS, Bedrock, Cognito), Kubernetes, Helm, ArgoCD, Docker
AI / ML:          LangChain, LangGraph, MCP SDK, AWS Bedrock

EXPERIENCE

Tapestry — Software Development Engineer (Full Stack)        Jun 2022 – Present
- [3-4 bullets covering: portal/analytics, supply chain $30M metric,
  infrastructure/platform work, AI/ML chatbot+MCP]

Charla.cc — Co-Founder & Software Engineer                   Jul 2021 – May 2022
- [2-3 bullets: platform summary, data pipelines, infrastructure ownership]

PROJECTS
MCP Demo — live demo + repo
- [1 bullet: what it proves about agent-style interaction]

Global Design System — repo
- [1 bullet: shared UI baseline across 4 product surfaces]

EDUCATION
Hack Reactor — Advanced Software Engineering Immersive        2021
American River College — A.S. Computer Science                2020
```

---

## 8. Priority Actions (Ranked)

1. **Add infrastructure/platform bullets to Tapestry role** — biggest gap, highest impact
2. **Restructure skills section** with proper categories including Infra and AI/ML
3. **Rewrite weak bullets** using outcome-driven XYZ format with metrics
4. **Add portfolio URL** to contact line
5. **Cut the WebGPU landing page bullet** — replace with stronger content
6. **Consolidate Charla.cc** from 4 bullets to 2-3
7. **Cut or compress internships** to make room
8. **Add a Projects section** with MCP Demo (has live link) and one other flagship
9. **Add professional headline** below name

---

## Sources Consulted

- Tech Interview Handbook (techinterviewhandbook.org/resume)
- Stack Overflow Blog — hiring manager perspectives
- Pragmatic Engineer (blog.pragmaticengineer.com) — open source and modern hiring
- Resume Worded — bullet optimization patterns
- Novoresume — formatting and ATS guidance
