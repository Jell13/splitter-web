interface BalanceSummaryCardProps {
  totalOwedToYou: number;
  youOwe: number;
  owedToYou: number;
}

function formatAmount(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export function BalanceSummaryCard({
  totalOwedToYou,
  youOwe,
  owedToYou,
}: BalanceSummaryCardProps) {
  return (
    <div className="rounded-card bg-primary px-5 py-[18px] text-primary-foreground">
      <p className="text-xs font-medium text-primary-foreground/80">
        Overall, you are owed
      </p>
      <p className="tabular-amount mt-1.5 text-[30px]">
        {formatAmount(totalOwedToYou)}
      </p>
      <div className="mt-3 flex gap-4">
        <div>
          <p className="text-[11px] text-primary-foreground/80">You owe</p>
          <p className="mt-0.5 text-sm font-semibold">
            {formatAmount(youOwe)}
          </p>
        </div>
        <div>
          <p className="text-[11px] text-primary-foreground/80">
            Owed to you
          </p>
          <p className="mt-0.5 text-sm font-semibold">
            {formatAmount(owedToYou)}
          </p>
        </div>
      </div>
    </div>
  );
}