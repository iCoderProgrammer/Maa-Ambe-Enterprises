/**
 * Site-wide FAQ content.
 *
 * Two rules govern every answer here:
 *
 * 1. **Generally true, or not stated.** Anything that varies by model, variant,
 *    city, lender or month points the customer at the showroom instead of
 *    guessing. That applies especially to warranty terms — inventing a
 *    condition creates an expectation the counter then has to withdraw.
 * 2. **No numbers we have not confirmed.** No prices, no ranges, no warranty
 *    durations. Those live in product data, where they can be verified.
 */

import { DEALERSHIP_NAME } from "@/lib/brand";

export type FaqCategoryId =
  | "general-ev"
  | "models"
  | "battery"
  | "charging"
  | "baas"
  | "finance"
  | "test-ride"
  | "service"
  | "warranty"
  | "dealership";

export interface Faq {
  question: string;
  answer: string;
  category: FaqCategoryId;
}

export interface FaqCategory {
  id: FaqCategoryId;
  label: string;
  description: string;
}

export const faqCategories: FaqCategory[] = [
  {
    id: "general-ev",
    label: "General EV",
    description: "Switching from petrol, and what changes day to day.",
  },
  {
    id: "models",
    label: "Models",
    description: "Choosing between the scooters in the range.",
  },
  {
    id: "battery",
    label: "Battery",
    description: "Life, health and what happens as the pack ages.",
  },
  {
    id: "charging",
    label: "Charging",
    description: "How, where and what it costs.",
  },
  {
    id: "baas",
    label: "Battery-as-a-Service",
    description: "Subscribing to the battery instead of buying it.",
  },
  {
    id: "finance",
    label: "Finance",
    description: "EMI, down payments and on-road pricing.",
  },
  {
    id: "test-ride",
    label: "Test rides",
    description: "Booking a ride and what to bring.",
  },
  {
    id: "service",
    label: "Service",
    description: "Maintenance, spares and support after the sale.",
  },
  {
    id: "warranty",
    label: "Warranty",
    description: "What is covered, and where to get the exact terms.",
  },
  {
    id: "dealership",
    label: DEALERSHIP_NAME,
    description: "Who we are, and what buying from us involves.",
  },
];

