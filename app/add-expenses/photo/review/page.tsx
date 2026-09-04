"use client";

import { usePhotoStore } from "@/app/stores/photo-upload";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IconPlus, IconTrash } from "@tabler/icons-react";

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

  const [newItemId, setNewItemId] = useState<string | null>(null);

  const handleEditItemName = (id: string, name: string) => {
    setEditableItems((prev: any) =>
      prev.map((item: any) => (item.id === id ? { ...item, name } : item)),
    );
  };

  const handleEditItemPrice = (id: string, price: string) => {
    setEditableItems((prev: any) =>
      prev.map((item: any) => (item.id === id ? { ...item, price } : item)),
    );
  };

  const handleRemoveItem = (id: string) => {
    setEditableItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddItem = () => {
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `item-${Date.now()}-${Math.random().toString(36).slice(2)}`;

    setEditableItems((prev: any) => [
      ...prev,
      { id, name: "", price: "", assignedUserIds: [] },
    ]);
    setNewItemId(id);
  };

  const derivedSubtotal = editableItems.reduce(
    (sum: number, item: any) => sum + (Number(item.price) || 0),
    0,
  );

  const handleContinue = () => {
    setSubtotal(derivedSubtotal);
    setDescription(userInput.description);
    setTax(Number(userInput.tax) || 0);
    setTip(Number(userInput.tip) || 0);
    setItems(editableItems.map((item: any) => ({ ...item, price: Number(item.price) || 0 })));

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

  const total = derivedSubtotal + (Number(userInput.tax) || 0) + (Number(userInput.tip) || 0);

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="px-5 pt-2">
        <h1 className="text-2xl">Review scan</h1>
        <p className="mt-1 text-xl font-semibold text-foreground">
          Double check we read this right
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
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

        <div className="flex flex-col gap-4 px-5 pt-6">
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
            {editableItems.length === 0 ? (
              <p className="py-3 text-center text-sm text-muted-foreground">
                No items yet — add one below, or go back and rescan
              </p>
            ) : (
              editableItems.map((item: any) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 border-t border-border py-2.5 first:border-t-0"
                >
                  <input
                    type="text"
                    value={item.name}
                    autoFocus={item.id === newItemId}
                    placeholder="Item name"
                    onChange={(e) => handleEditItemName(item.id, e.target.value)}
                    className="min-w-0 flex-1 border-none bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
                  />
                  <div className="flex shrink-0 items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      <span className="text-base text-muted-foreground">$</span>
                      <input
                        type="text"
                        value={item.price}
                        inputMode="decimal"
                        placeholder="0.00"
                        onChange={(e) => handleEditItemPrice(item.id, e.target.value)}
                        className="w-14 border-none bg-transparent text-right text-base text-foreground outline-none placeholder:text-muted-foreground"
                      />
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      aria-label={`Remove ${item.name || "item"}`}
                      className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors active:bg-muted active:text-foreground"
                    >
                      <IconTrash size={16} stroke={1.75} />
                    </button>
                  </div>
                </div>
              ))
            )}

            <button
              onClick={handleAddItem}
              className={`flex w-full items-center justify-center gap-1.5 rounded-control py-2.5 text-sm font-semibold text-primary transition-colors active:bg-muted ${
                editableItems.length > 0 ? "mt-1 border-t border-border pt-3.5" : ""
              }`}
            >
              <IconPlus size={16} stroke={2.25} />
              Add item
            </button>
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
      </div>

      <div className="shrink-0 px-5 pb-8 pt-4">
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