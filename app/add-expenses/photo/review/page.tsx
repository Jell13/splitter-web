"use client";

import { usePhotoStore } from "@/app/stores/photo-upload";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const items = [
  { name: "CGT Riesling 8oz", price: 10.5 },
  { name: "CGT Riesling 5oz", price: 6.95 },
  { name: "CSJ 8oz", price: 10.5 },
  { name: "CSJ Cab 8oz", price: 10.5 },
  { name: "H-Clams/H-Mussel", price: 13.95 },
  { name: "Blue Points", price: 11.8 },
];

export default function PhotoReviewPage() {
  const router = useRouter();

  const description = usePhotoStore((state) => state.description);
  const subtotal = usePhotoStore((state) => state.subtotal);
  const tax = usePhotoStore((state) => state.tax);
  const tip = usePhotoStore((state) => state.tip);
  const items = usePhotoStore((state) => state.items);
  const hasHydrated = usePhotoStore((state) => state.hasHydrated);

  const setDescription = usePhotoStore((state) => state.setDescription);
  const setSubtotal = usePhotoStore((state) => state.setSubtotal);
  const setTax = usePhotoStore((state) => state.setTax);
  const setTip = usePhotoStore((state) => state.setTip);
  const setItems = usePhotoStore((state) => state.setItems);
  const setHasHydrated = usePhotoStore((state) => state.setHasHydrated);

  console.log(description);
  console.log(subtotal);

  const [userInput, setUserInput] = useState({
    description: description,
    tax: String(tax),
    tip: String(tip),
  });

  const [editableItems, setEditableItems] = useState(
    items.map((item) => ({ ...item, price: String(item.price) })),
  );

  const handleEditItemName = (id: string, name: string) => {
    setEditableItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, name } : item)),
    );
  };

  const handleEditItemPrice = (id: string, price: string) => {
    setEditableItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, price } : item)),
    );
  };

  const imageUrl = usePhotoStore((state) => state.imageUrl);

  const derivedSubtotal = editableItems.reduce(
    (sum, item) => sum + (Number(item.price) || 0),
    0,
  );
  const handleContinue = () => {

    setSubtotal(derivedSubtotal);
    setDescription(userInput.description);
    setTax(Number(userInput.tax));
    setTip(Number(userInput.tip));
    setItems(editableItems.map((item) => ({...item, price: Number(item.price)})));

    router.push("/add-expenses/photo/assign-items");
  };

  useEffect(() => {
    if (hasHydrated) {
      setUserInput({
        description: description,
        tax: String(tax),
        tip: String(tip),
      });

      setEditableItems(
        items.map((item) => ({ ...item, price: String(item.price) })),
      );
    }
  }, [hasHydrated]);

  if (!hasHydrated) {
    return null;
  }

  const total = subtotal + tax + tip;
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="px-5 pt-2">
        <h1 className="text-[18px]">Review scan</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">
          Double check we read this right
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-4 px-5 pt-6">
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
            placeholder="Where was this?"
            className="w-full rounded-control border border-border bg-card px-4 py-3 text-lg font-semibold text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="rounded-card bg-card p-4">
          {editableItems.map((item, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 py-2 ${
                i > 0 ? "border-t border-border" : ""
              }`}
            >
              <input
                type="text"
                value={item.name}
                onChange={(e) => handleEditItemName(item.id, e.target.value)}
                className="flex-1 border-none bg-transparent text-sm text-foreground outline-none"
              />
              <div className="flex items-center">
                <span className="text-sm text-muted-foreground">$</span>
                <input
                  type="text"
                  value={item.price}
                  inputMode="decimal"
                  onChange={(e) => handleEditItemPrice(item.id, e.target.value)}
                  className="w-16 border-none bg-transparent text-right text-sm text-foreground outline-none"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-card bg-card p-4">
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-muted-foreground">Subtotal</span>
            <span className="tabular-amount text-sm text-foreground">
              ${derivedSubtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-border py-2">
            <span className="text-sm text-muted-foreground">Tax</span>
            <div className="flex items-center">
              <span className="text-sm text-foreground">$</span>
              <input
                type="text"
                className="w-16 border-none bg-transparent text-right text-sm text-foreground outline-none"
                value={userInput.tax}
                onChange={(e) =>
                  setUserInput({ ...userInput, tax: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-border py-2">
            <span className="text-sm text-muted-foreground">Tip</span>
            <div className="flex items-center">
              <span className="text-sm text-foreground">$</span>
              <input
                type="text"
                className="w-16 border-none bg-transparent text-right text-sm text-foreground outline-none"
                value={userInput.tip}
                onChange={(e) =>
                  setUserInput({ ...userInput, tip: e.target.value })
                }
              />
            </div>
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

      <div className="px-5 pb-8 pt-6">
        <button
          onClick={handleContinue}
          className="w-full rounded-control bg-primary py-3.5 text-sm font-semibold text-primary-foreground"
        >
          Looks good
        </button>
      </div>
    </div>
  );
}
