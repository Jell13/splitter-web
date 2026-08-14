"use client"

import { useManualStore } from "@/app/stores/manual-bill";

const participants = [
  { id: "you", initials: "AL" },
  { id: "jm", initials: "JM" },
  { id: "sk", initials: "SK" },
  { id: "tl", initials: "TL" },
];

export default function ManualReview() {

  const subtotal = useManualStore((state) => state.subtotal);
  const tax = useManualStore((state) => state.tax);
  const tip = useManualStore((state) => state.tip);

  const guestCount = useManualStore((state) => state.guestCount);

  const total = subtotal + tax + tip;
  const perPerson = total / guestCount;
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="px-5 pt-2">
        <h1 className="text-[18px]">Review bill</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">
          Step 3 of 4
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-4 px-5 pt-6">
        <div className="rounded-card bg-card p-4">
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-muted-foreground">Subtotal</span>
            <span className="tabular-amount text-sm text-foreground">
              ${subtotal}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-border py-2">
            <span className="text-sm text-muted-foreground">Tax</span>
            <span className="tabular-amount text-sm text-foreground">
              ${tax}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-border py-2">
            <span className="text-sm text-muted-foreground">Tip</span>
            <span className="tabular-amount text-sm text-foreground">
              ${tip}
            </span>
          </div>
        </div>

        <div className="rounded-card bg-primary px-5 py-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-primary-foreground/80">
              Total
            </span>
            <span className="tabular-amount text-[26px] text-primary-foreground">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="rounded-card bg-card p-4 text-center">
          <p className="text-sm text-foreground">
            Split evenly among <span className="font-semibold">{guestCount}</span>{" "}
            {guestCount === 1 ? "person" : "people"}
          </p>
          <p className="tabular-amount mt-1 text-xs text-muted-foreground">
            ${perPerson.toFixed(2)} each
          </p>
        </div>
      </div>

      <div className="px-5 pb-8 pt-6">
        <button className="w-full rounded-control bg-primary py-3.5 text-sm font-semibold text-primary-foreground">
          Confirm
        </button>
      </div>
    </div>
  );
}