import type { ProductShowroom } from "@/types/showroom";

/**
 * NDuro showroom.
 *
 * Copy here describes; it never measures. Anywhere a figure belongs, the block
 * names it with `statKey` and the page reads the real value from the selected
 * variant — so switching to NDuro 3.0 changes the numbers in these panels at
 * the same moment it changes the spec sheet.
 *
 * Claims that depend on a test condition (the IDC range cycle, the durability
 * and water-wading tests Lectrix EV ran) carry that condition in the section
 * `disclaimer` rather than being stated bare. A rider comparing scooters
 * deserves to know a number came off a test rig.
 *
 * Every image is an existing Lectrix EV NDuro asset under
 * `public/images/nduro/`. Nothing here is a placeholder, and no asset is
 * referenced twice.
 */
export const nduroShowroom: ProductShowroom = {
  slug: "nduro",
  intro:
    "Two variants, and the figures below follow whichever you pick — as does every number in the panels above it.",
  variantImage: {
    src: "/images/nduro/nduro-variant-select-full.webp",
    alt: "Lectrix NDuro in Solar Red, full side profile",
    width: 1366,
    height: 768,
  },

  sections: [
    {
      id: "utility",
      navLabel: "Utility",
      eyebrow: "Utility",
      title: "Everything you were going to carry anyway",
      description:
        "The question that decides most scooter purchases is not top speed. It is whether the week's shopping and a full-face helmet fit under the seat.",
      blocks: [
        {
          kind: "banner",
          id: "boot-space",
          title: "Boot space",
          statKey: "bootSpaceLitres",
          caption:
            "Deep enough for a full-face helmet, with room left for a day's errands beside it.",
          media: {
            src: "/images/nduro/nduro-boot-space.webp",
            alt: "Lectrix NDuro with the seat raised, showing the open under-seat storage compartment",
            width: 1366,
            height: 768,
            fullBleed: true,
          },
          // The right of this crop is bodywork and boot shadow, dark enough to
          // carry white copy under a scrim.
          layout: "overlay",
          align: "end",
          copyTone: "light",
        },
      ],
    },

    {
      id: "performance",
      navLabel: "Performance",
      eyebrow: "Performance",
      title: "How it behaves once you are moving",
      description:
        "Ridden the way a commuter actually rides — off the line at a signal, holding a steady pace, and still having range left on the way home.",
      blocks: [
        {
          kind: "cards",
          id: "performance-cards",
          columns: 3,
          ratio: "landscape",
          items: [
            {
              id: "durability",
              title: "Durability",
              description:
                "Lectrix EV puts the NDuro through 1.25 lakh km of endurance testing before it reaches a showroom floor — the kind of distance a daily rider covers over years, compressed into a test programme.",
              media: {
                src: "/images/nduro/nduro-performance-01.webp",
                alt: "Rider seated on a red Lectrix NDuro at the roadside",
                width: 1151,
                height: 768,
              },
            },
            {
              id: "acceleration",
              title: "Acceleration",
              statKey: "accelerationSeconds",
              description:
                "0–40 km/h without drama and without waiting — enough to clear a junction ahead of the traffic behind you rather than being pushed along by it.",
              media: {
                src: "/images/nduro/nduro-performance-02.webp",
                alt: "Lectrix NDuro accelerating along a tree-lined road",
                width: 1151,
                height: 768,
              },
            },
            {
              id: "range",
              title: "Range",
              statKey: "rangeClaimedKm",
              description:
                "Enough for a week of ordinary commuting between charges, so the scooter fits around your routine instead of the other way round.",
              media: {
                src: "/images/nduro/nduro-performance-03.webp",
                alt: "Lectrix NDuro being ridden on an open road with the headlamp on",
                width: 1152,
                height: 768,
              },
            },
          ],
        },
      ],
      disclaimer:
        "Range is the manufacturer's IDC test-cycle figure and acceleration is measured under test conditions. Both vary in daily use with rider weight, pillion load, terrain, traffic, tyre pressure and riding mode. Ask us what our own customers see on Kanpur roads.",
    },

    {
      id: "vehicle-design",
      navLabel: "Vehicle Design",
      eyebrow: "Vehicle Design",
      title: "Detailed where your hands and eyes go",
      description:
        "The parts of a scooter you touch every day are the parts worth looking at closely before you buy.",
      blocks: [
        {
          kind: "cards",
          id: "design-primary",
          columns: 2,
          ratio: "landscape",
          items: [
            {
              id: "display",
              title: "Colour segmented display",
              description:
                "Speed, charge, range, trip and odometer on one screen, laid out to be read at a glance rather than studied at a red light.",
              media: {
                src: "/images/nduro/nduro-vehicle-design-01.webp",
                alt: "Lectrix NDuro handlebar and colour segmented instrument display seen from the rider's seat",
                width: 1366,
                height: 768,
                fullBleed: true,
              },
            },
            {
              id: "usb-charging",
              title: "USB charging port",
              description:
                "A charging point behind the front apron, so the phone you are navigating with arrives with the same charge it set off with.",
              media: {
                src: "/images/nduro/nduro-vehicle-design-02.webp",
                alt: "Close-up of the Lectrix NDuro front apron showing the USB charging port and ignition barrel",
                width: 1366,
                height: 768,
                fullBleed: true,
              },
            },
          ],
        },
        {
          kind: "cards",
          id: "design-secondary",
          columns: 3,
          ratio: "portrait",
          items: [
            {
              id: "longer-seat",
              title: "Longer seat",
              description:
                "Length enough that a pillion is a passenger rather than an afterthought, and that a tall rider is not perched on the nose of the saddle.",
              media: {
                src: "/images/nduro/nduro-vehicle-design-03.webp",
                alt: "Side view of the Lectrix NDuro rear section showing the full length of the seat",
                width: 640,
                height: 768,
              },
            },
            {
              id: "power-modes",
              title: "Power modes",
              statKey: "ridingModes",
              description:
                "Switch on the move between saving charge, riding normally and asking for everything the motor has.",
              media: {
                src: "/images/nduro/nduro-vehicle-design-04.webp",
                alt: "Lectrix NDuro instrument cluster and handlebar switchgear including the ride mode selector",
                width: 640,
                height: 768,
              },
            },
            {
              id: "crash-guard",
              title: "Crash guard",
              description:
                "A guard rail along the lower body to take the first contact in a tip-over, protecting both the panels and the rider's leg.",
              media: {
                src: "/images/nduro/nduro-vehicle-design-05.webp",
                alt: "Lower bodywork of the Lectrix NDuro showing the crash guard rail alongside the footboard",
                width: 400,
                height: 480,
              },
            },
          ],
        },
      ],
    },

    {
      id: "vehicle-colors",
      navLabel: "Vehicle Colors",
      eyebrow: "Vivid colours",
      title: "Choose your NDuro",
      description:
        "Four finishes. Which of them is on our floor this week depends on stock — call ahead if you have decided on one.",
      blocks: [{ kind: "colors", id: "colors" }],
    },

    {
      id: "smart-features",
      navLabel: "Smart Features",
      eyebrow: "Explore features",
      title: "What the Lectrix EV app adds",
      description:
        "Pair the NDuro with your phone and the scooter stops being something you only interact with while sitting on it.",
      blocks: [
        {
          kind: "smart-features",
          id: "app-features",
          items: [
            {
              id: "mobile-app",
              title: "Mobile app connectivity",
              description:
                "Charge level, ride history, parked status and trip planning, all from the phone already in your pocket.",
              media: {
                src: "/images/nduro/nduro-features-01.webp",
                alt: "Hand holding a phone showing the Lectrix EV app home screen with battery level and vehicle status",
                width: 864,
                height: 768,
              },
            },
            {
              id: "geo-fencing",
              title: "Geo fencing",
              description:
                "Draw a boundary on the map and be told when the scooter crosses it — useful when someone else rides it more often than you do.",
              media: {
                src: "/images/nduro/nduro-features-02.webp",
                alt: "Hand holding a phone showing the Lectrix EV app geofence boundary settings",
                width: 864,
                height: 768,
              },
            },
            {
              id: "navigation",
              title: "Navigation assist",
              description:
                "Turn-by-turn guidance planned in the app, so you are not stopping at every junction to check a map.",
              media: {
                src: "/images/nduro/nduro-features-03.webp",
                alt: "Hand holding a phone showing turn-by-turn navigation in the Lectrix EV app",
                width: 864,
                height: 768,
              },
            },
          ],
        },
        {
          kind: "cards",
          id: "tracking-cards",
          columns: 2,
          ratio: "landscape",
          items: [
            {
              id: "live-location",
              title: "Live location",
              description:
                "Where the scooter is, right now, whether it is parked outside or halfway across the city with someone else on it.",
              media: {
                src: "/images/nduro/nduro-live-location.webp",
                alt: "Map view in the Lectrix EV app tracking a scooter's live location",
                width: 1097,
                height: 768,
              },
            },
            {
              id: "easy-locate",
              title: "Easy locate",
              description:
                "Find it again in a full market car park without walking every row twice.",
              media: {
                src: "/images/nduro/nduro-easy-locate.webp",
                alt: "Lectrix EV app showing a parked NDuro pinned on a map",
                width: 1097,
                height: 768,
              },
            },
          ],
        },
        {
          kind: "stat-cards",
          id: "safety-app-cards",
          items: [
            {
              id: "sos",
              icon: "shield",
              title: "SOS alert",
              description:
                "One tap sends an automated message with your location to the emergency contacts you have saved.",
            },
            {
              id: "anti-theft",
              icon: "gauge",
              title: "Anti-theft alerts",
              description:
                "Movement the app does not expect gets flagged to your phone rather than discovered the next morning.",
            },
          ],
        },
      ],
    },

    {
      id: "convenience",
      navLabel: "Convenience",
      eyebrow: "Convenience",
      title: "The things you notice on day two hundred",
      description:
        "Not the specifications that sell a scooter, but the ones that decide whether you still like it a year in.",
      blocks: [
        {
          kind: "banner",
          id: "led-headlamp",
          title: "LED headlamp",
          caption:
            "A wider, whiter spread of light for the unlit stretch between the main road and your gate.",
          media: {
            src: "/images/nduro/nduro-led-headlamp.webp",
            alt: "Close-up of the Lectrix NDuro LED headlamp set into the red front bodywork",
            width: 1366,
            height: 768,
            fullBleed: true,
          },
          // The render leaves the left of the frame empty and white, so the
          // copy goes there in dark ink rather than fighting the bodywork.
          layout: "overlay",
          align: "start",
          copyTone: "dark",
        },
        {
          kind: "banner",
          id: "reverse-mode",
          title: "Reverse mode",
          caption:
            "One switch and the scooter backs itself out of a tight parking spot, with no walking it backwards uphill.",
          media: {
            src: "/images/nduro/nduro-reverse-mode.webp",
            alt: "Front three-quarter view of the Lectrix NDuro in Solar Red",
            width: 1366,
            height: 768,
            fullBleed: true,
          },
          // A whole scooter, centred: there is no clear side to write on, so
          // the copy takes its own panel rather than sitting on the vehicle.
          layout: "split",
          align: "start",
        },
        {
          kind: "stat-cards",
          id: "convenience-stats",
          items: [
            {
              id: "gradeability",
              icon: "mountain",
              title: "Gradeability",
              statKey: "gradeability",
              description:
                "The steepest slope the NDuro is rated to climb — the number that matters on a flyover approach or a basement ramp with a pillion aboard.",
            },
            {
              id: "ip-rating",
              icon: "droplets",
              title: "Motor ingress protection",
              statKey: "ipRating",
              description:
                "Rated against dust and water ingress, and tested by Lectrix EV through 300 mm of water wading at the Natrax facility.",
            },
          ],
        },
      ],
      disclaimer:
        "Gradeability and the water-wading test are manufacturer figures measured under controlled test conditions. They describe what the vehicle is rated for, not an instruction to ride through standing water.",
    },
  ],
};
