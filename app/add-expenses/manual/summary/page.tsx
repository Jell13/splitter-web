"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import { toast } from "sonner";
import { useManualStore } from "@/app/stores/manual-bill";
import { copyToClipboard, formatMoney, roundToCents } from "@/app/lib/split";

export default function ManualSummary() {
  const router = useRouter();

  const subtotal = useManualStore((state) => state.subtotal);
  const tax = useManualStore((state) => state.tax);
  const tip = useManualStore((state) => state.tip);
  const guestCount = useManualStore((state) => state.guestCount);
  const description = useManualStore((state) => state.description);
  const hasHydrated = useManualStore((state) => state.hasHydrated);
  const reset = useManualStore((state) => state.reset);

  const [justCopied, setJustCopied] = useState(false);

  if (!hasHydrated) return null;

  const people = Math.max(1, guestCount);
  const total = subtotal + tax + tip;
  // Round so the shares add up to the exact total: when it doesn't divide
  // evenly, a few people cover the leftover cent(s).
  const shares = roundToCents(Array(people).fill(total / people));
  const perPerson = Math.min(...shares);
  const extraCentPeople = shares.filter((s) => s > perPerson).length;
  const remainderNote =
    extraCentPeople > 0
      ? `${extraCentPeople} ${extraCentPeople === 1 ? "person pays" : "people pay"} ${formatMoney(perPerson + 0.01)} to cover the odd cent`
      : null;

  const buildShareText = () =>
    [
      description
        ? `${description} — Total: ${formatMoney(total)}`
        : `Total: ${formatMoney(total)}`,
      `Split ${people} ways: ${formatMoney(perPerson)} each`,
      ...(remainderNote ? [remainderNote] : []),
      "",
      `Subtotal ${formatMoney(subtotal)} · Tax ${formatMoney(tax)} · Tip ${formatMoney(tip)}`,
    ].join("\n");

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
            <p className="mt-1 text-base text-muted-foreground">{description}</p>
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

        <div className="mt-6 flex flex-col gap-4">
          <div className="rounded-card bg-primary px-5 py-5 text-center">
            <p className="text-sm font-medium text-primary-foreground/80">
              Each person owes
            </p>
            <p className="tabular-amount mt-1 text-[36px] leading-tight text-primary-foreground">
              {formatMoney(perPerson)}
            </p>
            <p className="mt-1 text-sm text-primary-foreground/80">
              Split evenly between {people} {people === 1 ? "person" : "people"}
            </p>
            {remainderNote && (
              <p className="mt-1 text-xs text-primary-foreground/80">
                {remainderNote}
              </p>
            )}
          </div>

          <div className="rounded-card bg-card p-4">
            {[
              ["Subtotal", subtotal],
              ["Tax", tax],
              ["Tip", tip],
            ].map(([label, value], i) => (
              <div
                key={label as string}
                className={`flex items-center justify-between py-2 ${i > 0 ? "border-t border-border" : ""}`}
              >
                <span className="text-base text-muted-foreground">{label}</span>
                <span className="tabular-amount text-base text-foreground">
                  {formatMoney(value as number)}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between border-t border-border pt-2">
              <span className="text-base font-semibold text-foreground">Total</span>
              <span className="tabular-amount text-base font-semibold text-foreground">
                {formatMoney(total)}
              </span>
            </div>
          </div>
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
