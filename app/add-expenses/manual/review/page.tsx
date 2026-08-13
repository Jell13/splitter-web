// Static UI only. Values and participant list are placeholders —
// wire up real data yourself.

const participants = [
  { id: "you", initials: "AL" },
  { id: "jm", initials: "JM" },
  { id: "sk", initials: "SK" },
  { id: "tl", initials: "TL" },
];

export function ManualReview() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="px-5 pt-2">
        <h1 className="text-[18px]">Review bill</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">
          Step 3 of 4
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-4 px-5 pt-6">
        <div className="rounded-card bg-card p-4">
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-muted-foreground">Subtotal</span>
            <span className="tabular-amount text-sm text-foreground">
              $181.00
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-border py-2">
            <span className="text-sm text-muted-foreground">Tax</span>
            <span className="tabular-amount text-sm text-foreground">
              $10.86
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-border py-2">
            <span className="text-sm text-muted-foreground">Tip</span>
            <span className="tabular-amount text-sm text-foreground">
              $28.78
            </span>
          </div>
        </div>

        <div className="rounded-card bg-primary px-5 py-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-primary-foreground/80">
              Total
            </span>
            <span className="tabular-amount text-[26px] text-primary-foreground">
              $220.64
            </span>
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Splitting with
          </p>
          <div className="flex gap-2">
            {participants.map((person) => (
              <span
                key={person.id}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground"
              >
                {person.initials}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="px-5 pb-8 pt-6">
        <button className="w-full rounded-control bg-primary py-3.5 text-sm font-semibold text-primary-foreground">
          Confirm
        </button>
      </div>
    </div>
  );
}