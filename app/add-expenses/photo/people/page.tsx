"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { IconPlus, IconX } from "@tabler/icons-react";
import { usePhotoStore } from "@/app/stores/photo-upload";
import { useUserStore } from "@/app/stores/user-store";
import { getInitials, uniqueInitials } from "@/app/lib/split";

export default function PeoplePage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [newName, setNewName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const participants = usePhotoStore((state) => state.participants);
  const hasHydrated = usePhotoStore((state) => state.hasHydrated);
  const addParticipant = usePhotoStore((state) => state.addParticipant);
  const removeParticipant = usePhotoStore((state) => state.removeParticipant);
  const ensureSelfParticipant = usePhotoStore(
    (state) => state.ensureSelfParticipant,
  );
  const name = useUserStore((state) => state.name);

  useEffect(() => {
    if (hasHydrated && name) {
      ensureSelfParticipant(name, getInitials(name));
    }
  }, [hasHydrated, name, ensureSelfParticipant]);

  if (!hasHydrated) return null;

  const others = participants.filter((p) => !p.isSelf);
  const canContinue = others.length > 0;

  // Enter adds the name and keeps the keyboard open for the next one.
  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newName.trim();
    if (!trimmed) return;
    if (
      participants.some(
        (p) => p.name.toLowerCase() === trimmed.toLowerCase(),
      )
    ) {
      setError(`${trimmed} is already on the list`);
      return;
    }
    setError(null);
    addParticipant(
      trimmed,
      uniqueInitials(trimmed, participants.map((p) => p.initials)),
    );
    setNewName("");
    inputRef.current?.focus();
  };

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="shrink-0 px-5 pt-2">
        <h1 className="text-2xl">Who&apos;s splitting?</h1>
        <p className="mt-1 text-base text-muted-foreground">
          Step 2 of 3 · Add everyone at the table
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 pt-6">
        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            aria-label="Name"
            value={newName}
            onChange={(e) => {
              setNewName(e.target.value);
              setError(null);
            }}
            placeholder="Add a name"
            autoFocus
            enterKeyHint="next"
            autoComplete="off"
            className="min-w-0 flex-1 rounded-control border border-border bg-card px-4 py-3 text-base text-foreground outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            aria-label="Add person"
            disabled={!newName.trim()}
            className="flex w-12 shrink-0 items-center justify-center rounded-control bg-primary text-primary-foreground disabled:opacity-50"
          >
            <IconPlus size={20} stroke={2} />
          </button>
        </form>
        {error && (
          <p role="alert" className="mt-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <ul className="mt-4 flex flex-col gap-2">
          {participants.map((person) => (
            <li
              key={person.localId}
              className="flex items-center gap-3 rounded-card bg-card px-4 py-3"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
                {person.initials}
              </span>
              <span className="min-w-0 flex-1 truncate text-base text-foreground">
                {person.name}
                {person.isSelf && (
                  <span className="ml-1.5 text-sm text-muted-foreground">
                    (you)
                  </span>
                )}
              </span>
              {!person.isSelf && (
                <button
                  aria-label={`Remove ${person.name}`}
                  onClick={() => removeParticipant(person.localId)}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground active:bg-muted"
                >
                  <IconX size={18} stroke={1.75} />
                </button>
              )}
            </li>
          ))}
        </ul>

        {!canContinue && (
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Add at least one other person to split with
          </p>
        )}
      </div>

      <div className="shrink-0 px-5 pb-8 pt-4">
        <button
          onClick={() => router.push("/add-expenses/photo/assign-items")}
          disabled={!canContinue}
          className="w-full rounded-control bg-primary py-3.5 text-base font-semibold text-primary-foreground disabled:opacity-50"
        >
          {canContinue
            ? `Continue with ${participants.length} people`
            : "Continue"}
        </button>
      </div>
    </div>
  );
}
