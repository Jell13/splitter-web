"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "./stores/user-store";
import { useManualStore } from "./stores/manual-bill";
import { usePhotoStore } from "./stores/photo-upload";
import NameEntryPrompt from "./components/NameEntryPrompt";
import {
  IconCamera,
  IconChevronRight,
  IconInfoCircle,
  IconPencil,
  IconPhoto,
  IconX,
} from "@tabler/icons-react";

type StartOption = "scan" | "photo" | "manual";

const options: {
  key: StartOption;
  icon: typeof IconCamera;
  title: string;
  description: string;
}[] = [
  {
    key: "scan",
    icon: IconCamera,
    title: "Scan receipt",
    description: "Snap the receipt and we'll read the items for you",
  },
  {
    key: "photo",
    icon: IconPhoto,
    title: "Choose photo",
    description: "Already took a picture? Pick it from your library",
  },
  {
    key: "manual",
    icon: IconPencil,
    title: "Enter manually",
    description: "Just the total, tax, and tip — split evenly",
  },
];

function getFormattedDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
}

export default function HomePage() {
  const [aboutOpen, setAboutOpen] = useState(false);
  const router = useRouter();

  const name = useUserStore((state) => state.name);
  const setName = useUserStore((state) => state.setName);
  const resetManual = useManualStore((state) => state.reset);
  const resetPhoto = usePhotoStore((state) => state.reset);

  // Every split starts from a clean slate, so an abandoned draft never
  // leaks old numbers or people into a new bill.
  const handleStart = (option: StartOption) => {
    if (option === "manual") {
      resetManual();
      router.push("/add-expenses/manual/bill-details");
    } else {
      resetPhoto();
      router.push(
        `/add-expenses/photo/confirm?source=${option === "scan" ? "camera" : "gallery"}`,
      );
    }
  };

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col gap-4 px-5 pb-8 pt-6">
      {!name && <NameEntryPrompt onSubmit={setName} />}

      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl">Hey{name ? ` ${name}` : ""}</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {getFormattedDate(new Date())}
          </p>
        </div>
        <button
          aria-label="About"
          onClick={() => setAboutOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground"
        >
          <IconInfoCircle size={18} stroke={1.75} />
        </button>
      </header>

      <div className="rounded-card bg-primary px-5 py-6">
        <p className="font-display text-xl text-primary-foreground">
          Split a bill
        </p>
        <p className="mt-1 text-sm text-primary-foreground/80">
          Pick how you want to start — no account needed
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {options.map((option) => (
          <button
            key={option.key}
            onClick={() => handleStart(option.key)}
            className="flex w-full items-center gap-3.5 rounded-card bg-card p-4 text-left transition active:scale-[0.99] active:bg-accent/40"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <option.icon size={20} stroke={1.75} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-base font-semibold text-foreground">
                {option.title}
              </span>
              <span className="mt-0.5 block text-sm text-muted-foreground">
                {option.description}
              </span>
            </span>
            <IconChevronRight
              size={18}
              className="shrink-0 text-muted-foreground"
            />
          </button>
        ))}
      </div>

      {aboutOpen && (
        <div
          onClick={() => setAboutOpen(false)}
          className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/35"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-t-[28px] bg-card p-6 pb-10"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg text-foreground">About this app</h2>
              <button
                aria-label="Close"
                onClick={() => setAboutOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-accent-foreground"
              >
                <IconX size={16} stroke={2} />
              </button>
            </div>
            <p className="mt-3 text-base text-muted-foreground">
              Scan a receipt and assign items to whoever ordered them — tax
              and tip are split in proportion to what each person had. Or
              enter a total and split it evenly. Everything works right away
              as a guest.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
