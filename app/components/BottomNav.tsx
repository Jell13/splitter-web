import { IconHome, IconPlus, IconInfoCircle } from "@tabler/icons-react";

interface BottomNavProps {
  onAddExpense: () => void;
  onAbout: () => void;
}

export function BottomNav({ onAddExpense, onAbout }: BottomNavProps) {
  return (
    <div className="flex items-center justify-around border-t border-border pt-2.5">
      <button aria-label="Home" className="text-primary-dark">
        <IconHome size={20} stroke={1.75} />
      </button>
      <button
        aria-label="Add expense"
        onClick={onAddExpense}
        className="-mt-5.5 flex h-10.5 w-10.5 items-center justify-center rounded-full bg-primary text-primary-foreground"
      >
        <IconPlus size={20} stroke={2} />
      </button>
      <button
        aria-label="About"
        onClick={onAbout}
        className="text-muted-foreground"
      >
        <IconInfoCircle size={20} stroke={1.75} />
      </button>
    </div>
  );
}