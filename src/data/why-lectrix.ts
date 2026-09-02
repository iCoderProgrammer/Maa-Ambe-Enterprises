import {
  BatteryCharging,
  Cpu,
  Factory,
  Leaf,
  ShieldCheck,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export interface ValuePillar {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

/**
 * Reasons to buy, written without numeric claims. Anything measurable —
 * warranty length, service intervals, running cost — belongs in product data
 * or the warranty page once the dealership confirms it.
 */
export const valuePillars: ValuePillar[] = [
  {
    id: "electric-mobility",
    title: "Electric Mobility",
    description:
      "No petrol queues, no engine oil, no clutch. Charge at home overnight and start every day with a full tank.",
    icon: Leaf,
  },
  {
    id: "smart-technology",
    title: "Smart Technology",
    description:
      "Connected features that let you check charge, track your scooter and get alerts from your phone.",
    icon: Cpu,
  },
  {
    id: "battery-technology",
    title: "Battery Technology",
    description:
      "Lithium-ion packs engineered for Indian conditions, with battery health visible in the app.",
    icon: BatteryCharging,
  },
  {
    id: "service-support",
    title: "Service Support",
    description:
      "Servicing, spares and diagnostics handled at our authorized showroom by trained technicians.",
    icon: Wrench,
  },
  {
    id: "warranty",
    title: "Warranty",
    description:
      "Every model is covered by the manufacturer's vehicle and battery warranty. Ask us for the terms that apply to your variant.",
    icon: ShieldCheck,
  },
  {
    id: "indian-ev-brand",
    title: "Indian EV Brand",
    description:
      "Lectrix EV designs and builds in India, for Indian roads, riders and riding conditions.",
    icon: Factory,
  },
];
