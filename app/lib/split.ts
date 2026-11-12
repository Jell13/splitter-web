import { Participant, ReceiptItems } from "./types";

export const calculatePerPerson = (
  subtotal: number,
  tip: number,
  tax: number,
  totalPeople: number,
) => {
  if (totalPeople <= 0) {
    throw new Error("must have more than 0 people");
  }
  const total = subtotal + tip + tax;
  return total / totalPeople;
};

/**
 * Cleans a money string as the user types: keeps digits and a single
 * decimal point, and at most two decimal places. "$12.5.3" -> "12.53".
 */
export function sanitizeAmount(raw: string): string {
  const cleaned = raw.replace(/[^\d.]/g, "");
  const [whole, ...rest] = cleaned.split(".");
  if (rest.length === 0) return whole;
  return `${whole}.${rest.join("").slice(0, 2)}`;
}

/** Turns a (sanitized) amount string into a number, treating junk as 0. */
export function toAmount(value: string | number): number {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : 0;
}

export function tipFromPercent(subtotal: number, percent: number): number {
  return Math.round(subtotal * percent) / 100;
}

export function formatMoney(value: number): string {
  return `$${value.toFixed(2)}`;
}

export function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

/**
 * Initials that don't clash with anyone already in the split, so "Sam" and
 * "Sara" don't both show up as "SA" in the avatar circles.
 */
export function uniqueInitials(name: string, taken: string[]): string {
  const used = new Set(taken.map((t) => t.toUpperCase()));
  const base = getInitials(name);
  if (!used.has(base)) return base;

  const letters = name.replace(/[^\p{L}\p{N}]/gu, "").toUpperCase();
  for (let i = 1; i < letters.length; i++) {
    const candidate = letters[0] + letters[i];
    if (!used.has(candidate)) return candidate;
  }
  for (let n = 2; ; n++) {
    const candidate = `${letters[0] ?? "?"}${n}`;
    if (!used.has(candidate)) return candidate;
  }
}

export interface PersonShare extends Participant {
  /** Sum of this person's portion of item prices, before tax/tip. */
  itemsSubtotal: number;
  /** What this person owes in total, rounded to cents. */
  amount: number;
}

export interface ItemSplitResult {
  shares: PersonShare[];
  unassignedTotal: number;
  unassignedCount: number;
}

/**
 * Splits itemized bills: each item is divided evenly among the people
 * assigned to it, and tax + tip are distributed in proportion to each
 * person's share of the item subtotal. Rounded amounts always add up to
 * the bill total when every item is assigned.
 */
export function computeItemShares(
  items: ReceiptItems[],
  participants: Participant[],
  tax: number,
  tip: number,
): ItemSplitResult {
  const itemsSubtotal: Record<string, number> = {};
  participants.forEach((p) => (itemsSubtotal[p.localId] = 0));

  let unassignedTotal = 0;
  let unassignedCount = 0;
  let billSubtotal = 0;

  for (const item of items) {
    billSubtotal += item.price;
    const assignees = item.assignedUserIds.filter(
      (id) => id in itemsSubtotal,
    );
    // A $0 item (comped/free) costs nobody anything, so it never blocks.
    if (assignees.length === 0 && item.price > 0) {
      unassignedTotal += item.price;
      unassignedCount += 1;
      continue;
    }
    if (assignees.length === 0) continue;
    const each = item.price / assignees.length;
    assignees.forEach((id) => (itemsSubtotal[id] += each));
  }

  const extras = tax + tip;
  const raw = participants.map((p) => {
    const sub = itemsSubtotal[p.localId];
    const share = billSubtotal > 0 ? (sub / billSubtotal) * extras : 0;
    return sub + share;
  });

  const rounded = roundToCents(raw);

  return {
    shares: participants.map((p, i) => ({
      ...p,
      itemsSubtotal: itemsSubtotal[p.localId],
      amount: rounded[i],
    })),
    unassignedTotal,
    unassignedCount,
  };
}

/**
 * Rounds each amount to cents so the rounded values still sum to the
 * rounded total (largest-remainder method) — no "missing penny".
 */
export function roundToCents(amounts: number[]): number[] {
  const cents = amounts.map((a) => a * 100);
  const floored = cents.map((c) => Math.floor(c + 1e-9));
  const target = Math.round(cents.reduce((s, c) => s + c, 0));
  let remaining = target - floored.reduce((s, c) => s + c, 0);

  const order = cents
    .map((c, i) => ({ i, frac: c - floored[i] }))
    .sort((a, b) => b.frac - a.frac);

  for (const { i } of order) {
    if (remaining <= 0) break;
    floored[i] += 1;
    remaining -= 1;
  }
  return floored.map((c) => c / 100);
}

/**
 * Copies text to the clipboard. Falls back to the legacy execCommand path
 * when the Clipboard API is missing or blocked — e.g. testing on a phone
 * over http://192.168.x.x, which isn't a secure context.
 */
export async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    return;
  } catch {
    // fall through to the legacy path
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  textarea.setSelectionRange(0, text.length);
  const ok = document.execCommand("copy");
  document.body.removeChild(textarea);
  if (!ok) throw new Error("Copy failed");
}
