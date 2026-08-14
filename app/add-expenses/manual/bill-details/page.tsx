"use client";
import { useManualStore } from "@/app/stores/manual-bill";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function BillDetailsPage() {
  const router = useRouter();
  const [selectedTip, setSelectedTip] = useState<number | null>(null);
  const [userInput, setUserInput] = useState<any>({
    description: "",
    subtotal: "",
    tip: "",
    tax: "",
  });

  const description = useManualStore((state) => state.description);
  const setDescription = useManualStore((state) => state.setDescription);

  const subtotal = useManualStore((state) => state.subtotal);
  const setSubtotal = useManualStore((state) => state.setSubtotal);

  const tax = useManualStore((state) => state.tax);
  const setTax = useManualStore((state) => state.setTax);

  const tip = useManualStore((state) => state.tip);
  const setTip = useManualStore((state) => state.setTip);

  const handleTipCalc = (percent: number) => {
    setSelectedTip(percent);
    const percentage = (subtotal * percent) / 100;
    console.log(percentage);

    setUserInput({ ...userInput, tip: percentage });
  };

  const tipButtonClass = (percent: number) =>
    `flex-1 rounded-control py-2.5 text-sm font-semibold ${
      selectedTip === percent
        ? "bg-primary text-primary-foreground"
        : "bg-accent text-accent-foreground"
    }`;

  const handleClick = () => {

    setSubtotal(Number(userInput.subtotal) || 0);
    setTip(Number(userInput.tip) || 0);
    setTax(Number(userInput.tax) || 0);
    setDescription(userInput.description || "")
    router.push("/add-expenses/manual/guest-count");
  };

  const total =
    Number(userInput.subtotal) + Number(userInput.tip) + Number(userInput.tax);
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="px-5 pt-2">
        <h1 className="text-[18px]">Bill details</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">Step 1 of 4</p>
      </div>

      <div className="flex flex-col gap-6 px-5 pt-6">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Description
          </label>
          <input
            type="text"
            value={userInput.description}
            onChange={(e) =>
              setUserInput({ ...userInput, description: e.target.value })
            }
            placeholder="Real Seafood Co."
            className="w-full rounded-control border border-border bg-card px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>

        <div className="flex flex-col items-center py-4">
          <span className="text-xs font-medium text-muted-foreground">
            Subtotal
          </span>
          <div className="mt-2 flex items-center">
            <span className="text-[26px] font-semibold text-foreground">$</span>
            <input
              type="text"
              value={userInput.subtotal}
              onChange={(e) =>
                setUserInput({ ...userInput, subtotal: e.target.value })
              }
              inputMode="decimal"
              placeholder="0.00"
              className="w-40 border-none bg-transparent text-center text-[38px] font-semibold text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Tax
          </label>
          <div className="flex items-center rounded-control border border-border bg-card px-4 py-3">
            <span className="text-sm text-foreground">$</span>
            <input
              type="text"
              value={userInput.tax}
              onChange={(e) =>
                setUserInput({ ...userInput, tax: e.target.value })
              }
              inputMode="decimal"
              placeholder="0.00"
              className="ml-1 flex-1 border-none bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Tip
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => handleTipCalc(15)}
              className={tipButtonClass(15)}
            >
              15%
            </button>
            <button
              onClick={() => handleTipCalc(18)}
              className={tipButtonClass(18)}
            >
              18%
            </button>
            <button
              onClick={() => handleTipCalc(20)}
              className={tipButtonClass(20)}
            >
              20%
            </button>
            <button className="flex-1 rounded-control bg-accent py-2.5 text-sm font-semibold text-accent-foreground">
              Custom
            </button>
          </div>
          <div className="mt-2 flex items-center rounded-control border border-border bg-card px-4 py-3">
            <span className="text-sm text-foreground">$</span>
            <input
              type="text"
              value={userInput.tip}
              onChange={(e) =>
                setUserInput({ ...userInput, tip: e.target.value })
              }
              inputMode="decimal"
              placeholder="0.00"
              className="ml-1 flex-1 border-none bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </div>

      <div className="mt-auto px-5 pb-8 pt-6">
        <div className="mb-4 rounded-card bg-primary px-5 py-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-primary-foreground/80">
              Total
            </span>
            <span className="tabular-amount text-[26px] text-primary-foreground">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-auto px-5 pb-8 pt-6">
        <button
          className="w-full rounded-control bg-primary py-3.5 text-sm font-semibold text-primary-foreground"
          onClick={handleClick}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
