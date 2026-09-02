import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

import { Container } from "@/components/common/container";
import { Logo } from "@/components/common/logo";
import { footerNav } from "@/config/navigation";
import {
  dealership,
  formatAddress,
  groupedOpeningHours,
  telUrl,
} from "@/data/dealership";

const shortDay = (day: string) => day.slice(0, 3);

/** Global footer. Fully static — every value comes from the dealership config. */
export function Footer() {
  const hours = groupedOpeningHours();

  return (
    <footer className="bg-surface-inverse text-on-inverse mt-auto">
      <Container className="py-14 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div className="max-w-sm">
            <Logo tone="inverse" />
            <p className="text-on-inverse-muted mt-5 text-sm leading-relaxed">
              {dealership.description}
            </p>

            <address className="mt-7 space-y-3 text-sm not-italic">
              <div className="flex gap-3">
                <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-brand-400" />
                <span className="text-on-inverse-muted">{formatAddress()}</span>
              </div>
              <div className="flex gap-3">
                <Phone aria-hidden className="mt-0.5 size-4 shrink-0 text-brand-400" />
                <a
                  href={telUrl()}
                  className="hover:text-on-inverse text-on-inverse-muted transition-colors"
                >
                  {dealership.phoneDisplay}
                </a>
              </div>
              <div className="flex gap-3">
                <Mail aria-hidden className="mt-0.5 size-4 shrink-0 text-brand-400" />
                <a
                  href={`mailto:${dealership.email}`}
                  className="hover:text-on-inverse text-on-inverse-muted transition-colors"
                >
                  {dealership.email}
                </a>
              </div>
              <div className="flex gap-3">
                <Clock aria-hidden className="mt-0.5 size-4 shrink-0 text-brand-400" />
                <ul className="text-on-inverse-muted space-y-1">
                  {hours.map((group) => (
                    <li key={group.days.join("-")}>
                      {shortDay(group.days[0])}
                      {group.days.length > 1 ? ` – ${shortDay(group.days.at(-1)!)}` : ""}
                      {": "}
                      {group.opens && group.closes
                        ? `${group.opens} – ${group.closes}`
                        : "Closed"}
                    </li>
                  ))}
                </ul>
              </div>
            </address>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            {footerNav.map((group) => (
              <nav key={group.title} aria-labelledby={`footer-${group.title}`}>
                <h2
                  id={`footer-${group.title}`}
                  className="text-eyebrow text-on-inverse uppercase"
                >
                  {group.title}
                </h2>
                <ul className="mt-5 space-y-3">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-on-inverse-muted hover:text-on-inverse text-sm transition-colors"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-5 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-on-inverse-muted text-xs">
            © {new Date().getFullYear()} {dealership.legalName}. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {dealership.socialLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-on-inverse-muted hover:text-on-inverse text-xs transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-on-inverse-muted/70 mt-6 text-[0.6875rem] leading-relaxed">
          Lectrix EV is a registered trademark of its respective owner. Specifications,
          prices, colours and features shown on this website are indicative and may vary
          by variant, city and applicable offers. Please confirm current details with the
          showroom before purchase.
        </p>
      </Container>
    </footer>
  );
}
