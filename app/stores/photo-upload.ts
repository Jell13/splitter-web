import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Participant, PhotoBillState, ReceiptItems } from "../lib/types";

const initialState = {
  description: "",
  subtotal: 0,
  tip: 0,
  tax: 0,
  imageUrl: "",
  guestCount: 1,
  participants: [],
  items: [],
};

export const usePhotoStore = create<PhotoBillState>()(
  persist(
    (set) => ({
      ...initialState,
      hasHydrated: false,
      setHasHydrated: (val) => set({ hasHydrated: val }),
      setDescription: (val: string) => set({ description: val }),
      setSubtotal: (val: number) => set({ subtotal: val }),
      setTip: (val: number) => set({ tip: val }),
      setTax: (val: number) => set({ tax: val }),
      setImageUrl: (val: string) => set({ imageUrl: val }),
      setGuestCount: (val: number) => set({ guestCount: val }),
      setItems: (items: ReceiptItems[]) => set({ items }),
      reset: () => set(initialState),
      addParticipant: (name: string, initials: string) =>
        set((state) => {
          const newParticipant: Participant = {
            localId: crypto.randomUUID(),
            name,
            initials,
          };
          return { participants: [...state.participants, newParticipant] };
        }),
      toggleItemAssignment: (itemId, userId) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id != itemId
              ? item
              : {
                  ...item,
                  assignedUserIds: item.assignedUserIds.includes(userId)
                    ? item.assignedUserIds.filter((id) => id !== userId)
                    : [...item.assignedUserIds, userId],
                },
          ),
        })),
      ensureSelfParticipant: (name: string, initials: string) =>
        set((state) => {
          if (state.participants.some((p) => p.isSelf)) {
            return state; // already added, no-op
          }
          const newParticipant: Participant = {
            localId: crypto.randomUUID(),
            name,
            initials,
            isSelf: true,
          };
          return { participants: [...state.participants, newParticipant] };
        }),
      removeParticipant: (localId: string) =>
        set((state) => {
          const person = state.participants.find((p) => p.localId === localId);
          if (person?.isSelf) return state; // never remove yourself

          const isAssignedAnywhere = state.items.some((item) =>
            item.assignedUserIds.includes(localId),
          );
          if (isAssignedAnywhere) return state; // refuse — still in use

          return {
            participants: state.participants.filter(
              (p) => p.localId !== localId,
            ),
          };
        }),
    }),
    {
      name: "photo-store",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
