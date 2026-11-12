"use client";

import { useManualStore } from "@/app/stores/manual-bill";
import {
  calculatePerPerson,
  formatMoney,
  sanitizeAmount,
  tipFromPercent,
  toAmount,
} from "@/app/lib/split";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const TIP_PERCENTS = [15, 18, 20];

export default function BillDetailsPage() {
  const router = useRouter();

  const description = useManualStore((state) => state.description);
  const subtotal = useManualStore((state) => state.subtotal);
  const tax = useManualStore((state) => state.tax);
  const tip = useManualStore((state) => state.tip);
  const guestCount = useManualStore((state) => state.guestCount);
  const setDescription = useManualStore((state) => state.setDescription);
  const setSubtotal = useManualStore((state) => state.setSubtotal);
  const setTax = useManualStore((state) => state.setTax);
  const setTip = useManualStore((state) => state.setTip);
  const setGuestCount = useManualStore((state) => state.setGuestCount);
  const hasHydrated = useManualStore((state) => state.hasHydrated);

  const [userInput, setUserInput] = useState({
    description: "",
    subtotal: "",
    tax: "",
    tip: "",
  });
  // When a % is selected the tip is derived from the subtotal, so editing
  // the subtotal afterwards keeps the tip in sync.
  const [tipPercent, setTipPercent] = useState<number | null>(null);
  const [people, setPeople] = useState(2);
  const tipInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (hasHydrated) {
      setUserInput({
        description,
        subtotal: subtotal === 0 ? "" : String(subtotal),
        tax: tax === 0 ? "" : String(tax),
        tip: tip === 0 ? "" : String(tip),
      });
      setPeople(Math.max(1, guestCount));
    }
    // Only seed local state once, after the persisted store loads.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasHydrated]);

  if (!hasHydrated) {
    return null;
  }

  const subtotalValue = toAmount(userInput.subtotal);
  const taxValue = toAmount(userInput.tax);
  const tipValue =
    tipPercent !== null
      ? tipFromPercent(subtotalValue, tipPercent)
      : toAmount(userInput.tip);
  const total = subtotalValue + taxValue + tipValue;
  const perPerson = calculatePerPerson(subtotalValue, tipValue, taxValue, people);
  const canContinue = subtotalValue > 0;

  const handleContinue = () => {
    if (!canContinue) return;
    setDescription(userInput.description.trim());
    setSubtotal(subtotalValue);
    setTax(taxValue);
    setTip(tipValue);
    setGuestCount(people);
    router.push("/add-expenses/manual/summary");
  };

  const handleCustomTip = () => {
    setTipPercent(null);
    setUserInput((prev) => ({
      ...prev,
      tip: tipValue === 0 ? "" : String(tipValue),
    }));
    tipInputRef.current?.focus();
  };

  const pillClass = (active: boolean) =>
    `flex-1 rounded-control py-2.5 text-base font-semibold transition ${
      active
        ? "bg-primary text-primary-foreground"
        : "bg-accent text-accent-foreground"
    }`;

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="shrink-0 px-5 pt-2">
        <h1 className="text-2xl">Bill details</h1>
        <p className="mt-1 text-base text-muted-foreground">Step 1 of 2</p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4">
        <div className="flex flex-col items-center py-6">
          <label
            htmlFor="subtotal-id"
            className="text-sm font-medium text-muted-foreground"
          >
            Subtotal
          </label>
          <div className="mt-1 flex items-center">
            <span className="text-[28px] font-semibold text-foreground">$</span>
            <input
              id="subtotal-id"
              type="text"
              inputMode="decimal"
              autoFocus
              value={userInput.subtotal}
              onChange={(e) =>
                setUserInput({
                  ...userInput,
                  subtotal: sanitizeAmount(e.target.value),
                })
              }
              placeholder="0.00"
              className="w-44 border-none bg-transparent text-center text-[40px] font-semibold text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <label
              htmlFor="desc-id"
              className="mb-2 block text-sm font-semibold uppercase tracking-wide text-muted-foreground"
            >
              Description
            </label>
            <input
              id="desc-id"
              type="text"
              value={userInput.description}
              onChange={(e) =>
                setUserInput({ ...userInput, description: e.target.value })
              }
              placeholder="e.g. Friday dinner"
              className="w-full rounded-control border border-border bg-card px-4 py-3 text-base text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>

          <div>
            <label
              htmlFor="tax-id"
              className="mb-2 block text-sm font-semibold uppercase tracking-wide text-muted-foreground"
            >
              Tax
            </label>
            <div className="flex items-center rounded-control border border-border bg-card px-4 py-3">
              <span className="text-base text-muted-foreground">$</span>
              <input
                id="tax-id"
                type="text"
                inputMode="decimal"
                value={userInput.tax}
                onChange={(e) =>
                  setUserInput({
                    ...userInput,
                    tax: sanitizeAmount(e.target.value),
                  })
                }
                placeholder="0.00"
                className="ml-1 flex-1 border-none bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="tip-id"
              className="mb-2 block text-sm font-semibold uppercase tracking-wide text-muted-foreground"
            >
              Tip
            </label>
            <div className="flex gap-2">
              {TIP_PERCENTS.map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => setTipPercent(pct)}
                  className={pillClass(tipPercent === pct)}
                >
                  {pct}%
                </button>
              ))}
              <button
                type="button"
                onClick={handleCustomTip}
                className={pillClass(tipPercent === null && userInput.tip !== "")}
              >
                Custom
              </button>
            </div>
            <div className="mt-2 flex items-center rounded-control border border-border bg-card px-4 py-3">
              <span className="text-base text-muted-foreground">$</span>
              <input
                id="tip-id"
                ref={tipInputRef}
                type="text"
                inputMode="decimal"
                value={
                  tipPercent !== null
                    ? subtotalValue > 0
                      ? tipValue.toFixed(2)
                      : ""
                    : userInput.tip
                }
                onChange={(e) => {
                  setTipPercent(null);
                  setUserInput({
                    ...userInput,
                    tip: sanitizeAmount(e.target.value),
                  });
                }}
                placeholder={
                  tipPercent !== null ? "Enter a subtotal first" : "0.00"
                }
                className="ml-1 flex-1 border-none bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div>
            <p className="mb-2 block text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Splitting between
            </p>
            <div className="flex items-center justify-between rounded-control border border-border bg-card px-3 py-2">
              <button
                type="button"
                aria-label="Fewer people"
                disabled={people <= 1}
                onClick={() => setPeople((p) => Math.max(1, p - 1))}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-muted-foreground disabled:opacity-40"
              >
                <IconMinus size={18} stroke={1.75} />
              </button>
              <span className="tabular-amount text-xl text-foreground">
                {people} {people === 1 ? "person" : "people"}
              </span>
              <button
                type="button"
                aria-label="More people"
                onClick={() => setPeople((p) => p + 1)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground"
              >
                <IconPlus size={18} stroke={1.75} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="shrink-0 border-t border-border bg-background px-5 pb-8 pt-4">
        <div className="mb-3 flex items-end justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Each person pays</p>
            <p className="tabular-amount text-[28px] leading-tight text-foreground">
              {formatMoney(perPerson)}
            </p>
          </div>
          <p className="tabular-amount text-sm text-muted-foreground">
            Total {formatMoney(total)}
          </p>
        </div>
        <button
          className="w-full rounded-control bg-primary py-3.5 text-base font-semibold text-primary-foreground disabled:opacity-50"
          disabled={!canContinue}
          onClick={handleContinue}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
