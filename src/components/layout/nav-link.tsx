"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

interface NavLinkProps extends React.ComponentProps<typeof Link> {
  href: string;
  /** Also mark active for nested routes, e.g. /electric-scooters/nduro. */
  matchNested?: boolean;
  activeClassName?: string;
}

/**
 * Navigation link that flags the current section for both sighted users
 * (underline) and assistive tech (`aria-current`).
 */
export function NavLink({
  href,
  className,
  activeClassName,
  matchNested = true,
  children,
  ...props
}: NavLinkProps) {
  const pathname = usePathname();
  const isActive =
    pathname === href || (matchNested && href !== "/" && pathname.startsWith(`${href}/`));

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      data-active={isActive || undefined}
      className={cn(className, isActive && activeClassName)}
      {...props}
    >
      {children}
    </Link>
  );
}
