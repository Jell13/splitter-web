"use client";

import { usePhotoStore } from "@/app/stores/photo-upload";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IconCheck, IconX, IconTrash } from "@tabler/icons-react";
import { useUserStore } from "@/app/stores/user-store";

export default function AssignItemsPage() {
  const router = useRouter();

  const tax = usePhotoStore((state) => state.tax);
  const tip = usePhotoStore((state) => state.tip);
  const items = usePhotoStore((state) => state.items);
  const subtotal = usePhotoStore((state) => state.subtotal);
  const participants = usePhotoStore((state) => state.participants);
  const hasHydrated = usePhotoStore((state) => state.hasHydrated);
  const toggleItemAssignment = usePhotoStore(
    (state) => state.toggleItemAssignment,
  );
  const addParticipant = usePhotoStore((state) => state.addParticipant);
  const removeParticipant = usePhotoStore((state) => state.removeParticipant);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isAddingParticipant, setIsAddingParticipant] = useState(false);
  const [newName, setNewName] = useState("");
  const [pendingRemovalKey, setPendingRemovalKey] = useState<string | null>(
    null,
  );

  const handleContinue = () => {
    router.push("/add-expenses/photo/final-review");
  };

  function toggleParticipantSelected(localId: string) {
    setSelectedIds((prev) =>
      prev.includes(localId)
        ? prev.filter((id) => id !== localId)
        : [...prev, localId],
    );
  }

  function handleItemTap(itemId: string) {
    setPendingRemovalKey(null);
    if (selectedIds.length === 0) return;
    selectedIds.forEach((localId) => toggleItemAssignment(itemId, localId));
  }

  function handleChipTap(itemId: string, localId: string) {
    const key = `${itemId}:${localId}`;
    if (pendingRemovalKey === key) {
      toggleItemAssignment(itemId, localId);
      setPendingRemovalKey(null);
    } else {
      setPendingRemovalKey(key);
    }
  }

  function getInitials(name: string): string {
    const words = name.trim().split(/\s+/);
    if (words.length === 1) {
      return words[0].slice(0, 2).toUpperCase();
    }
    return (words[0][0] + words[1][0]).toUpperCase();
  }

  function handleAddParticipant() {
    const trimmed = newName.trim();
    if (!trimmed) return;
    addParticipant(trimmed, getInitials(trimmed));
    setNewName("");
    setIsAddingParticipant(false);
  }

  const name = useUserStore((state) => state.name);
  const ensureSelfParticipant = usePhotoStore(
    (state) => state.ensureSelfParticipant,
  );

  useEffect(() => {
    if (hasHydrated && name) {
      ensureSelfParticipant(name, getInitials(name));
    }
  }, [hasHydrated, name]);

  if (!hasHydrated) {
    return null;
  }

  const total = subtotal + tip + tax;

  return (
    <div
      className="flex h-full flex-col bg-background"
      onClick={() => {
        setSelectedIds([]);
        setPendingRemovalKey(null);
      }}
    >
      <div className="shrink-0 px-5 pt-2">
        <h1 className="text-2xl">Assign items</h1>
        <p
          className={`mt-2 text-xl font-semibold transition ${
            selectedIds.length === 0
              ? "text-foreground"
              : "rounded-control bg-primary/10 px-3 py-2 text-primary"
          }`}
        >
          {selectedIds.length === 0
            ? "Tap a name below, then tap their items"
            : "Now tap every item that belongs to them"}
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 pt-6">
        <div className="flex flex-col gap-2">
          {items.map((item) => {
            const assignedPeople = participants.filter((p) =>
              (item.assignedUserIds ?? []).includes(p.localId),
            );

            return (
              <div
                key={item.id}
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  handleItemTap(item.id);
                }}
                className={`flex items-center justify-between rounded-card bg-card p-3.5 text-left ${
                  selectedIds.length === 0
                    ? "cursor-default opacity-70"
                    : "cursor-pointer"
                }`}
              >
                <div className="min-w-0 flex-1">
                  <span className="block text-base text-foreground">
                    {item.name}
                  </span>
                  {assignedPeople.length > 0 && (
                    <span className="mt-1.5 flex gap-1.5">
                      {assignedPeople.map((p) => {
                        const key = `${item.id}:${p.localId}`;
                        const isArmed = pendingRemovalKey === key;
                        return (
                          <button
                            key={p.localId}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleChipTap(item.id, p.localId);
                            }}
                            className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold transition ${
                              isArmed
                                ? "bg-destructive text-destructive-foreground"
                                : "bg-accent text-accent-foreground"
                            }`}
                          >
                            {isArmed ? (
                              <IconX size={18} stroke={2.25} />
                            ) : (
                              p.initials
                            )}
                          </button>
                        );
                      })}
                    </span>
                  )}
                </div>
                <span className="tabular-amount ml-3 shrink-0 text-base text-foreground">
                  ${item.price.toFixed(2)}
                </span>
              </div>
            );
          })}

          <div className="mt-2 rounded-card bg-card p-4">
            <div className="flex items-center justify-between py-1.5">
              <span className="text-sm text-muted-foreground">Subtotal</span>
              <span className="tabular-amount text-sm text-foreground">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-border py-1.5">
              <span className="text-sm text-muted-foreground">Tax</span>
              <span className="tabular-amount text-sm text-foreground">
                ${tax.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-border py-1.5">
              <span className="text-sm text-muted-foreground">Tip</span>
              <span className="tabular-amount text-sm text-foreground">
                ${tip.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="rounded-card bg-primary px-5 py-4">
            <div className="flex items-center justify-between">
              <span className="text-base font-medium text-primary-foreground/80">
                Total
              </span>
              <span className="tabular-amount text-[30px] text-primary-foreground">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="shrink-0 px-5 pb-2 pt-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Split with
          </span>
          <span className="text-sm text-muted-foreground">
            {participants.length}{" "}
            {participants.length === 1 ? "person" : "people"}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {participants.map((person) => {
            const isSelected = selectedIds.includes(person.localId);
            return (
              <button
                key={person.localId}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleParticipantSelected(person.localId);
                }}
                className={`relative flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold transition ${
                  isSelected
                    ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-background"
                    : "bg-accent text-accent-foreground"
                }`}
              >
                {person.initials}
                {isSelected && (
                  <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-success text-white">
                    <IconCheck size={12} stroke={3} />
                  </span>
                )}
              </button>
            );
          })}

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsAddingParticipant(true);
            }}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-dashed border-border text-lg text-muted-foreground"
          >
            +
          </button>

          {selectedIds.length === 1 &&
            (() => {
              const selectedPerson = participants.find(
                (p) => p.localId === selectedIds[0],
              );
              const hasAssignments = items.some((item) =>
                (item.assignedUserIds ?? []).includes(selectedIds[0]),
              );
              const canDelete =
                selectedPerson && !selectedPerson.isSelf && !hasAssignments;

              if (!canDelete) return null;

              return (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeParticipant(selectedIds[0]);
                    setSelectedIds([]);
                  }}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-destructive text-destructive-foreground"
                >
                  <IconTrash size={18} stroke={1.75} />
                </button>
              );
            })()}
        </div>
      </div>

      <div className="shrink-0 px-5 pb-8 pt-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleContinue();
          }}
          className="w-full rounded-control bg-primary py-3.5 text-base font-semibold text-primary-foreground"
        >
          Continue
        </button>
      </div>

      {isAddingParticipant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/35 px-6">
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xs rounded-card bg-card p-6"
          >
            <h2 className="text-lg text-foreground">Add someone</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              They'll be added to this split
            </p>

            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Their name"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddParticipant();
              }}
              className="mt-4 w-full rounded-control border border-border bg-background px-4 py-3 text-base text-foreground outline-none placeholder:text-muted-foreground"
            />

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  setIsAddingParticipant(false);
                  setNewName("");
                }}
                className="flex-1 rounded-control bg-accent py-3 text-base font-semibold text-accent-foreground"
              >
                Cancel
              </button>
              <button
                onClick={handleAddParticipant}
                className="flex-1 rounded-control bg-primary py-3 text-base font-semibold text-primary-foreground"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}