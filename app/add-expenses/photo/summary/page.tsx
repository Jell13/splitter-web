"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import { toast } from "sonner";
import { usePhotoStore } from "@/app/stores/photo-upload";
import { computeItemShares, copyToClipboard, formatMoney } from "@/app/lib/split";

export default function PhotoSummaryPage() {
  const router = useRouter();

  const description = usePhotoStore((state) => state.description);
  const tax = usePhotoStore((state) => state.tax);
  const tip = usePhotoStore((state) => state.tip);
  const items = usePhotoStore((state) => state.items);
  const participants = usePhotoStore((state) => state.participants);
  const hasHydrated = usePhotoStore((state) => state.hasHydrated);
  const reset = usePhotoStore((state) => state.reset);

  const [justCopied, setJustCopied] = useState(false);

  if (!hasHydrated) return null;

  const total = items.reduce((s, i) => s + i.price, 0) + tax + tip;
  const { shares } = computeItemShares(items, participants, tax, tip);
  // You first, then everyone else.
  const ordered = [...shares].sort(
    (a, b) => Number(!!b.isSelf) - Number(!!a.isSelf),
  );

  const itemsFor = (localId: string) =>
    items
      .filter((item) => item.assignedUserIds.includes(localId))
      .map((item) =>
        item.assignedUserIds.length > 1
          ? `${item.name} (1/${item.assignedUserIds.length})`
          : item.name,
      );

  function buildShareText() {
    const lines = [
      description
        ? `${description} — Total: ${formatMoney(total)}`
        : `Total: ${formatMoney(total)}`,
      "",
      ...ordered.map((p) => {
        const who = p.isSelf ? `${p.name} (you)` : p.name;
        const what = itemsFor(p.localId).join(", ");
        return `${who}: ${formatMoney(p.amount)}${what ? ` — ${what}` : ""}`;
      }),
    ];
    return lines.join("\n");
  }

  async function handleCopy() {
    try {
      await copyToClipboard(buildShareText());
      setJustCopied(true);
      setTimeout(() => setJustCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy — try again");
    }
  }

  const handleDone = () => {
    reset();
    router.push("/");
  };

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="min-h-0 flex-1 overflow-y-auto px-5">
        <div className="flex flex-col items-center pt-4 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success-soft text-success-foreground">
            <IconCheck size={26} stroke={2} />
          </span>
          <p className="mt-4 text-2xl font-semibold text-foreground">
            Split complete
          </p>
          {description && (
            <p className="mt-1 text-base text-muted-foreground">
              {description}
            </p>
          )}

          <button
            onClick={handleCopy}
            className="mt-4 flex items-center gap-2 rounded-control bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground"
          >
            {justCopied ? (
              <>
                <IconCheck size={16} stroke={2.25} className="text-success" />
                Copied to clipboard
              </>
            ) : (
              <>
                <IconCopy size={16} stroke={1.75} />
                Copy breakdown
              </>
            )}
          </button>
        </div>

        <div className="mt-6 flex flex-col gap-4 pb-4">
          <div className="rounded-card bg-primary px-5 py-4">
            <div className="flex items-center justify-between">
              <span className="text-base font-medium text-primary-foreground/80">
                Total
              </span>
              <span className="tabular-amount text-[30px] text-primary-foreground">
                {formatMoney(total)}
              </span>
            </div>
          </div>

          <ul className="flex flex-col gap-2">
            {ordered.map((person) => (
              <li
                key={person.localId}
                className="flex items-center gap-3 rounded-card bg-card px-4 py-3"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
                  {person.initials}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-base text-foreground">
                    {person.isSelf ? `${person.name} (you)` : person.name}
                  </span>
                  <span className="block truncate text-sm text-muted-foreground">
                    {itemsFor(person.localId).join(", ") || "Nothing"}
                  </span>
                </span>
                <span className="tabular-amount shrink-0 rounded-full bg-accent px-3 py-1.5 text-sm font-semibold text-accent-foreground">
                  {formatMoney(person.amount)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="shrink-0 px-5 pb-8 pt-4">
        <button
          onClick={handleDone}
          className="w-full rounded-control bg-primary py-3.5 text-base font-semibold text-primary-foreground"
        >
          Done
        </button>
      </div>
    </div>
  );
}
