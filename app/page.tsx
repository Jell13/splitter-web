"use client";

import { useState } from "react";
import { BottomNav } from "./components/BottomNav";
import { AddExpenseSheet } from "./components/AddExpenseSheet";
import { useRouter } from "next/navigation";
import { useUserStore } from "./stores/user-store";
import NameEntryPrompt from "./components/NameEntryPrompt";
import { IconCamera, IconPencil, IconUsers, IconX } from "@tabler/icons-react";

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

const features = [
  {
    icon: IconCamera,
    title: "Scan a receipt",
    description: "Snap a photo and we'll read the items for you",
  },
  {
    icon: IconPencil,
    title: "Or enter it yourself",
    description: "Just the total, tax, and tip — quick and simple",
  },
  {
    icon: IconUsers,
    title: "Split it your way",
    description: "Evenly, or item by item with whoever you're with",
  },
];

export default function HomePage() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const router = useRouter();

  const name = useUserStore((state) => state.name);
  const setName = useUserStore((state) => state.setName);

  const today = new Date();
  const formatted = getFormattedDate(today);

  // if (!hasHydrated) return null;

  const handleSelectOption = (option: string) => {
    switch (option) {
      case "manual":
        router.push("/add-expenses/manual/bill-details");
        break;
      case "scan":
        router.push("/add-expenses/photo/confirm?source=camera");
        break;
      case "photo":
        router.push("/add-expenses/photo/confirm?source=gallery");
        break;
    }
  };

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col gap-4 px-4 pb-4 pt-5">
      {!name && <NameEntryPrompt onSubmit={setName} />}

      <header>
        <h1 className="text-2xl">Hey {name ?? ""}</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">{formatted}</p>
      </header>

      <div className="flex flex-1 flex-col gap-3 pt-2">
        <div className="rounded-card bg-primary px-5 py-6 text-center">
          <p className="font-display text-2xl text-primary-foreground">
            Split bills without the hassle
          </p>
          <p className="mt-1.5 text-xl font-semibold text-primary-foreground/90">
            Tap the + below to get started — no account needed
          </p>
        </div>

        <div className="flex flex-col gap-2">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex items-center gap-3 rounded-card bg-card p-4"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <feature.icon size={20} stroke={1.75} />
              </span>
              <div>
                <p className="text-base font-semibold text-foreground">
                  {feature.title}
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto pt-4">
        <BottomNav
          onAddExpense={() => setSheetOpen(true)}
          onAbout={() => setAboutOpen(true)}
        />
        <AddExpenseSheet
          open={sheetOpen}
          onClose={() => setSheetOpen(false)}
          onSelectOption={(option) => handleSelectOption(option)}
        />
      </div>

      {aboutOpen && (
        <div
          onClick={() => setAboutOpen(false)}
          className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/35"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-t-[28px] bg-card p-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl text-foreground">About this app</h2>
              <button
                onClick={() => setAboutOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-accent-foreground"
              >
                <IconX size={16} stroke={2} />
              </button>
            </div>
            <p className="mt-3 text-base text-muted-foreground">
              This app helps you split a bill with friends — scan a receipt,
              enter one manually, or split evenly, no sign-up required.
              Everything works right away as a guest.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}