/**
 * The people who run Maa Ambey Enterprises.
 *
 * NOTHING IN THIS FILE MAY BE INVENTED.
 *
 * A team section names real, identifiable people and puts words in their
 * mouths. A plausible-sounding "Rajesh Kumar, Sales Manager, 12 years of
 * experience" is not a placeholder — it is a fabricated person attached to a
 * real business, and a customer who asks for them at the counter finds that
 * out. So `team` below ships EMPTY, and the section that renders it shows a
 * short configuration notice instead of a grid until real people are supplied.
 *
 * TO ADD SOMEONE
 * Copy `teamMemberTemplate`, fill in every field you actually know, and push it
 * into `team`. Fields you do not know stay `null` — `experience`, `photo` and
 * `bio` are all optional, and the card adapts rather than inventing filler.
 * A member with `photo: null` renders a labelled placeholder that reserves the
 * same space, so adding photography later causes no layout shift.
 *
 * BRANCH ASSOCIATION
 * `branchId` ties a person to a showroom in `src/data/branches.ts`. Leave it
 * null for someone who works across all locations, such as the owner.
 */

import type { ShowroomImage } from "@/data/branches";

/**
 * Which part of the business someone belongs to. Drives grouping and order on
 * the page — owners first, then management, then the customer-facing teams.
 */
export type TeamCategory = "owner" | "management" | "sales" | "service" | "support";

export interface TeamCategoryMeta {
  id: TeamCategory;
  label: string;
  description: string;
}

export const teamCategories: TeamCategoryMeta[] = [
  {
    id: "owner",
    label: "Ownership",
    description: "The person whose name is over the door.",
  },
  {
    id: "management",
    label: "Management",
    description: "The people who run the showroom day to day.",
  },
  {
    id: "sales",
    label: "Sales",
    description: "Who you will meet on the floor and on a test ride.",
  },
  {
    id: "service",
    label: "Service",
    description: "The technicians who look after your scooter afterwards.",
  },
  {
    id: "support",
    label: "Support",
    description: "Finance, registration, insurance and everything after the sale.",
  },
];

export interface TeamMember {
  id: string;
  name: string;
  /** Job title, e.g. "Founder & Owner". */
  designation: string;
  /** What they actually do, in a few words. Shown under the designation. */
  role: string;
  category: TeamCategory;
  /** Portrait. Null renders a labelled placeholder of the same size. */
  photo: ShowroomImage | null;
  /** Two or three sentences. Null omits the paragraph entirely. */
  bio: string | null;
  /** Years in the trade. Null when not confirmed — never estimated. */
  experience: number | null;
  /**
   * A short quote, used only for the owner's message. Null for everyone else;
   * a section that invents quotes for six people reads as invented.
   */
  message: string | null;
  /** Branch in `src/data/branches.ts`, or null for someone who covers all. */
  branchId: string | null;
  socialLinks: { label: string; href: string }[];
  /**
   * True while this entry is scaffolding rather than a real colleague. The
   * section renders a notice whenever any member carries it, so a placeholder
   * roster cannot quietly ship as though it were the real team.
   */
  placeholder: boolean;
  /** Promotes someone into the lead card. Typically the owner. */
  featured: boolean;
  /** Order within their category, lowest first. */
  displayOrder: number;
}

/**
 * The roster.
 *
 * These six entries are SCAFFOLDING, not colleagues. Names are bracketed
 * tokens, the portraits are faceless generated silhouettes carrying a visible
 * PLACEHOLDER badge, and every one is flagged `placeholder: true` so the
 * section says so on the page. Nobody here exists.
 *
 * To make this real: replace `name` with the person, write a `bio` in their
 * words, drop their photograph in at `/images/team/`, set `experience` only if
 * you know it, and clear `placeholder`. Delete any row you do not have a real
 * person for — an empty array renders the honest "profiles are being prepared"
 * notice, which is better than a bracketed name going live.
 */
