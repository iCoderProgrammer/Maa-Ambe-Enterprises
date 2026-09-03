import Image from "next/image";
import { Quote } from "lucide-react";

import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { PendingData } from "@/components/common/pending-data";
import { MediaPlaceholder } from "@/components/common/media-placeholder";
import { Stagger, StaggerItem } from "@/components/common/motion";
import { TeamCard } from "@/components/team/team-card";
import {
  getFeaturedMember,
  getGroupedTeam,
  hasPlaceholderTeam,
  isTeamPending,
} from "@/data/team";
import { DEALERSHIP_NAME } from "@/lib/brand";

/**
 * "The People Behind Maa Ambey Enterprises".
 *
 * Three states, all driven by `src/data/team.ts`:
 *
 *  - No team configured — a short, honest note that the section is pending.
 *    Not a grid of stock silhouettes, and certainly not invented staff.
 *  - A featured person — rendered as a lead block with their message, since an
 *    owner's introduction carries more weight at full width than in a card.
 *  - Everyone else — grouped by category, two columns on tablets and three on
 *    desktop, single column on phones.
 */
export function TeamSection({
  tone = "default",
}: {
  tone?: "default" | "muted";
}) {
  const pending = isTeamPending();
  const scaffolded = hasPlaceholderTeam();
  const featured = getFeaturedMember();
  const groups = getGroupedTeam();

  return (
    /* `scroll-mt` because `/about#team` is linked from the footer of every
       other page. That is a real navigation, so the ROUTER performs the jump,
       and a router jump does not wait for `:target` to match — without an
       explicit margin the heading lands underneath the sticky header. */
    <Section id="team" tone={tone} className="scroll-mt-24">
      <SectionHeading
        eyebrow="Our team"
        title={`The people behind ${DEALERSHIP_NAME}`}
        description={`Buying an electric scooter is a conversation, not a transaction. These are the people at ${DEALERSHIP_NAME} who have it with you — and who you will deal with again at your first service.`}
      />

      {pending ? (
        <PendingData className="mt-10 max-w-2xl">
          Team profiles are being prepared. We would rather introduce you to the actual
          people at the showroom than fill this space with stock photographs — call or
          message us in the meantime and you will speak to one of them directly.
        </PendingData>
      ) : (
        <>
          {scaffolded ? (
            <PendingData className="mt-10 max-w-2xl">
              The profiles below are placeholders — bracketed names and generated
              portraits, standing in until real photographs and introductions are
              supplied. Nobody shown here exists.
            </PendingData>
          ) : null}

          {featured ? (
            <div className="border-hairline bg-surface-muted mt-10 grid gap-8 overflow-hidden rounded-2xl border sm:grid-cols-[minmax(0,18rem)_1fr] sm:gap-0">
              <div className="bg-background">
                {featured.photo ? (
                  /* Fixed 18rem column on tablets and up, full width below. */
                  <Image
                    src={featured.photo.src}
                    alt={featured.photo.alt}
                    width={featured.photo.width}
                    height={featured.photo.height}
                    sizes="(min-width: 640px) 18rem, 100vw"
                    className="aspect-4/5 h-full w-full object-cover"
                  />
                ) : (
                  <MediaPlaceholder
                    label={`${featured.name} — portrait`}
                    ratio="aspect-4/5"
                    className="h-full rounded-none"
                  />
                )}
              </div>

              <div className="flex flex-col justify-center p-6 sm:p-9">
                <p className="text-eyebrow text-brand-700 dark:text-brand-400 uppercase">
                  {featured.designation}
                </p>
                <h3 className="font-display mt-3 text-2xl font-semibold text-pretty">
                  {featured.name}
                </h3>

                {featured.bio ? (
                  <p className="text-muted-foreground mt-4 text-sm leading-relaxed text-pretty">
                    {featured.bio}
                  </p>
                ) : null}

                {featured.message ? (
                  <blockquote className="border-brand-600 mt-6 border-l-2 pl-5">
                    <Quote aria-hidden className="text-brand-600 size-4" />
                    <p className="mt-2 text-sm leading-relaxed text-pretty italic">
                      {featured.message}
                    </p>
                  </blockquote>
                ) : null}

                {featured.experience != null ? (
                  <p className="text-muted-foreground mt-6 text-xs">
                    {featured.experience}{" "}
                    {featured.experience === 1 ? "year" : "years"} in the trade
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}

          <div className="mt-14 space-y-14">
            {groups.map((group) => {
              // The featured person already has the block above; showing them
              // again in their category would read as a duplicate.
              const members = group.members.filter(
                (member) => member.id !== featured?.id
              );
              if (members.length === 0) return null;

              return (
                <div key={group.category.id}>
                  <h3 className="font-display text-lg font-semibold">
                    {group.category.label}
                  </h3>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {group.category.description}
                  </p>

                  <Stagger
                    as="ul"
                    className="mt-7 grid list-none gap-6 sm:grid-cols-2 lg:grid-cols-3"
                    stagger={0.06}
                  >
                    {members.map((member) => (
                      <StaggerItem as="li" key={member.id} className="flex">
                        <TeamCard member={member} className="w-full" />
                      </StaggerItem>
                    ))}
                  </Stagger>
                </div>
              );
            })}
          </div>
        </>
      )}
    </Section>
  );
}
