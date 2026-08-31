"use client";

import { useRouter } from "next/navigation";
import { IconArrowLeft } from "@tabler/icons-react";

export default function AddExpenseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <div className="mx-auto flex h-dvh max-w-md flex-col overflow-hidden bg-background">
      <div className="shrink-0 px-5 pt-6">
        <button
          aria-label="Back"
          onClick={() => router.back()}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground"
        >
          <IconArrowLeft size={18} stroke={1.75} />
        </button>
      </div>
      <div className="min-h-0 flex-1">{children}</div>
    </div>
  );
}