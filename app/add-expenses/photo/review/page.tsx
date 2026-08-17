"use client";

import { usePhotoStore } from "@/app/stores/photo-upload";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PhotoReviewPage() {
  const router = useRouter();

  const description = usePhotoStore((state) => state.description);
  const subtotal = usePhotoStore((state) => state.subtotal);
  const tax = usePhotoStore((state) => state.tax);
  const tip = usePhotoStore((state) => state.tip);
  const items = usePhotoStore((state) => state.items);
  const imageUrl = usePhotoStore((state) => state.imageUrl);
  const hasHydrated = usePhotoStore((state) => state.hasHydrated);

  const [isViewingImage, setIsViewingImage] = useState(false);

  const setDescription = usePhotoStore((state) => state.setDescription);
  const setSubtotal = usePhotoStore((state) => state.setSubtotal);
  const setTax = usePhotoStore((state) => state.setTax);
  const setTip = usePhotoStore((state) => state.setTip);
  const setItems = usePhotoStore((state) => state.setItems);

  const [userInput, setUserInput] = useState({
    description: "",
    tax: "",
    tip: "",
  });

  const [editableItems, setEditableItems] = useState<
    { id: string; name: string; price: string; assignedUserIds: string[] }[]
  >([]);

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

  const derivedSubtotal = editableItems.reduce(
    (sum, item) => sum + (Number(item.price) || 0),
    0,
  );

  const handleContinue = () => {
    setSubtotal(derivedSubtotal);
    setDescription(userInput.description);
    setTax(Number(userInput.tax) || 0);
    setTip(Number(userInput.tip) || 0);
    setItems(editableItems.map((item) => ({ ...item, price: Number(item.price) || 0 })));

    router.push("/add-expenses/photo/assign-items");
  };

  useEffect(() => {
    if (hasHydrated) {
      setUserInput({
        description,
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
        <h1 className="text-xl">Review scan</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Double check we read this right
        </p>
      </div>

      {imageUrl && (
        <button
          onClick={() => setIsViewingImage(true)}
          className="mx-5 mt-4 flex items-center gap-3 rounded-card bg-card p-2.5 text-left"
        >
          <img
            src={imageUrl}
            alt="Scanned receipt"
            className="h-14 w-14 rounded-control object-cover"
          />
          <span className="text-sm font-medium text-primary">
            View full receipt
          </span>
        </button>
      )}

      <div className="flex flex-1 flex-col gap-4 px-5 pt-6">
        <div>
          <label className="mb-2 block text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Description
          </label>
          <input
            type="text"
            value={userInput.description}
            onChange={(e) =>
              setUserInput({ ...userInput, description: e.target.value })
            }
            placeholder="Where was this?"
            className="w-full rounded-control border border-border bg-card px-4 py-3 text-xl font-semibold text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="rounded-card bg-card p-4">
          {editableItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-2 border-t border-border py-2 first:border-t-0"
            >
              <input
                type="text"
                value={item.name}
                onChange={(e) => handleEditItemName(item.id, e.target.value)}
                className="flex-1 border-none bg-transparent text-base text-foreground outline-none"
              />
              <div className="flex items-center">
                <span className="text-base text-muted-foreground">$</span>
                <input
                  type="text"
                  value={item.price}
                  inputMode="decimal"
                  onChange={(e) => handleEditItemPrice(item.id, e.target.value)}
                  className="w-16 border-none bg-transparent text-right text-base text-foreground outline-none"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-card bg-card p-4">
          <div className="flex items-center justify-between py-2">
            <span className="text-base text-muted-foreground">Subtotal</span>
            <span className="tabular-amount text-base text-foreground">
              ${derivedSubtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-border py-2">
            <span className="text-base text-muted-foreground">Tax</span>
            <div className="flex items-center">
              <span className="text-base text-muted-foreground">$</span>
              <input
                type="text"
                className="w-16 border-none bg-transparent text-right text-base text-foreground outline-none"
                value={userInput.tax}
                onChange={(e) =>
                  setUserInput({ ...userInput, tax: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-border py-2">
            <span className="text-base text-muted-foreground">Tip</span>
            <div className="flex items-center">
              <span className="text-base text-muted-foreground">$</span>
              <input
                type="text"
                className="w-16 border-none bg-transparent text-right text-base text-foreground outline-none"
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
            <span className="text-base font-medium text-primary-foreground/80">
              Total
            </span>
            <span className="tabular-amount text-[30px] text-primary-foreground">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="px-5 pb-8 pt-6">
        <button
          onClick={handleContinue}
          className="w-full rounded-control bg-primary py-3.5 text-base font-semibold text-primary-foreground"
        >
          Looks good
        </button>
      </div>

      {isViewingImage && imageUrl && (
        <div
          onClick={() => setIsViewingImage(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/80 p-6"
        >
          <img
            src={imageUrl}
            alt="Scanned receipt, full size"
            className="max-h-full max-w-full rounded-card object-contain"
          />
        </div>
      )}
    </div>
  );
}