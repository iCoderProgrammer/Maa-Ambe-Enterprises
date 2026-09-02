import Image from "next/image";
import { Briefcase, MapPin } from "lucide-react";

import { MediaPlaceholder } from "@/components/common/media-placeholder";
import { cn } from "@/lib/utils";
import { getBranchById } from "@/data/branches";
import type { TeamMember } from "@/data/team";

/**
 * One person.
 *
 * Everything is optional except the name, the designation and the role,
 * because those are the three things a dealership always knows. A missing
 * photo becomes a labelled placeholder of identical proportions, a missing bio
 * or experience figure simply does not render — the card never pads itself with
 * invented detail to look complete.
 */
export function TeamCard({
  member,
  className,
}: {
  member: TeamMember;
  className?: string;
}) {
  const branch = member.branchId ? getBranchById(member.branchId) : undefined;

  return (
    <article
      className={cn(
        "border-hairline group bg-card flex flex-col overflow-hidden rounded-2xl border transition-shadow duration-300 ease-(--ease-out-brand) hover:shadow-lg",
        className
      )}
    >
      <div className="bg-surface-muted relative">
        {member.photo ? (
          /* Portraits carry their intrinsic size in the data, so the optimizer
             can serve AVIF/WebP at the width a card actually occupies. `sizes`
             mirrors the grid below: three columns on desktop, two on tablets,
             one on a phone. */
          <Image
            src={member.photo.src}
            alt={member.photo.alt}
            width={member.photo.width}
            height={member.photo.height}
            sizes="(min-width: 1024px) 22rem, (min-width: 640px) 45vw, 90vw"
            className="aspect-4/5 w-full object-cover transition-transform duration-500 ease-(--ease-out-brand) group-hover:scale-[1.03]"
          />
        ) : (
          <MediaPlaceholder
            label={`${member.name} — portrait`}
            ratio="aspect-4/5"
            className="rounded-none"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="font-display text-base font-semibold text-pretty">
          {member.name}
        </h3>
        <p className="text-brand-700 dark:text-brand-400 mt-1 text-sm font-medium text-pretty">
          {member.designation}
        </p>
        <p className="text-muted-foreground mt-2 text-sm text-pretty">{member.role}</p>

        {member.bio ? (
          <p className="text-muted-foreground mt-4 text-sm leading-relaxed text-pretty">
            {member.bio}
          </p>
        ) : null}

        {member.experience != null || branch ? (
          <dl className="border-hairline text-muted-foreground mt-5 space-y-2 border-t pt-4 text-xs">
            {member.experience != null ? (
              <div className="flex items-center gap-2">
                <dt className="sr-only">Experience</dt>
                <Briefcase aria-hidden className="text-brand-600 size-3.5 shrink-0" />
                <dd>
                  {member.experience} {member.experience === 1 ? "year" : "years"} in the
                  trade
                </dd>
              </div>
            ) : null}

            {branch ? (
              <div className="flex items-center gap-2">
                <dt className="sr-only">Showroom</dt>
                <MapPin aria-hidden className="text-brand-600 size-3.5 shrink-0" />
                <dd>{branch.branchName}</dd>
              </div>
            ) : null}
          </dl>
        ) : null}

        {member.socialLinks.length > 0 ? (
          <ul className="mt-5 flex list-none flex-wrap gap-x-4 gap-y-2">
            {member.socialLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground text-xs transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  );
}
