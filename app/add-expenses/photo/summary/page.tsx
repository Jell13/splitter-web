"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import { usePhotoStore } from "@/app/stores/photo-upload";

export default function PhotoSummaryPage() {
  const router = useRouter();

  const description = usePhotoStore((state) => state.description);
  const subtotal = usePhotoStore((state) => state.subtotal);
  const tax = usePhotoStore((state) => state.tax);
  const tip = usePhotoStore((state) => state.tip);
  const items = usePhotoStore((state) => state.items);
  const participants = usePhotoStore((state) => state.participants);
  const reset = usePhotoStore((state) => state.reset);

  const [justCopied, setJustCopied] = useState(false);

  const total = subtotal + tax + tip;

  const personSubtotal: Record<string, number> = {};
  participants.forEach((person) => (personSubtotal[person.localId] = 0));

  items.forEach((item) => {
    const assignedCount = item.assignedUserIds.length;
    if (assignedCount === 0) return;
    const perPersonPrice = item.price / assignedCount;
    item.assignedUserIds.forEach((localId) => {
      personSubtotal[localId] = (personSubtotal[localId] || 0) + perPersonPrice;
    });
  });

  // Only show people other than yourself — you paid, they owe you.
  const shares = participants
    .filter((p) => !p.isSelf)
    .map((p) => {
      const perPersonTotal = personSubtotal[p.localId] || 0;
      const proportionalTaxTip =
        subtotal > 0 ? (perPersonTotal / subtotal) * (tax + tip) : 0;
      return {
        ...p,
        amount: perPersonTotal + proportionalTaxTip,
      };
    });

  function buildShareText() {
    const lines = [
      description
        ? `${description} — Total: $${total.toFixed(2)}`
        : `Total: $${total.toFixed(2)}`,
      "",
      "What everyone owes:",
      ...shares.map((p) => `${p.name}: $${p.amount.toFixed(2)}`),
    ];
    return lines.join("\n");
  }

  async function handleCopy() {
    const text = buildShareText();
    await navigator.clipboard.writeText(text);
    setJustCopied(true);
    setTimeout(() => setJustCopied(false), 2000);
  }

  const handleDone = () => {
    reset();
    router.push("/");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex flex-col items-center px-5 pt-8">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success-soft text-success-foreground">
          <IconCheck size={26} stroke={2} />
        </span>
        <p className="mt-4 text-lg font-semibold text-foreground">
          Split complete
        </p>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
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

      <div className="flex flex-col gap-4 px-5 pt-8">
        <div className="rounded-card bg-primary px-5 py-4">
          <div className="flex items-center justify-between">
            <span className="text-base font-medium text-primary-foreground/80">
              Total
            </span>
            <span className="tabular-amount text-[30px] text-primary-foreground">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {shares.map((person) => (
            <div
              key={person.localId}
              className="flex items-center gap-3 rounded-card bg-card px-4 py-3"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
                {person.initials}
              </span>
              <span className="flex-1 text-base text-foreground">
                {person.name}
              </span>
              <span className="tabular-amount rounded-full bg-success-soft px-3 py-1.5 text-sm text-success-foreground">
                ${person.amount.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto px-5 pb-8 pt-6">
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