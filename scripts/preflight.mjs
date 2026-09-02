#!/usr/bin/env node
/**
 * Pre-deploy check: what is still placeholder, and what is still unconfigured.
 *
 * The site is written so that unknown data is omitted rather than faked —
 * structured data drops a placeholder field, the UI renders a "to be confirmed"
 * block. That keeps a half-configured site honest, but it also means a
 * placeholder can reach production without anything breaking. This script is
 * the thing that notices.
 *
 * Run it before every production deploy:
 *
 *     npm run preflight
 *
 * It exits non-zero when anything is outstanding, so it can gate a deploy in
 * CI. It is deliberately NOT part of `npm run build` — development builds must
 * keep working while the real addresses and photographs are still being
 * gathered.
 *
 * Reads `src/data/branches.ts` directly (Node strips the types), so it can
 * never drift from the data the site actually renders.
 */

import { branches } from "../src/data/branches.ts";

const CONTACT_FIELDS = new Set(["phone", "whatsapp", "email", "address", "geo"]);

let blocking = 0;
let advisory = 0;

const red = (s) => `\x1b[31m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const dim = (s) => `\x1b[2m${s}\x1b[0m`;

console.log("\nPre-deploy check\n" + "=".repeat(60));

/* -- Environment ---------------------------------------------------------- */

console.log("\nEnvironment");

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
if (!siteUrl || siteUrl.includes("localhost")) {
  blocking += 1;
  console.log(
    red("  ✗ NEXT_PUBLIC_SITE_URL is not set to a real origin.") +
      "\n    Read at BUILD time: canonicals, OG tags and sitemap.xml would point at" +
      "\n    localhost, and robots.txt would disallow every crawler."
  );
} else {
  console.log(green(`  ✓ NEXT_PUBLIC_SITE_URL = ${siteUrl}`));
}

if (!process.env.LEADS_WEBHOOK_URL) {
  blocking += 1;
  console.log(
    red("  ✗ LEADS_WEBHOOK_URL is not set.") +
      "\n    Leads would fall through to the development mock, which on serverless" +
      "\n    hosting keeps them in per-instance memory and loses them."
  );
} else {
  console.log(green("  ✓ LEADS_WEBHOOK_URL is set"));
}

/* -- Branch data ---------------------------------------------------------- */

console.log("\nShowroom data");

for (const branch of branches) {
  const outstanding = branch.placeholders ?? [];

  if (outstanding.length === 0) {
    console.log(green(`  ✓ ${branch.branchName} — no placeholders`));
    continue;
  }

  const contact = outstanding.filter((field) => CONTACT_FIELDS.has(field));
  const rest = outstanding.filter((field) => !CONTACT_FIELDS.has(field));

  if (contact.length > 0) {
    blocking += 1;
    console.log(
      red(`  ✗ ${branch.branchName} — placeholder contact details: ${contact.join(", ")}`) +
        "\n    Call, WhatsApp, directions and map links would point at fake" +
        "\n    destinations for real customers."
    );
  }

  if (rest.length > 0) {
    advisory += 1;
    console.log(yellow(`  ! ${branch.branchName} — still placeholder: ${rest.join(", ")}`));
  }
}

/* -- Verdict -------------------------------------------------------------- */

console.log("\n" + "=".repeat(60));

if (blocking > 0) {
  console.log(red(`\nNOT READY — ${blocking} blocking item(s).`));
  console.log(dim("Fix these in src/data/branches.ts and the Vercel environment.\n"));
  process.exit(1);
}

if (advisory > 0) {
  console.log(yellow(`\nReady, with ${advisory} advisory item(s) — placeholder content remains.\n`));
  process.exit(0);
}

console.log(green("\nReady to deploy.\n"));
