import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/common/container";
import { Logo } from "@/components/common/logo";
import { HeaderChrome } from "@/components/layout/header-chrome";
import { MobileNav } from "@/components/layout/mobile-nav";
import { NavLink } from "@/components/layout/nav-link";
import { primaryNav } from "@/config/navigation";

/**
 * Global header. Server-rendered; only the sticky chrome, the active-link
 * state and the drawer ship JavaScript.
 *
 * WIDTH BUDGET — the reason the bar is laid out the way it is.
 *
 * `Container` caps content at 78rem minus 40px gutters, so the row never gets
 * more than ~1168px however wide the window is. Against that: the brand lockup
 * takes ~250px, the test-ride CTA ~150px, and the gaps ~48px, leaving roughly
 * 720px for eight navigation labels. They fit at 13px with `px-2`, and only
 * just — which is why there is no phone number in this row. Calling is offered
 * by the mobile action bar under 768px, the WhatsApp button above it, the
 * footer, and an explicit "Call" button on every page that asks for a decision.
 *
 * Below `xl` those eight labels cannot fit at all (a 1024px window has ~944px
 * of content width, ~500px of it spoken for), so the drawer takes over there
 * rather than a bar that overlaps itself.
 */
export function Header() {
  return (
    <HeaderChrome>
      <Container className="flex h-16 items-center justify-between gap-6 lg:h-20">
        <Logo />

        <nav aria-label="Main" className="hidden min-w-0 xl:block">
          <ul className="flex items-center gap-0.5">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <NavLink
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground data-active:text-foreground relative rounded-md px-2 py-2 text-[0.8125rem] font-medium whitespace-nowrap transition-colors after:absolute after:inset-x-2 after:-bottom-0.5 after:h-px after:scale-x-0 after:bg-brand-600 after:transition-transform after:duration-300 after:ease-(--ease-out-brand) data-active:after:scale-x-100"
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Button asChild variant="brand" size="default" className="hidden sm:inline-flex">
            <Link href="/book-test-ride">Book Test Ride</Link>
          </Button>

          <MobileNav />
        </div>
      </Container>
    </HeaderChrome>
  );
}
