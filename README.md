# Maa Ambe Enterprises — Lectrix EV Dealership Website

A production-shaped marketing and lead-capture site for **Maa Ambe Enterprises**, an authorized **Lectrix EV** dealership. It presents the scooter lineup, answers the questions a buyer actually asks (range, on-road price, EMI, battery subscription, warranty, service), and turns interest into a lead the showroom can call back.

Two identities appear throughout and never blur: the **dealership** owns the site; **Lectrix EV** is the manufacturer of the scooters on sale. That distinction is enforced in code (`src/lib/brand.ts`) so it reads the same way in a hero, a page title, an OG card and a JSON-LD block.

---

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 16.3 (App Router, Turbopack) |
| Runtime | React 19.2, Node 20+ |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS 4 |
| Components | shadcn-style primitives on Radix UI |
| Forms | react-hook-form + Zod 4 |
| Tests | Vitest |
| Motion | Framer Motion |
| Icons | lucide-react |

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts:

```bash
npm test           # unit tests (vitest)
npm run test:watch
npm run build      # production build (validates product data, prerenders pages)
npm run start      # serve the production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
npm run preflight  # pre-deploy check: outstanding placeholders + required env
```

### Environment

Copy `.env.example` to `.env.local` for development; set the same names in the Vercel project.

