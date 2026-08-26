"use client";

import { calculatePerPerson } from "@/app/lib/split";
import { useManualStore } from "@/app/stores/manual-bill";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function GuestCountPage() {
  const router = useRouter();
  const [totalPeople, setTotalPeople] = useState(1);

  const subtotal = useManualStore((state) => state.subtotal);
  const tip = useManualStore((state) => state.tip);
  const tax = useManualStore((state) => state.tax);
  const setGuestCount = useManualStore((state) => state.setGuestCount);

  const handleClick = () => {

    setGuestCount(totalPeople);
    router.push("/add-expenses/manual/review");
  };

  const handleAdd = () => {
    setTotalPeople((prev) => prev + 1);
  };

  const handleReduce = () => {
    setTotalPeople((prev) => prev - 1);
  };
  // const total = subtotal + tip + tax
  const perPerson = calculatePerPerson(subtotal, tip, tax, totalPeople);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="px-5 pt-2">
        <h1 className="text-[18px]">Split evenly</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">Step 2 of 4</p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-5">
        <p className="text-sm text-muted-foreground">
          How many people are splitting the bill?
        </p>

        <div className="mt-8 flex items-center gap-8">
          <button
            className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card text-muted-foreground"
            onClick={handleReduce}
          >
            <IconMinus size={18} stroke={1.75} />
          </button>

          <span className="tabular-amount text-[56px] text-foreground">
            {totalPeople}
          </span>

          <button
            className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground"
            onClick={handleAdd}
          >
            <IconPlus size={18} stroke={1.75} />
          </button>
        </div>

        <p className="tabular-amount mt-4 text-sm text-muted-foreground">
          {totalPeople == 0 ? "" : <span>${perPerson.toFixed(2)} each</span>}
        </p>
      </div>

      <div className="px-5 pb-8 pt-6">
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
