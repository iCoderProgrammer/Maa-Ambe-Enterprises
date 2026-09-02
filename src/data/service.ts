import {
  BatteryCharging,
  CircleGauge,
  Cpu,
  Disc3,
  LifeBuoy,
  ShieldCheck,
  Waves,
  Wrench,
  type LucideIcon,
} from "lucide-react";

/**
 * Service and after-sales content.
 *
 * Nothing here states an interval, a price or a coverage term. Those are set by
 * the manufacturer and printed in the owner's handbook, and they differ by
 * model — publishing a number we have not verified would have the counter
 * correcting the website.
 */

export interface ServiceCheck {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

/** What a periodic service actually covers on an electric scooter. */
export const serviceChecks: ServiceCheck[] = [
  {
    id: "brakes",
    title: "Brakes",
    description:
      "Pad and shoe wear, lever travel and brake fluid where fitted. The part of the scooter that matters most and wears fastest.",
    icon: Disc3,
  },
  {
    id: "tyres",
    title: "Tyres & wheels",
    description:
      "Tread depth, pressure and wheel alignment. Under-inflated tyres cost you range as well as grip.",
    icon: CircleGauge,
  },
  {
    id: "suspension",
    title: "Suspension",
    description:
      "Front forks and rear shock checked for leaks, play and damping. Indian roads are hard on both.",
    icon: Waves,
  },
  {
    id: "battery",
    title: "Battery health",
    description:
      "Pack health, cell balance and charging behaviour read from the vehicle's own diagnostics, not estimated.",
    icon: BatteryCharging,
  },
  {
    id: "electricals",
    title: "Electricals & controller",
    description:
      "Motor, controller, wiring, lights and connectors inspected for wear, corrosion and loose terminals.",
    icon: Cpu,
  },
  {
    id: "software",
    title: "Software updates",
    description:
      "Firmware brought up to date, which can improve efficiency, charging behaviour and app features.",
    icon: Wrench,
  },
];

export interface MaintenanceNote {
  title: string;
  description: string;
}

/** What owners can do themselves between services. */
export const ownerMaintenance: MaintenanceNote[] = [
  {
    title: "Check tyre pressure monthly",
    description:
      "The cheapest thing you can do for both range and safety. Correct pressure is printed on the swingarm or in the handbook.",
  },
  {
    title: "Use the supplied charger",
    description:
      "It is matched to the pack. Third-party chargers are the most common cause of avoidable battery problems.",
  },
  {
    title: "Avoid leaving it flat for weeks",
    description:
      "If the scooter will sit unused for a long period, leave it part-charged rather than empty, and out of direct heat.",
  },
  {
    title: "Keep the connectors dry and clean",
    description:
      "A quick wipe of the charging port after a wet ride prevents corrosion at the one connector that matters.",
  },
];

/**
 * Roadside assistance.
 *
 * PLACEHOLDER. Whether a programme applies depends on the model and on any
 * package included with the purchase, and we have not confirmed either. The UI
 * reads `isConfigured` and shows an honest "ask us" state while it is false —
 * set the real details and it becomes a proper section.
 */
export const roadsideAssistance = {
  isConfigured: false,
  /** Set when a programme is confirmed. */
  provider: null as string | null,
  helplineNumber: null as string | null,
  coverageSummary: null as string | null,
  hours: null as string | null,
};

export const genuineParts = [
  {
    icon: ShieldCheck,
    title: "Warranty stays intact",
    description:
      "Non-genuine parts fitted outside the authorized network can affect a warranty claim. Parts fitted here will not.",
  },
  {
    icon: Wrench,
    title: "Manufacturer diagnostics",
    description:
      "We read the vehicle's own systems rather than guessing from symptoms, so a fault is identified rather than chased.",
  },
  {
    icon: LifeBuoy,
    title: "Trained on these machines",
    description:
      "Our technicians are trained specifically on these vehicles — an electric drivetrain is not a petrol one with the engine swapped out.",
  },
] as const;
