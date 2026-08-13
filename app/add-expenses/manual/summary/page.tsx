// Static UI only. Amounts are placeholders — wire up the real
// even-split calculation (total / guest count) yourself.

const shares = [
  { id: "jm", initials: "JM", name: "Jamie" },
  { id: "sk", initials: "SK", name: "Sara" },
  { id: "tl", initials: "TL", name: "Tom" },
];

export function ManualSummary() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="px-5 pt-2">
        <h1 className="text-[18px]">Summary</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">
          Step 4 of 4
        </p>
      </div>

      <div className="flex flex-col items-center px-5 pt-8">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft text-lg font-semibold text-primary-dark">
          AL
        </span>
        <p className="mt-3 text-sm font-medium text-foreground">You paid</p>
        <p className="tabular-amount mt-1 text-[32px] text-foreground">
          $220.64
        </p>
      </div>

      <div className="flex flex-col gap-2 px-5 pt-8">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Each owes you
        </p>
        {shares.map((person) => (
          <div
            key={person.id}
            className="flex items-center gap-3 rounded-card bg-card px-4 py-3"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
              {person.initials}
            </span>
            <span className="flex-1 text-sm text-foreground">
              {person.name}
            </span>
            <span className="tabular-amount rounded-full bg-success-soft px-2.5 py-1.5 text-xs text-success-foreground">
              $55.16
            </span>
          </div>
        ))}
      </div>

      <div className="mt-auto px-5 pb-8 pt-6">
        <button className="w-full rounded-control bg-primary py-3.5 text-sm font-semibold text-primary-foreground">
          Done
        </button>
      </div>
    </div>
  );
}