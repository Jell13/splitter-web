"use client";

import { useRouter } from "next/navigation";
import { useConvexAuth } from "convex/react";
import { usePhotoStore } from "@/app/stores/photo-upload";

export default function FinalReviewPage() {
  const router = useRouter();
  // const { isAuthenticated } = useConvexAuth();

  const subtotal = usePhotoStore((state) => state.subtotal);
  const items = usePhotoStore((state) => state.items);
  const participants = usePhotoStore((state) => state.participants);
  const tax = usePhotoStore((state) => state.tax);
  const tip = usePhotoStore((state) => state.tip);

  const reset = usePhotoStore((state) => state.reset);

  const personSubtotal: Record<string, number> = {};
  participants.forEach((person) => (personSubtotal[person.localId] = 0));

  items.forEach((item) => {
    const assignedCount = item.assignedUserIds.length;
    if (assignedCount === 0) return;
    const perPersonPrice = item.price / assignedCount;
    item.assignedUserIds.forEach((localId) => {
      personSubtotal[localId] =
        (personSubtotal[localId] || 0) + perPersonPrice;
    });
  });

  const shared = participants.map((p) => {
    const perPersonTotal = personSubtotal[p.localId];
    const proportionalTaxTip = (perPersonTotal / subtotal) * (tax + tip);
    return {
      ...p,
      amount: perPersonTotal + proportionalTaxTip,
    };
  });

  const handleConfirm = async () => {
    // if (isAuthenticated) {
    // TODO: call your create-split mutation here — receiptImageId,
    // items, and resolved participant shares (turning each
    // participant's localId into a real Convex user id, creating
    // lightweight guest users for anyone who isn't isSelf/existing).
    // }
    // Guests skip the mutation entirely — nothing gets persisted
    // except the receipt image, which was already saved on upload.
    router.push("/add-expenses/photo/summary");
  };

  const total = subtotal + tax + tip;

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="shrink-0 px-5 pt-2">
        <h1 className="text-xl">Final review</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here's how it breaks down
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 pt-6">
        <div className="flex flex-col gap-4">
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
            {shared.map((person, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-card bg-card px-4 py-3"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
                  {person.initials}
                </span>
                <span className="flex-1 text-base text-foreground">
                  {person.name}
                </span>
                <span className="tabular-amount text-base font-semibold text-foreground">
                  ${person.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="shrink-0 px-5 pb-8 pt-6">
        <button
          onClick={handleConfirm}
          className="w-full rounded-control bg-primary py-3.5 text-base font-semibold text-primary-foreground"
        >
          Confirm
        </button>
      </div>
    </div>
  );
}