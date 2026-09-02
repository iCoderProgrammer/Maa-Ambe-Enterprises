import type { LucideIcon } from "lucide-react";
import {
  BatteryCharging,
  Bike,
  Building2,
  GitCompareArrows,
  Info,
  Phone,
  Sparkles,
  Wrench,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  description?: string;
  icon?: LucideIcon;
}

/** Primary header navigation, mirrored by the mobile drawer. */
export const primaryNav: NavItem[] = [
  {
    label: "Electric Scooters",
    href: "/electric-scooters",
    description: "Browse the full Lectrix EV lineup",
    icon: Bike,
  },
  {
    label: "Compare",
    href: "/compare",
    description: "Put up to three Lectrix EV models side by side",
    icon: GitCompareArrows,
  },
  {
    label: "BaaS",
    href: "/battery-as-a-service",
    description: "Battery-as-a-Service explained",
    icon: BatteryCharging,
  },
  {
    label: "Why Lectrix EV",
    href: "/#why-lectrix",
    description: "What the brand builds into every scooter",
    icon: Sparkles,
  },
  {
    label: "Our Showroom",
    href: "/showroom",
    description: "Visit Maa Ambe Enterprises",
    icon: Building2,
  },
  {
    label: "Service",
    href: "/service",
    description: "Servicing, maintenance and support",
    icon: Wrench,
  },
  {
    label: "About",
    href: "/about",
    description: "About Maa Ambe Enterprises",
    icon: Info,
  },
  {
    label: "Contact",
    href: "/contact",
    description: "Reach the dealership",
    icon: Phone,
  },
];

/** Grouped links for the footer. */
export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: "Scooters",
    items: [
      { label: "All models", href: "/electric-scooters" },
      { label: "Compare models", href: "/compare" },
      { label: "On-road price", href: "/on-road-price" },
      { label: "Book a test ride", href: "/book-test-ride" },
    ],
  },
  {
    title: "Ownership",
    items: [
      { label: "Battery-as-a-Service", href: "/battery-as-a-service" },
      { label: "Finance & EMI", href: "/finance" },
      { label: "Service", href: "/service" },
      { label: "Warranty", href: "/warranty" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Dealership",
    items: [
      { label: "Our showrooms", href: "/showroom", icon: Building2 },
      { label: "About us", href: "/about" },
      { label: "Our team", href: "/about#team" },
      { label: "Contact", href: "/contact" },
    ],
  },
];
