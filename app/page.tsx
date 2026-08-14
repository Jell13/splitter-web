"use client";

import { useState } from "react";
import { BalanceSummaryCard } from "./components/BalanceSummaryCard";
import { SegmentedTabs } from "./components/SegmentedTabs";
import { ExpenseRow } from "./components/ExpenseRow";
import { BottomNav } from "./components/BottomNav";
import { AddExpenseSheet } from "./components/AddExpenseSheet";
import { useRouter } from "next/navigation";
import { useUserStore } from "./stores/user-store";
import NameEntryPrompt from "./components/NameEntryPrompt";

const activity = [
  {
    initials: "JM",
    title: "Dinner at Nori's",
    subtitle: "Jamie split with you",
    amount: 32.0,
    direction: "positive" as const,
  },
  {
    initials: "SK",
    title: "Weekend cabin",
    subtitle: "You owe Sara",
    amount: 18.0,
    direction: "negative" as const,
  },
  {
    initials: "TL",
    title: "Groceries",
    subtitle: "Tom split with you",
    amount: 14.5,
    direction: "positive" as const,
  },
];

export default function HomePage() {
  const [tab, setTab] = useState("all");
  const [sheetOpen, setSheetOpen] = useState(false);
  const router = useRouter();

  function getFormattedDate(date: Date): string {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      throw new Error("Invalid Date object provided.");
    }

    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };

    return new Intl.DateTimeFormat("en-US", options).format(date);
  }

  const name = useUserStore((state) => state.name);
  const setName = useUserStore((state) => state.setName);

  const today = new Date();
  const formatted = getFormattedDate(today);
  let day = today.getDate(); // Day of the month (1-31)
  let month = today.getMonth() + 1; // Month (0-11) → +1 to make it 1-12
  let year = today.getFullYear();

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col gap-4 px-4 pb-4 pt-5">
      {!name && <NameEntryPrompt onSubmit={setName} />}

      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl">Hey {name ?? ""}</h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {formatted}
          </p>
        </div>
        <div className="flex h-9.5 w-9.5 items-center justify-center rounded-full bg-accent text-[13px] font-semibold text-accent-foreground">
          {name ? name[0].toUpperCase() : ""}
        </div>
      </header>

      <BalanceSummaryCard
        totalOwedToYou={142.5}
        youOwe={38.0}
        owedToYou={180.5}
      />

      <SegmentedTabs value={tab} onValueChange={setTab} />

      <div className="flex flex-col gap-1">
        <p className="mb-1 pl-0.5 text-xs font-medium text-muted-foreground">
          Recent activity
        </p>
        <div className="flex flex-col gap-2">
          {activity.map((item) => (
            <ExpenseRow key={item.title} {...item} />
          ))}
        </div>
      </div>

      <div className="mt-auto pt-4">
        <BottomNav active="home" onAddExpense={() => setSheetOpen(true)} />
        <AddExpenseSheet
          open={sheetOpen}
          onClose={() => setSheetOpen(false)}
          onSelectOption={(option) => {
            switch (option) {
              case "manual":
                router.push("/add-expenses/manual/bill-details");
                break;
              case "photo":
                router.push("/add-expenses/photo");
                break;
            }
          }}
        />
      </div>
    </main>
  );
}
