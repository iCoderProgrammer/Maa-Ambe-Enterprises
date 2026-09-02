export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  location: string;
  model: string;
  /** Never render a placeholder without labelling it as one. */
  isPlaceholder: boolean;
}

/**
 * PLACEHOLDER CONTENT.
 *
 * These are illustrative examples of the kind of review the section is designed
 * to display. They are not real customers and are labelled as samples in the
 * UI. Replace them with genuine, consented reviews before launch and set
 * `isPlaceholder: false` — the sample badge disappears automatically.
 */
export const testimonials: Testimonial[] = [
  {
    id: "sample-1",
    quote:
      "This is sample review text showing how a customer review will appear once real reviews are collected from the showroom.",
    author: "Customer name",
    location: "City",
    model: "Model",
    isPlaceholder: true,
  },
  {
    id: "sample-2",
    quote:
      "This is sample review text showing how a second customer review will appear in this section.",
    author: "Customer name",
    location: "City",
    model: "Model",
    isPlaceholder: true,
  },
  {
    id: "sample-3",
    quote:
      "This is sample review text showing how a third customer review will appear in this section.",
    author: "Customer name",
    location: "City",
    model: "Model",
    isPlaceholder: true,
  },
];

export const hasRealTestimonials = testimonials.some((item) => !item.isPlaceholder);
