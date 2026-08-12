import {
  IconHome,
  IconUsers,
  IconPlus,
  IconReceipt,
  IconUser,
} from "@tabler/icons-react";

interface BottomNavProps {
  active: "home" | "groups" | "activity" | "profile";
  onAddExpense: () => void;
}

export function BottomNav({ active, onAddExpense }: BottomNavProps) {
  const iconClass = (name: BottomNavProps["active"]) =>
    active === name ? "text-primary-dark" : "text-muted-foreground";

  return (
    <div className="flex items-center justify-around border-t border-border pt-2.5">
      <button aria-label="Home" className={iconClass("home")}>
        <IconHome size={20} stroke={1.75} />
      </button>
      <button aria-label="Groups" className={iconClass("groups")}>
        <IconUsers size={20} stroke={1.75} />
      </button>
      <button
        aria-label="Add expense"
        onClick={onAddExpense}
        className="-mt-5.5 flex h-10.5 w-10.5 items-center justify-center rounded-full bg-primary text-primary-foreground"
      >
        <IconPlus size={20} stroke={2} />
      </button>
      <button aria-label="Activity" className={iconClass("activity")}>
        <IconReceipt size={20} stroke={1.75} />
      </button>
      <button aria-label="Profile" className={iconClass("profile")}>
        <IconUser size={20} stroke={1.75} />
      </button>
    </div>
  );
}