| Variable | Required | Exposed to browser | Purpose |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | production | yes | Absolute origin for canonicals, OG tags, sitemap and JSON-LD. Read at **build time**. Falls back to `http://localhost:3000`, which is valid in dev and **wrong in production**: unset, the build bakes in localhost canonicals and a `robots.txt` that disallows every crawler. |
| `LEADS_WEBHOOK_URL` | production | no | Where a submitted lead is POSTed as JSON — CRM intake, automation hook, email relay. Unset, leads fall through to the development mock, which on serverless hosting loses them (see [Leads](#leads)). |
| `LEADS_WEBHOOK_TOKEN` | optional | no | Sent as `Authorization: Bearer …` so the endpoint can reject anything that is not this site. |

`npm run preflight` checks all three, plus what data is still placeholder, and exits non-zero if anything is outstanding.

---

## Routes

| Route | Rendering | Notes |
| --- | --- | --- |
| `/` | Static | Hero, lineup, savings calculator, BaaS teaser, branches, FAQs |
| `/electric-scooters` | Static | Full lineup |
| `/electric-scooters/[slug]` | SSG | One page per model, from `generateStaticParams` |
| `/compare` | Static | Client-side model picker + spec table + recommendations |
| `/on-road-price` | Dynamic | Server-resolves `?model=` / `?variant=` so the form arrives preselected |
| `/book-test-ride` | Dynamic | Same, plus opening-hours-derived slots |
| `/finance` | Dynamic | EMI calculator |
| `/battery-as-a-service` | Static | Ownership comparison |
| `/showroom` | Dynamic | Branch gallery + selector |
| `/service`, `/warranty`, `/about`, `/contact`, `/faq` | Static | |
| `/api/leads` | Dynamic | `POST` only — lead capture |
| `/sitemap.xml`, `/robots.txt` | Static | Generated from the catalogue |

---

## Architecture

### Data is the source of truth

Nothing about a scooter, a showroom or the business is typed into a component. Content lives in `src/data/`, is typed by `src/types/`, and is validated by `src/schemas/`. Pages read it and render it.

```
src/
  app/            routes, metadata, the one API route
  components/
    ui/           Radix-based primitives (button, dialog, select, slider…)
    common/       layout atoms — section, container, breadcrumbs, placeholders
    sections/     homepage sections
    product/      model page — hero, gallery, specs, variants, features
    forms/        test-ride, price-enquiry, contact + shared submit hook
    compare/ branches/ showroom/ finance/ baas/ team/ seo/
  data/
    products/     one file per model + _template.ts reference
    branches.ts   showrooms — the location source of truth
    dealership.ts business identity (mirrors the primary branch)
    pricing.ts warranty.ts service.ts faqs.ts team.ts testimonials.ts …
  lib/
    calculators/  emi, baas, ev-savings — pure, no React, no formatting
    leads/        LeadService interface + webhook & mock implementations + factory
    brand.ts      dealership vs. manufacturer vocabulary
    seo.ts        JSON-LD builders
    rate-limit.ts in-memory sliding window
    products.ts compare.ts recommendations.ts booking-slots.ts format.ts …
  schemas/        Zod — product data and lead payloads
  config/         site metadata, navigation
```

**Product data is validated at build time.** `src/data/products/index.ts` runs `validateProducts()` at module load; because every page reading it is prerendered, a malformed edit fails `next build` rather than reaching a customer. `_template.ts` is validated alongside the real models so the reference example can't drift from the schema.

### Placeholders are a first-class state

Real addresses, phone numbers, coordinates and photography aren't in yet. Rather than shipping `000000` or `0,0`:

- Each branch and the dealership carry a `placeholders: string[]` listing what is still outstanding.
- JSON-LD **omits** a field that is still a placeholder — publishing fake coordinates would actively harm local search.
- The UI renders labelled `MediaPlaceholder` blocks that reserve the same layout space, so dropping real images in later causes no layout shift.

Search `placeholders` to find everything awaiting real data.

### Leads

```
form (react-hook-form + Zod)
  → POST /api/leads
      → same Zod schema, re-validated server-side
      → getLeadService().create()
          → LEADS_WEBHOOK_URL set  →  WebhookLeadService  →  your endpoint
          → otherwise              →  MockLeadService     →  .data/leads.json
                                                             (gitignored, memory fallback)
```

`src/lib/leads/lead-service.ts` is the seam. Every form and the API route talk to that interface only — connecting a real CRM means writing one more implementation and selecting it in `getLeadService()`. No component, form or route changes.

**Production must set `LEADS_WEBHOOK_URL`.** A serverless filesystem is read-only, so the mock falls back to per-instance memory and every lead disappears when the instance recycles — while the customer is shown a reference number. The webhook service is the opposite: a delivery failure throws, the route answers 500, and the customer is told to call the showroom. It never reports success for a lead nobody received. A production start with no webhook configured logs a warning saying exactly that.

The route treats every field as hostile: body size-capped, re-validated against the shared schema, model slug checked against the real catalogue, mobile number re-normalized server-side, branch id resolved against the branch registry (falling back to the primary showroom rather than dropping a real customer over a routing detail). Test-ride slots are re-derived from the showroom's opening hours and checked server-side, so a crafted request cannot book 03:00, a day the showroom is shut, or a slot that has already passed. A hidden honeypot field returns a fake success so a bot learns nothing. Two quotas apply — a generous burst limit on all requests, and a strict limit consumed **only on successful storage**, so correcting a typo never counts against the customer.

### Calculators

`src/lib/calculators/` holds three pure modules — reducing-balance EMI, battery-subscription vs. outright ownership, and petrol-vs-electric running cost. No React, no currency formatting, every input guarded against zero and negative manual entry. Every output is explicitly an estimate; the real number comes from the lender or the counter.

### Tests

`npm test` runs Vitest over the pure modules — the three calculators, the lead schema helpers and the booking-slot generator — where a silent change does real damage: a wrong EMI is a number a customer plans around, a mobile number that fails to normalise is a lead nobody can call back, and a slot offered in the past is a visit to a locked door.

Tests are co-located as `*.test.ts`. Two habits keep them honest: expected instalments are reference values computed independently of the code under test, so the suite cannot simply agree with itself; and the slot tests run against their own opening-hours fixture with an injected clock, so they pin the rules rather than the showroom's current timetable.

### SEO

`src/lib/seo.ts` builds Organization, per-branch AutoDealer/LocalBusiness, Product, FAQ and BreadcrumbList schema, all derived from `siteConfig` and `dealership` so structured data can't contradict the page. Each showroom gets its own `@id` and is marked `branchOf` the dealership — the correct shape for a multi-location business, and what lets each branch rank for its own city. JSON-LD is serialised with `<` escaped.

### Analytics

`track()` in `src/lib/analytics.ts` is a typed façade over `gtag` / `dataLayer`. No vendor script is bundled: if a tag manager is present, events reach it; if not, they are dropped. It no-ops outside the browser and never throws, because analytics must not be able to break a form submission.

---

## Common tasks

**Add a scooter** — copy `src/data/products/_template.ts` to `src/data/products/<slug>.ts`, fill it in, then import it into the `lineup` array in `src/data/products/index.ts`. The model page, lineup, compare table, sitemap and form dropdowns all pick it up. `order` controls its position.

**Add a showroom** — add an entry to `src/data/branches.ts` with an accurate `placeholders` list. Branch cards, the selector, the showroom page, per-branch JSON-LD and the lead router follow. The primary branch also feeds `dealership.ts`, so changing the main showroom is a one-file edit.

**Change opening hours** — edit the branch. Test-ride slots are generated from those hours, so a closed day offers no slots rather than letting someone book a visit to a locked door.

**Rebrand** — `src/data/dealership.ts` and `src/lib/brand.ts`. Nothing else names the business inline.

**Connect a CRM** — implement `LeadService`, select it in `src/lib/leads/index.ts` from a server-side env var. Nothing in that module is imported by client code.

---

## Deployment (Vercel)

The project is a stock Next.js App Router app. Vercel's framework preset is correct as-is, so there is **no `vercel.json`** — adding one would only restate the defaults and then drift from them.

| Setting | Value |
| --- | --- |
| Framework preset | Next.js (auto-detected) |
| Install command | `npm install` (default) |
| Build command | `npm run build` (default) |
| Output | `.next` (default) |
| Node.js version | 20.x or later — `engines.node` in `package.json` pins the floor |
| Root directory | repository root |

Environment variables to add under **Settings → Environment Variables**, for Production and Preview both:

| Name | Environments | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Production | The real origin, e.g. `https://www.example.com`. **Set it before the first production build** — `robots.txt` and `sitemap.xml` are generated at build time, and an unset value ships a `Disallow: /`. |
| `NEXT_PUBLIC_SITE_URL` | Preview | Leave unset. A preview build then serves `Disallow: /`, which is what you want: preview URLs must not compete with the real site in the index. |
| `LEADS_WEBHOOK_URL` | Production, Preview | Server-only. Where leads are POSTed. |
| `LEADS_WEBHOOK_TOKEN` | Production, Preview | Server-only, optional. |

Notes:

- **Images** are all local to `public/`, so the optimizer needs no `remotePatterns` and no external host is allowed. Keep it that way.
- **Security headers** (HSTS, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, COOP) are set in `next.config.ts` and apply to every response. `X-Powered-By` is off.
- **`/api/leads`** runs on the Node runtime and is same-origin only; it sets no CORS headers, by design.
- **Rate limiting** is per-instance (see Known limitations). If the forms attract abuse, put Vercel's WAF or a shared store in front — the in-process limiter will not do it alone.
- Run `npm run preflight` before promoting a deployment.

---

## Before launch

Run `npm run preflight` — it checks the first three mechanically.

- [ ] Set `NEXT_PUBLIC_SITE_URL` (build-time).
- [ ] Set `LEADS_WEBHOOK_URL` (and `LEADS_WEBHOOK_TOKEN` if the endpoint authenticates).
- [ ] Replace every `placeholders` entry in `src/data/branches.ts` with real data. The phone, WhatsApp, email, map and coordinates shipped today are **fake** — the call and WhatsApp CTAs on every page point at them.
- [ ] Supply real photography (products, showrooms, team) and `og-default.png`.
- [ ] Replace the in-memory rate limiter with a shared store (Redis/Upstash) or the platform WAF; it does not hold across serverless instances, and `x-forwarded-for` is client-controlled unless a trusted proxy overwrites it.
- [ ] Add a Content-Security-Policy in `next.config.ts` once the tag-manager script list is known. The other security headers are already set there.
- [ ] Point the real social handles in `dealership.socialLinks` and set `siteConfig.twitterHandle`.

## Known limitations

- **Test coverage is partial by design.** The pure modules are covered; components, the API route and the branch/product data are not. The lead route's own validation is the next candidate.
- **The mock lead store is development-only** by design. Writes are atomic and serialised and a corrupt file is quarantined rather than overwritten, but that only holds within one process. Production goes through `LEADS_WEBHOOK_URL`.
- **Rate limiting is per-instance.** `src/lib/rate-limit.ts` holds its windows in process memory, so on serverless hosting each instance counts separately and the quota is advisory. It is a speed bump against a naive script, not a defence — see the checklist above.
- **No Content-Security-Policy.** The other security headers are set in `next.config.ts`; CSP waits on the tag-manager script list, because a policy written against scripts that are not here yet would either block them on arrival or be too loose to matter.
- **`siteConfig.twitterHandle` is unused** until a real handle exists — page-level `twitter` metadata would each need it, so it is wired nowhere rather than half-wired.

---

## Note on `AGENTS.md`

`AGENTS.md` and its `CLAUDE.md` include are written and re-added by `next dev`. They tell coding agents to read `node_modules/next/dist/docs/` before writing code against this Next.js version. Leave them committed — deleting them only recreates an uncommitted change.