export const faqs: Faq[] = [
  /* ---------------------------------------------------------------- General */
  {
    category: "general-ev",
    question: "How far can a Lectrix EV electric scooter travel on one charge?",
    answer:
      "Range depends on the model and variant you choose, and on real-world conditions such as rider weight, terrain, traffic and riding mode. Manufacturer-claimed range for each model is listed on its model page, and our team can tell you what riders in your area typically see day to day.",
  },
  {
    category: "general-ev",
    question: "Is an electric scooter cheaper to run than a petrol one?",
    answer:
      "For most riders, yes — electricity costs considerably less per kilometre than petrol, and there is no engine oil, air filter or clutch to replace. The savings calculator on our homepage lets you enter your own daily distance, petrol price and electricity tariff to see an estimate for how you actually ride.",
  },
  {
    category: "general-ev",
    question: "Can I ride an electric scooter in the rain?",
    answer:
      "Yes. Electric scooters are built to handle rain and normal wet roads. Riding through deep standing water is not advisable on any two-wheeler, electric or petrol. Each model's ingress protection rating is listed in its specifications where the manufacturer publishes one.",
  },
  {
    category: "general-ev",
    question: "Do I need a licence and registration?",
    answer:
      "It depends on the model. Scooters restricted to low speeds fall under a category that does not require registration or a licence in India, while faster models do. The specification sheet for each model states its top speed, and we will confirm exactly what applies before you buy.",
  },

  /* ----------------------------------------------------------------- Models */
  {
    category: "models",
    question: "Which model should I choose?",
    answer:
      "It comes down to how far you ride and where. Shorter city trips suit a compact, lighter scooter; longer daily runs suit a bigger battery. The comparison tool on this site puts up to three models side by side, and a fifteen-minute test ride usually settles it faster than any specification sheet.",
  },
  {
    category: "models",
    question: "What is the difference between the variants of a model?",
    answer:
      "Variants usually differ in battery capacity, which in turn changes range, charging time and price — and sometimes kerb weight. Each model page has a variant selector that updates every specification on the page, so you can see exactly what changes.",
  },
  {
    category: "models",
    question: "Can I see all the models at the showroom?",
    answer:
      "The full range is on our floor, though stock and colours vary. Call ahead if you want a particular model or colour ready when you arrive, and we will make sure it is charged and available.",
  },

  /* ---------------------------------------------------------------- Battery */
  {
    category: "battery",
    question: "How long does the battery last?",
    answer:
      "Lithium-ion batteries lose capacity gradually over many charge cycles rather than failing suddenly. Battery life depends on usage and charging habits. Every model carries a manufacturer battery warranty — ask us for the exact terms that apply to the variant you are considering.",
  },
  {
    category: "battery",
    question: "How can I make the battery last longer?",
    answer:
      "The habits that help most are simple: avoid leaving the scooter at a very low charge for long periods, avoid charging in direct heat, and use the supplied charger. Beyond that, normal daily riding does not shorten battery life in any way you need to plan around.",
  },
  {
    category: "battery",
    question: "Can I remove the battery to charge it indoors?",
    answer:
      "Some models have a removable pack you can carry inside; others have a fixed battery you charge with the scooter parked. Whether a particular model is removable is listed in its specifications — it is worth checking if you park on the street or away from a socket.",
  },
  {
    category: "battery",
    question: "What does it cost to replace a battery?",
    answer:
      "Replacement pricing depends on the model and the pack, and it changes over time. We would rather quote you the current figure directly than publish one here that goes out of date — call the showroom and we will tell you what it is today.",
  },

  /* --------------------------------------------------------------- Charging */
  {
    category: "charging",
    question: "How do I charge an electric scooter at home?",
    answer:
      "Each scooter comes with a charger that plugs into an ordinary household socket. Most owners charge overnight, the same way they charge a phone. You do not need a special high-power connection for a scooter.",
  },
  {
    category: "charging",
    question: "How much does it cost to charge?",
    answer:
      "Charging cost depends on your battery size and your local electricity tariff. Our EV savings calculator lets you enter your own electricity rate and daily distance to see an estimate for your usage.",
  },
  {
    category: "charging",
    question: "How long does a full charge take?",
    answer:
      "Charging time varies by battery size and is listed on each model page. Since most riders charge overnight, the practical answer for daily use is that the scooter is full every morning regardless.",
  },
  {
    category: "charging",
    question: "Do I need to install a charging point?",
    answer:
      "No. A standard socket is enough for a scooter. Charging points are something electric cars need, not two-wheelers.",
  },

  /* ------------------------------------------------------------------- BaaS */
  {
    category: "baas",
    question: "What exactly is Battery-as-a-Service?",
    answer:
      "The battery is the single most expensive part of an electric scooter. Battery-as-a-Service separates it from the purchase: you buy the scooter without the battery, which lowers what you pay on day one, and pay a monthly subscription to use the battery instead.",
  },
  {
    category: "baas",
    question: "Do I own the battery?",
    answer:
      "No. Under a subscription the battery remains the provider's, which is why its condition stays their responsibility for the term. If you would rather own the battery outright, buying the scooter the conventional way is still an option — we will show you both.",
  },
  {
    category: "baas",
    question: "Is BaaS cheaper than buying outright?",
    answer:
      "It depends entirely on how long you keep the scooter. You pay less at the start, but the subscription continues every month. Past a certain point the subscriptions add up to more than the money you saved upfront. The calculator on our Battery-as-a-Service page shows you where that point falls for the figures you enter.",
  },
  {
    category: "baas",
    question: "What happens if the battery degrades?",
    answer:
      "Battery health is the provider's responsibility for the term of the subscription, which is one of the main reasons customers choose it. The precise terms — health thresholds, replacement and what happens at the end of the term — vary by agreement, so ask us for the current contract before you commit.",
  },
  {
    category: "baas",
    question: "Which models offer Battery-as-a-Service?",
    answer:
      "Availability varies by model and by variant, and can change with the offers running that month. Our Battery-as-a-Service page shows the current position, and the showroom can confirm what is available today.",
  },
  {
    category: "baas",
    question: "Does the subscription cover charging?",
    answer:
      "No. The subscription covers use of the battery. You still pay for the electricity you use to charge it, the same as any electric vehicle — that is the smaller of the two costs, and our calculator includes it so the comparison is realistic.",
  },

  /* ---------------------------------------------------------------- Finance */
  {
    category: "finance",
    question: "Do you offer finance and EMI options?",
    answer:
      "Yes, we help arrange finance through partner lenders. Interest rates and tenure depend on the lender and on your eligibility. The EMI figures shown on this website are estimates to help you plan — your final offer comes from the lender.",
  },
  {
    category: "finance",
    question: "What is the difference between ex-showroom and on-road price?",
    answer:
      "Ex-showroom is the price of the vehicle itself. On-road price adds RTO registration and road tax, insurance and any handling charges, and subtracts subsidies where they apply. Because those vary by state and by month, we confirm the on-road figure for your city rather than publishing one.",
  },
  {
    category: "finance",
    question: "How much down payment do I need?",
    answer:
      "That is set by the lender and depends on the loan you qualify for. A larger down payment lowers both the EMI and the total interest — the finance calculator on our on-road price page lets you see the effect of different amounts before you talk to anyone.",
  },
  {
    category: "finance",
    question: "Are there any EV subsidies available?",
    answer:
      "Central and state incentives for electric two-wheelers exist but change from time to time, and eligibility varies by state and model. We will tell you exactly what applies to your purchase at the time you buy.",
  },

  /* -------------------------------------------------------------- Test ride */
  {
    category: "test-ride",
    question: "Can I take a test ride before buying?",
    answer:
      "Yes. Test rides are free and take about fifteen minutes. Book a slot online or call the showroom, and bring a valid driving licence with you. We will have the model you asked for charged and ready.",
  },
  {
    category: "test-ride",
    question: "What should I bring to a test ride?",
    answer:
      "A valid driving licence is the only requirement. Wear something you can ride comfortably in — closed shoes rather than sandals — and we will provide a helmet.",
  },
  {
    category: "test-ride",
    question: "Can I test ride more than one model?",
    answer:
      "Yes, and we would encourage it. Riding two models back to back tells you far more than riding either one alone. Let us know when you book and we will have both ready.",
  },

  /* ---------------------------------------------------------------- Service */
  {
    category: "service",
    question: "What servicing does an electric scooter need?",
    answer:
      "Electric scooters have far fewer moving parts than petrol scooters, so there is no engine oil, no air filter and no clutch to maintain. Periodic checks cover brakes, tyres, suspension, battery health and software updates. Our showroom handles all scheduled servicing.",
  },
  {
    category: "service",
    question: "How often should I service my scooter?",
    answer:
      "Service intervals are set by the manufacturer and stated in your owner's handbook, usually by time or distance, whichever comes first. We will confirm the schedule for your model at handover and remind you when a service is due.",
  },
  {
    category: "service",
    question: "Do you use genuine parts?",
    answer:
      "Yes. As an authorized dealership we fit genuine parts and use manufacturer diagnostic equipment. That matters for warranty: non-genuine parts fitted elsewhere can affect a claim.",
  },
  {
    category: "service",
    question: "What if I break down?",
    answer:
      "Call the showroom and we will advise you. Whether a roadside assistance programme applies to your vehicle depends on the model and on any package included with your purchase — ask us to confirm what covers you before you need it.",
  },

  /* --------------------------------------------------------------- Warranty */
  {
    category: "warranty",
    question: "Is the scooter under warranty?",
    answer:
      "Every new Lectrix EV scooter carries a manufacturer warranty on the vehicle and a separate warranty on the battery. The durations and conditions are set by the manufacturer and can differ by model and variant, so we confirm the exact terms in writing at the time of purchase rather than summarising them here.",
  },
  {
    category: "warranty",
    question: "Is the battery covered separately?",
    answer:
      "Yes, batteries are covered under their own warranty terms, which are usually stated separately from the vehicle warranty. Ask us for the current terms for the variant you are considering.",
  },
  {
    category: "warranty",
    question: "What could invalidate my warranty?",
    answer:
      "The specific exclusions are set out in the manufacturer's warranty document, and we will go through them with you. As a general principle, unauthorized modification, non-genuine parts and servicing outside the authorized network are the usual risks. We would rather you read the actual terms than rely on a summary.",
  },
  {
    category: "warranty",
    question: "How do I make a warranty claim?",
    answer:
      "Bring the scooter and your purchase documents to the showroom. We handle the claim with the manufacturer on your behalf and will tell you what to expect before any work starts.",
  },

  /* ------------------------------------------------------------- Dealership */
  // Answers here state only what the dealership config already establishes:
  // that we are an authorized dealer, what we assist with, and where to get
  // anything we have not published. No policy, timing or price is invented.
  {
    question: `Who is ${DEALERSHIP_NAME}?`,
    answer: `${DEALERSHIP_NAME} is an authorized Lectrix EV dealership. Lectrix EV designs and builds the scooters and backs the warranty; we sell them, arrange the paperwork and service them locally. Buying here means buying a genuine Lectrix EV from an official dealer.`,
    category: "dealership",
  },
  {
    question: `Does ${DEALERSHIP_NAME} manufacture the scooters?`,
    answer: `No. The scooters are designed and manufactured by Lectrix EV. ${DEALERSHIP_NAME} is the authorized dealership that sells, delivers and services them. Specifications, warranty terms and software updates all come from Lectrix EV.`,
    category: "dealership",
  },
  {
    question: `What can ${DEALERSHIP_NAME} help me with?`,
    answer:
      "Choosing between models, arranging a test ride, working out the on-road price for your city, finance, insurance, RTO registration, delivery and after-sales servicing. Anything set by a lender, an insurer or the RTO we will explain honestly rather than quote a number we cannot stand behind.",
    category: "dealership",
  },
  {
    question: "Which Lectrix EV models can I see at the showroom?",
    answer:
      "The lineup on this website is what we deal in. Floor stock and demo availability move week to week, so call or message us before you travel if you want to ride a specific model on a specific day.",
    category: "dealership",
  },
];

