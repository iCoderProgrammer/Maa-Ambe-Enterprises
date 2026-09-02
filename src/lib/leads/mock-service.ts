import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

import type { Lead, LeadInput, LeadResult } from "@/types/lead";
import { createReference, type LeadService } from "@/lib/leads/lead-service";

/**
 * Development-safe persistence.
 *
 * Writes to a gitignored JSON file so leads captured while building are
 * inspectable, and falls back to memory when the filesystem is read-only —
 * which is the normal case on serverless hosting. Either way a submission
 * never fails because there is no CRM connected yet.
 *
 * A lead is somebody's phone number, so even a mock store should not lose one
 * quietly. Three rules follow from that:
 *
 *   - Writes are atomic (temp file, then rename), so a crash or a redeploy
 *     mid-write cannot leave a half-written file behind.
 *   - A file that will not parse is moved aside rather than overwritten, so a
 *     corrupt read can never silently destroy the leads already captured.
 *   - Writes are serialised, so two submissions arriving together cannot
 *     read the same list and clobber each other.
 *
 * This is still explicitly NOT production storage: serialisation is per
 * process, so it holds for `next dev` and a single Node server but not across
 * serverless instances, and memory does not survive a restart. Replace it with
 * a real `LeadService` before launch.
 */

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "leads.json");
const TEMP_FILE = `${DATA_FILE}.tmp`;

let memory: Lead[] = [];
let fileWritable = true;

function isMissingFile(error: unknown): boolean {
  return (error as NodeJS.ErrnoException)?.code === "ENOENT";
}

/**
 * Moves an unreadable file out of the way, keeping its contents recoverable.
 * Returns whether it is now safe to write a fresh file in its place.
 */
async function quarantine(reason: string): Promise<boolean> {
  const target = `${DATA_FILE}.corrupt-${Date.now()}`;

  try {
    await rename(DATA_FILE, target);
    console.error(
      `[leads] ${reason} — moved to ${path.basename(target)} and starting a new file. ` +
        "Recover any leads from that file by hand."
    );
    return true;
  } catch (error) {
    // Could not move it, so we must not write over it either — that would
    // trade an unreadable file for a destroyed one.
    console.error(`[leads] ${reason}, and it could not be moved aside`, error);
    return false;
  }
}

/**
 * Reads the stored leads.
 *
 * A missing file means "no leads yet". Anything else — bad JSON, wrong shape,
 * a permissions error — means the file holds something we do not understand,
 * and the caller is told not to overwrite it.
 */
async function readAll(): Promise<{ leads: Lead[]; safeToWrite: boolean }> {
  if (!fileWritable) return { leads: memory, safeToWrite: true };

  let raw: string;

  try {
    raw = await readFile(DATA_FILE, "utf8");
  } catch (error) {
    if (isMissingFile(error)) return { leads: [], safeToWrite: true };
    console.error("[leads] could not read the lead file", error);
    return { leads: [], safeToWrite: false };
  }

  // A zero-byte file is what an interrupted write used to leave behind. Treat
  // it as empty rather than corrupt.
  if (raw.trim() === "") return { leads: [], safeToWrite: true };

  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    return { leads: [], safeToWrite: await quarantine("lead file is not valid JSON") };
  }

  if (!Array.isArray(parsed)) {
    return { leads: [], safeToWrite: await quarantine("lead file is not an array") };
  }

  return { leads: parsed as Lead[], safeToWrite: true };
}

/** Replaces the stored leads atomically, or keeps them in memory if it cannot. */
async function writeAll(leads: Lead[]): Promise<void> {
  try {
    await mkdir(DATA_DIR, { recursive: true });
    // Write then rename: a reader sees either the old file or the new one,
    // never a partial one.
    await writeFile(TEMP_FILE, JSON.stringify(leads, null, 2), "utf8");
    await rename(TEMP_FILE, DATA_FILE);
  } catch {
    // Read-only filesystem. Keep the lead in memory and stop trying to write,
    // so one failure does not cost every later submission a disk round-trip.
    fileWritable = false;
    memory = leads;
  }
}

/**
 * One writer at a time.
 *
 * `create` is read-modify-write, so two overlapping requests would otherwise
 * both read the same list and the second would overwrite the first's lead.
 */
let queue: Promise<unknown> = Promise.resolve();

function serialize<T>(task: () => Promise<T>): Promise<T> {
  const run = queue.then(task, task);
  // Swallow the outcome on the chain itself so one failed write does not
  // reject every submission queued behind it.
  queue = run.then(
    () => undefined,
    () => undefined
  );
  return run;
}

export class MockLeadService implements LeadService {
  async create(input: LeadInput): Promise<LeadResult> {
    const lead: Lead = {
      ...input,
      id: randomUUID(),
      reference: createReference(),
      status: "new",
      createdAt: new Date().toISOString(),
    };

    await serialize(async () => {
      const { leads, safeToWrite } = await readAll();

      if (!safeToWrite) {
        // The existing file is unreadable and could not be moved aside. Hold
        // the lead in memory rather than overwriting whatever is on disk.
        fileWritable = false;
        memory = [...memory, lead];
        return;
      }

      leads.push(lead);
      await writeAll(leads);
    });

    if (process.env.NODE_ENV !== "production") {
      // Names and numbers are the point of a lead, but they are still personal
      // data — log only what is useful for debugging the flow.
      console.info(
        `[leads] ${lead.type} captured — ${lead.reference}${lead.model ? ` (${lead.model})` : ""}`
      );
    }

    return { id: lead.id, reference: lead.reference };
  }

  async list(): Promise<Lead[]> {
    return (await readAll()).leads;
  }
}
