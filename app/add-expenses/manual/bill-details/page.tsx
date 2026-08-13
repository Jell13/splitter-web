"use client"
import { useRouter } from "next/navigation";

export default function BillDetailsPage() {
  const router = useRouter();
  const handleClick = () => {
    router.push("/add-expenses/manual/guest-count");
  };
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
            <button className="flex-1 rounded-control bg-primary py-2.5 text-sm font-semibold text-primary-foreground">
              15%
            </button>
            <button className="flex-1 rounded-control bg-accent py-2.5 text-sm font-semibold text-accent-foreground">
              18%
            </button>
            <button className="flex-1 rounded-control bg-accent py-2.5 text-sm font-semibold text-accent-foreground">
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
              inputMode="decimal"
              placeholder="0.00"
              className="ml-1 flex-1 border-none bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </div>

      <div className="mt-auto px-5 pb-8 pt-6">
        <button className="w-full rounded-control bg-primary py-3.5 text-sm font-semibold text-primary-foreground" onClick={handleClick}>
          Continue
        </button>
      </div>
    </div>
  );
}
