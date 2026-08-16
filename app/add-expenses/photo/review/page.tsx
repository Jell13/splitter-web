"use client";

import { usePhotoStore } from "@/app/stores/photo-upload";
import { useRouter } from "next/navigation";

// Static placeholder data standing in for what your OCR action
// actually returns. TODO: read real extracted items/subtotal/tax/tip
// from wherever you stored the OCR result, and make these fields
// editable (same controlled-input pattern as the manual flow) in
// case the OCR got something wrong.

const items = [
  { name: "CGT Riesling 8oz", price: 10.5 },
  { name: "CGT Riesling 5oz", price: 6.95 },
  { name: "CSJ 8oz", price: 10.5 },
  { name: "CSJ Cab 8oz", price: 10.5 },
  { name: "H-Clams/H-Mussel", price: 13.95 },
  { name: "Blue Points", price: 11.8 },
];

const subtotal = 181.0;
const tax = 10.86;
const tip = 28.78;
const total = subtotal + tax + tip;

export default function PhotoReviewPage() {
  const router = useRouter();


  const imageUrl = usePhotoStore((state) => state.imageUrl);
  const handleContinue = () => {
    router.push("/add-expense/photo/assign-items");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="px-5 pt-2">
        <h1 className="text-[18px]">Review scan</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">
          Double check we read this right
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-4 px-5 pt-6">
        <div className="rounded-card bg-card p-4">
          {items.map((item, i) => (
            <div
              key={item.name}
              className={`flex items-center justify-between py-2 ${
                i > 0 ? "border-t border-border" : ""
              }`}
            >
              <span className="text-sm text-foreground">{item.name}</span>
              <span className="tabular-amount text-sm text-foreground">
                ${item.price.toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="rounded-card bg-card p-4">
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-muted-foreground">Subtotal</span>
            <span className="tabular-amount text-sm text-foreground">
              ${subtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-border py-2">
            <span className="text-sm text-muted-foreground">Tax</span>
            <span className="tabular-amount text-sm text-foreground">
              ${tax.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-border py-2">
            <span className="text-sm text-muted-foreground">Tip</span>
            <span className="tabular-amount text-sm text-foreground">
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