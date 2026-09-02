import {
  Armchair,
  BatteryWarning,
  BellRing,
  CircleGauge,
  CirclePower,
  Disc3,
  Footprints,
  Gauge,
  KeyRound,
  LifeBuoy,
  Lightbulb,
  MapPin,
  Navigation,
  Package,
  Recycle,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Sun,
  TriangleAlert,
  Undo2,
  Usb,
  Waves,
  type LucideIcon,
} from "lucide-react";

import type {
  ComfortFeatureId,
  FeatureId,
  SafetyFeatureId,
  SmartFeatureId,
} from "@/types/product";

export type FeatureGroup = "smart" | "safety" | "comfort";

export interface FeatureDefinition<Id extends FeatureId = FeatureId> {
  id: Id;
  label: string;
  description: string;
  icon: LucideIcon;
  group: FeatureGroup;
}

/**
 * Catalogue of every feature the site can describe.
 *
 * Listing a feature here does NOT claim any model has it. A model advertises a
 * feature only by naming its id in `smartFeatures` / `safetyFeatures` /
 * `comfortFeatures` in `src/data/products/*`. Components resolve those ids
 * through this catalogue, so an unclaimed feature can never be rendered.
 */

export const smartFeatureCatalog: FeatureDefinition<SmartFeatureId>[] = [
  {
    id: "mobile-app",
    label: "Mobile App",
    description:
      "Pair the scooter with your phone to see charge level, ride history and vehicle status.",
    icon: Smartphone,
    group: "smart",
  },
  {
    id: "geo-fencing",
    label: "Geo-fencing",
    description: "Draw a boundary on the map and get alerted if the scooter leaves it.",
    icon: MapPin,
    group: "smart",
  },
  {
    id: "navigation",
    label: "Navigation",
    description: "Turn-by-turn guidance so you can keep your phone in your pocket.",
    icon: Navigation,
    group: "smart",
  },
  {
    id: "anti-theft",
    label: "Anti-theft Alerts",
    description:
      "Movement and tamper alerts sent straight to your phone when the scooter is parked.",
    icon: ShieldAlert,
    group: "smart",
  },
  {
    id: "sos",
    label: "Emergency SOS",
    description: "Reach your emergency contacts quickly if something goes wrong.",
    icon: LifeBuoy,
    group: "smart",
  },
  {
    id: "vehicle-monitoring",
    label: "Vehicle Monitoring",
    description:
      "Battery health and service reminders, so nothing takes you by surprise.",
    icon: BellRing,
    group: "smart",
  },
];

export const safetyFeatureCatalog: FeatureDefinition<SafetyFeatureId>[] = [
  {
    id: "combi-braking",
    label: "Combi Braking System",
    description: "Applies both brakes together for more predictable stops.",
    icon: ShieldCheck,
    group: "safety",
  },
  {
    id: "disc-brakes",
    label: "Disc Brakes",
    description: "Stronger, more consistent braking than drums, especially when wet.",
    icon: Disc3,
    group: "safety",
  },
  {
    id: "tubeless-tyres",
    label: "Tubeless Tyres",
    description: "Lose air slowly rather than suddenly if you pick up a puncture.",
    icon: CircleGauge,
    group: "safety",
  },
  {
    id: "led-headlamp",
    label: "LED Headlamp",
    description: "Brighter night visibility while drawing less from the battery.",
    icon: Lightbulb,
    group: "safety",
  },
  {
    id: "led-drl",
    label: "LED Daytime Running Lamp",
    description: "Makes the scooter easier for other road users to see in daylight.",
    icon: Sun,
    group: "safety",
  },
  {
    id: "hazard-lights",
    label: "Hazard Lights",
    description: "Warn traffic around you when you stop unexpectedly.",
    icon: TriangleAlert,
    group: "safety",
  },
  {
    id: "side-stand-sensor",
    label: "Side Stand Sensor",
    description: "Stops the motor engaging while the side stand is down.",
    icon: CirclePower,
    group: "safety",
  },
  {
    id: "reverse-assist",
    label: "Reverse Assist",
    description: "Backs the scooter out of tight parking under its own power.",
    icon: Undo2,
    group: "safety",
  },
  {
    id: "battery-management-system",
    label: "Battery Management System",
    description:
      "Monitors cell temperature and charge to protect the pack over its life.",
    icon: BatteryWarning,
    group: "safety",
  },
  {
    id: "regenerative-braking",
    label: "Regenerative Braking",
    description: "Recovers a little energy back into the battery as you slow down.",
    icon: Recycle,
    group: "safety",
  },
];

export const comfortFeatureCatalog: FeatureDefinition<ComfortFeatureId>[] = [
  {
    id: "telescopic-suspension",
    label: "Telescopic Front Suspension",
    description: "Takes the edge off broken road surfaces and speed breakers.",
    icon: Waves,
    group: "comfort",
  },
  {
    id: "digital-console",
    label: "Digital Console",
    description: "Speed, charge, range and mode readable at a glance.",
    icon: Gauge,
    group: "comfort",
  },
  {
    id: "usb-charging",
    label: "USB Charging Port",
    description: "Keep your phone topped up while you ride.",
    icon: Usb,
    group: "comfort",
  },
  {
    id: "boot-light",
    label: "Boot Light",
    description: "Lights the under-seat storage when you open it after dark.",
    icon: Package,
    group: "comfort",
  },
  {
    id: "flat-footboard",
    label: "Flat Footboard",
    description: "Room for a bag, a crate or a week's shopping at your feet.",
    icon: Footprints,
    group: "comfort",
  },
  {
    id: "pillion-backrest",
    label: "Pillion Backrest",
    description: "More secure seating for whoever rides behind you.",
    icon: Armchair,
    group: "comfort",
  },
  {
    id: "keyless-start",
    label: "Keyless Start",
    description: "Unlock and start without taking the key out of your pocket.",
    icon: KeyRound,
    group: "comfort",
  },
  {
    id: "cruise-control",
    label: "Cruise Control",
    description: "Hold a steady speed on longer, open stretches.",
    icon: CircleGauge,
    group: "comfort",
  },
  {
    id: "mobile-holder",
    label: "Mobile Holder",
    description: "Mount your phone where you can see it.",
    icon: Smartphone,
    group: "comfort",
  },
];

export const featureCatalog: FeatureDefinition[] = [
  ...smartFeatureCatalog,
  ...safetyFeatureCatalog,
  ...comfortFeatureCatalog,
];

const featureById = new Map<FeatureId, FeatureDefinition>(
  featureCatalog.map((feature) => [feature.id, feature])
);

export function getFeature(id: FeatureId): FeatureDefinition | undefined {
  return featureById.get(id);
}

/** Resolves ids to definitions, dropping any id with no catalogue entry. */
export function resolveFeatures(ids: readonly FeatureId[]): FeatureDefinition[] {
  return ids
    .map((id) => featureById.get(id))
    .filter((feature): feature is FeatureDefinition => feature != null);
}

/** Every id the catalogue knows about — used by schema validation. */
export const knownFeatureIds = featureCatalog.map((feature) => feature.id);
