"use client";

import {
  IconHome,
  IconUsers,
  IconPlus,
  IconReceipt,
  IconUser,
} from "@tabler/icons-react";
import { useConvexAuth } from "convex/react";
import { useClerk } from "@clerk/nextjs";

interface BottomNavProps {
  active: "home" | "groups" | "activity" | "profile";
  onAddExpense: () => void;
}

export function BottomNav({ active, onAddExpense }: BottomNavProps) {
  const { isAuthenticated } = useConvexAuth();
  const { openSignIn } = useClerk();

  const iconClass = (name: BottomNavProps["active"], requiresAuth: boolean) => {
    if (requiresAuth && !isAuthenticated) return "text-muted-foreground/40";
    return active === name ? "text-primary-dark" : "text-muted-foreground";
  };

  function handleGatedTap(action: () => void) {
    if (!isAuthenticated) {
      openSignIn();
      return;
    }
    action();
  }

  return (
    <div className="flex items-center justify-around border-t border-border pt-2.5">
      <button aria-label="Home" className={iconClass("home", false)}>
        <IconHome size={20} stroke={1.75} />
      </button>
      <button
        aria-label="Groups"
        onClick={() => handleGatedTap(() => {})}
        className={iconClass("groups", true)}
      >
        <IconUsers size={20} stroke={1.75} />
      </button>
      <button
        aria-label="Add expense"
        onClick={onAddExpense}
        className="-mt-5.5 flex h-10.5 w-10.5 items-center justify-center rounded-full bg-primary text-primary-foreground"
      >
        <IconPlus size={20} stroke={2} />
      </button>
      <button
        aria-label="Activity"
        onClick={() => handleGatedTap(() => {})}
        className={iconClass("activity", true)}
      >
        <IconReceipt size={20} stroke={1.75} />
      </button>
      <button
        aria-label="Profile"
        onClick={() => handleGatedTap(() => {})}
        className={iconClass("profile", true)}
      >
        <IconUser size={20} stroke={1.75} />
      </button>
    </div>
  );
}