export const team: TeamMember[] = [
  {
    id: "owner",
    name: "[Owner Name]",
    designation: "Founder & Owner",
    role: "Runs the dealership and meets most customers personally",
    category: "owner",
    photo: {
      src: "/images/team/owner.png",
      alt: "Placeholder portrait for the owner of Maa Ambey Enterprises",
      width: 800,
      height: 1000,
    },
    bio: "A short introduction goes here — how the dealership started, and why it sells electric.",
    experience: null,
    message: "A line from the owner to customers goes here, in their own words.",
    branchId: null,
    socialLinks: [],
    placeholder: true,
    featured: true,
    displayOrder: 1,
  },
  {
    id: "showroom-manager",
    name: "[Manager Name]",
    designation: "Showroom Manager",
    role: "Runs the floor day to day and handles deliveries",
    category: "management",
    photo: {
      src: "/images/team/manager.png",
      alt: "Placeholder portrait for the showroom manager",
      width: 800,
      height: 1000,
    },
    bio: "Two or three sentences about what they look after at the showroom.",
    experience: null,
    message: null,
    branchId: null,
    socialLinks: [],
    placeholder: true,
    featured: false,
    displayOrder: 1,
  },
  {
    id: "sales-advisor-1",
    name: "[Sales Advisor Name]",
    designation: "Sales Advisor",
    role: "Model guidance and test rides",
    category: "sales",
    photo: {
      src: "/images/team/sales-1.png",
      alt: "Placeholder portrait for a sales advisor",
      width: 800,
      height: 1000,
    },
    bio: "What this advisor helps customers with, in a sentence or two.",
    experience: null,
    message: null,
    branchId: null,
    socialLinks: [],
    placeholder: true,
    featured: false,
    displayOrder: 1,
  },
  {
    id: "sales-advisor-2",
    name: "[Sales Advisor Name]",
    designation: "Sales Advisor",
    role: "Finance options and on-road pricing",
    category: "sales",
    photo: {
      src: "/images/team/sales-2.png",
      alt: "Placeholder portrait for a sales advisor",
      width: 800,
      height: 1000,
    },
    bio: "What this advisor helps customers with, in a sentence or two.",
    experience: null,
    message: null,
    branchId: null,
    socialLinks: [],
    placeholder: true,
    featured: false,
    displayOrder: 2,
  },
  {
    id: "service-technician",
    name: "[Technician Name]",
    designation: "Senior Technician",
    role: "Servicing, diagnostics and battery health checks",
    category: "service",
    photo: {
      src: "/images/team/service.png",
      alt: "Placeholder portrait for a service technician",
      width: 800,
      height: 1000,
    },
    bio: "What this technician handles in the workshop.",
    experience: null,
    message: null,
    branchId: null,
    socialLinks: [],
    placeholder: true,
    featured: false,
    displayOrder: 1,
  },
  {
    id: "support-executive",
    name: "[Support Executive Name]",
    designation: "Support Executive",
    role: "Registration, insurance and paperwork",
    category: "support",
    photo: {
      src: "/images/team/support.png",
      alt: "Placeholder portrait for a support executive",
      width: 800,
      height: 1000,
    },
    bio: "What this colleague handles after the sale is agreed.",
    experience: null,
    message: null,
    branchId: null,
    socialLinks: [],
    placeholder: true,
    featured: false,
    displayOrder: 1,
  },
];

/** Copy this to add a person. Not exported into `team`. */
export const teamMemberTemplate: TeamMember = {
  id: "unique-id",
  name: "Full Name",
  designation: "Founder & Owner",
  role: "Runs the dealership and meets most customers personally",
  category: "owner",
  photo: null,
  bio: "Two or three sentences on who they are and what they handle.",
  experience: null,
  message: null,
  branchId: null,
  socialLinks: [],
  placeholder: false,
  featured: true,
  displayOrder: 1,
};

/* -------------------------------------------------------------------------- */
/* Access                                                                      */
/* -------------------------------------------------------------------------- */

/** True while no team members at all have been configured. */
export function isTeamPending(): boolean {
  return team.length === 0;
}

/** True while any listed member is still scaffolding rather than a real person. */
export function hasPlaceholderTeam(): boolean {
  return team.some((member) => member.placeholder);
}

/** Everyone, ordered by category then `displayOrder`. */
export function getTeam(): TeamMember[] {
  const order = new Map(teamCategories.map((c, index) => [c.id, index]));

  return [...team].sort((a, b) => {
    const byCategory = (order.get(a.category) ?? 0) - (order.get(b.category) ?? 0);
    return byCategory !== 0 ? byCategory : a.displayOrder - b.displayOrder;
  });
}

export function getTeamByCategory(category: TeamCategory): TeamMember[] {
  return getTeam().filter((member) => member.category === category);
}

/**
 * Categories that actually have people, with those people attached. Empty
 * categories are dropped rather than rendered as empty headings.
 */
export function getGroupedTeam(): { category: TeamCategoryMeta; members: TeamMember[] }[] {
  return teamCategories
    .map((category) => ({ category, members: getTeamByCategory(category.id) }))
    .filter((group) => group.members.length > 0);
}

/** The lead card: the featured person, else the first owner, else the first. */
export function getFeaturedMember(): TeamMember | undefined {
  const ordered = getTeam();
  return (
    ordered.find((member) => member.featured) ??
    ordered.find((member) => member.category === "owner") ??
    ordered[0]
  );
}

/** Everyone at a branch, plus everyone who covers all branches. */
export function getTeamForBranch(branchId: string): TeamMember[] {
  return getTeam().filter(
    (member) => member.branchId === branchId || member.branchId === null
  );
}