/** Questions in a category, in the order written above. */
export function getFaqsByCategory(category: FaqCategoryId): Faq[] {
  return faqs.filter((faq) => faq.category === category);
}

/** Categories that actually have questions, with those questions attached. */
export function getGroupedFaqs(): { category: FaqCategory; faqs: Faq[] }[] {
  return faqCategories
    .map((category) => ({ category, faqs: getFaqsByCategory(category.id) }))
    .filter((group) => group.faqs.length > 0);
}

/** A representative spread for the homepage — one or two from several areas. */
export const homepageFaqs: Faq[] = [
  faqs.find((faq) => faq.question.startsWith("How far can"))!,
  faqs.find((faq) => faq.question.startsWith("How do I charge"))!,
  faqs.find((faq) => faq.question.startsWith("How much does it cost to charge"))!,
  faqs.find((faq) => faq.question.startsWith("How long does the battery"))!,
  faqs.find((faq) => faq.question.startsWith("What exactly is Battery"))!,
  faqs.find((faq) => faq.question.startsWith("Can I take a test ride"))!,
  faqs.find((faq) => faq.question.startsWith("Do you offer finance"))!,
  faqs.find((faq) => faq.question.startsWith("What servicing does"))!,
];

export const baasFaqs: Faq[] = getFaqsByCategory("baas");
