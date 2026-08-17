"use client";

import { usePhotoStore } from "@/app/stores/photo-upload";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Static placeholder data. TODO: read real items from your scan
// result, real people from your split-participants store, and wire
// up actual tap-to-assign state (which item is assigned to which
// person, supporting more than one person per item).

const items = [
  { name: "CGT Riesling 8oz", price: 10.5, assignedTo: "AL" },
  { name: "CGT Riesling 5oz", price: 6.95, assignedTo: "JM" },
  { name: "CSJ 8oz", price: 10.5, assignedTo: null },
  { name: "CSJ Cab 8oz", price: 10.5, assignedTo: "SK" },
  { name: "H-Clams/H-Mussel", price: 13.95, assignedTo: null },
  { name: "Blue Points", price: 11.8, assignedTo: "AL" },
];

const people = [
  { id: "you", initials: "AL" },
  { id: "jm", initials: "JM" },
  { id: "sk", initials: "SK" },
];

export default function AssignItemsPage() {
  const router = useRouter();

  const description = usePhotoStore((state) => state.description);
  const tax = usePhotoStore((state) => state.tax);
  const tip = usePhotoStore((state) => state.tip);
  const items = usePhotoStore((state) => state.items);
  const subtotal = usePhotoStore((state) => state.subtotal);
  const hasHydrated = usePhotoStore((state) => state.hasHydrated);

  const [editableItems, setEditableItems] = useState(items);

  const setItems = usePhotoStore((state) => state.setItems);
  const setHasHydrated = usePhotoStore((state) => state.setHasHydrated);

  const handleContinue = () => {
    router.push("/add-expenses/photo/final-review");
  };

  useEffect(() => {
    if (hasHydrated){
      setEditableItems(items);
    }
  }, [hasHydrated])

  if (!hasHydrated){
    return null;
  }

  const total = subtotal + tax + tip;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="px-5 pt-2">
        <h1 className="text-[18px]">Assign items</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">
          Tap an item to choose who it belongs to
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-2 px-5 pt-6">
        

        <div className="mt-2 rounded-card bg-card p-4">
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
      </div>

      <div className="flex items-center gap-2 px-5 pb-2 pt-4">
        {people.map((person) => (
          <span
            key={person.id}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground"
          >
            {person.initials}
          </span>
        ))}
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-dashed border-border text-muted-foreground">
          +
        </span>
      </div>

      <div className="px-5 pb-8 pt-2">
        <button
          onClick={handleContinue}
          className="w-full rounded-control bg-primary py-3.5 text-sm font-semibold text-primary-foreground"
        >
          Continue
        </button>
      </div>
    </div>
  );
}