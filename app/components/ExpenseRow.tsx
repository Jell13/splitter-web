import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ExpenseRowProps {
  initials: string;
  title: string;
  subtitle: string;
  amount: number;
  direction: "positive" | "negative";
}

function formatAmount(value: number, direction: "positive" | "negative") {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Math.abs(value));
  return direction === "positive" ? `+${formatted}` : `-${formatted}`;
}

export function ExpenseRow({
  initials,
  title,
  subtitle,
  amount,
  direction,
}: ExpenseRowProps) {
  return (
    <div className="flex items-center gap-3 rounded-card bg-card p-3.5">
      <Avatar className="h-9 w-9 bg-accent">
        <AvatarFallback className="bg-accent text-xs font-semibold text-accent-foreground">
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[13.5px] font-medium text-foreground">
          {title}
        </p>
        <p className="mt-0.5 truncate text-[11.5px] text-muted-foreground">
          {subtitle}
        </p>
      </div>

      <span
        className={cn(
          "tabular-amount whitespace-nowrap rounded-full px-2.5 py-1.5 text-xs",
          direction === "positive"
            ? "bg-success-soft text-success-foreground"
            : "bg-warning-soft text-warning-foreground"
        )}
      >
        {formatAmount(amount, direction)}
      </span>
    </div>
  );
}