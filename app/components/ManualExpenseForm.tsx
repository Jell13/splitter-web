import { IconCalendar, IconCheck } from "@tabler/icons-react";

// Static UI only. No props, no state, no click handlers wired up.
// Add your own onClick / onChange / useState directly in this file
// wherever you need real behavior.

const people = [
  { id: "you", initials: "AL", name: "You" },
  { id: "jm", initials: "JM", name: "Jamie" },
  { id: "sk", initials: "SK", name: "Sara" },
  { id: "tl", initials: "TL", name: "Tom" },
];

export function ManualExpenseForm() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex items-center justify-between px-5 pt-4">
        <h1 className="text-[16px]">New expense</h1>
        <button className="text-sm font-semibold text-primary">Save</button>
      </div>

      <div className="flex flex-col items-center py-10">
        <span className="text-xs font-medium text-muted-foreground">
          Amount
        </span>
        <div className="mt-2 flex items-center">
          <span className="text-[28px] font-semibold text-foreground">$</span>
          <input
            type="text"
            inputMode="decimal"
            placeholder="0.00"
            className="w-40 border-none bg-transparent text-center text-[40px] font-semibold text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="flex flex-col gap-6 px-5">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Description
          </label>
          <input
            type="text"
            placeholder="What's this for?"
            className="w-full rounded-control border border-border bg-card px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Paid by
          </label>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {people.map((person, i) => (
              <button
                key={person.id}
                className="flex shrink-0 flex-col items-center gap-1.5"
              >
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-full text-xs font-semibold ${
                    i === 0
                      ? "bg-primary text-primary-foreground"
                      : "bg-accent text-accent-foreground"
                  }`}
                >
                  {person.initials}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {person.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Split with
          </label>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {people.map((person, i) => (
              <button
                key={person.id}
                className="flex shrink-0 flex-col items-center gap-1.5"
              >
                <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                  {person.initials}
                  {i === 0 && (
                    <span className="absolute -bottom-0.5 -right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-success text-white">
                      <IconCheck size={11} stroke={3} />
                    </span>
                  )}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {person.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        <button className="flex items-center justify-between rounded-control border border-border bg-card px-4 py-3.5">
          <span className="flex items-center gap-2.5 text-sm text-foreground">
            <IconCalendar size={17} stroke={1.75} className="text-muted-foreground" />
            Today
          </span>
          <span className="text-muted-foreground">›</span>
        </button>
      </div>
    </div>
  );
}