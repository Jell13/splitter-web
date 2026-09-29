"use client";

import { IconCheck } from "@tabler/icons-react";
import { useManualStore } from "@/app/stores/manual-bill";
import { useRouter } from "next/navigation";

export default function ManualSummary() {

  const router = useRouter();

  const subtotal = useManualStore((state) => state.subtotal);
  const tax = useManualStore((state) => state.tax);
  const tip = useManualStore((state) => state.tip);
  const guestCount = useManualStore((state) => state.guestCount);
  const description = useManualStore((state) => state.description);
  const reset = useManualStore((state) => state.reset);

  const handleFinish = () => {
    reset();
    router.push("/")
  };

  const total = subtotal + tax + tip;
  const perPerson = total / guestCount;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="px-5 pt-2">
        <h1 className="text-2xl">Summary</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">Step 4 of 4</p>
      </div>

      <div className="flex flex-col items-center px-5 pt-8">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success-soft text-success-foreground">
          <IconCheck size={26} stroke={2} />
        </span>
        <p className="mt-4 text-2xl font-semibold text-foreground">
          Split complete
        </p>
        {description && (
          <p className="mt-1 text-2xl font-bold text-foreground">{description}</p>
        )}
      </div>

      <div className="flex flex-col gap-4 px-5 pt-8">
        <div className="rounded-card bg-primary px-5 py-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-primary-foreground/80">
              Total paid
            </span>
            <span className="tabular-amount text-[26px] text-primary-foreground">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="rounded-card bg-card p-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Each person owes
          </p>
          <p className="tabular-amount mt-1 text-[28px] text-foreground">
            ${perPerson.toFixed(2)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Split evenly among {guestCount}{" "}
            {guestCount === 1 ? "person" : "people"}
          </p>
        </div>

        <div className="rounded-card bg-card p-4">
          <div className="flex items-center justify-between py-1.5">
            <span className="text-xs text-muted-foreground">Subtotal</span>
            <span className="tabular-amount text-xs text-foreground">
              ${subtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-border py-1.5">
            <span className="text-xs text-muted-foreground">Tax</span>
            <span className="tabular-amount text-xs text-foreground">
              ${tax.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-border py-1.5">
            <span className="text-xs text-muted-foreground">Tip</span>
            <span className="tabular-amount text-xs text-foreground">
              ${tip.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-auto px-5 pb-8 pt-6">
        <button
          onClick={() => handleFinish()}
          className="w-full rounded-control bg-primary py-3.5 text-sm font-semibold text-primary-foreground"
        >
          Done
        </button>
      </div>
    </div>
  );
}