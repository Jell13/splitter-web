import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Participant, PhotoBillState } from "../lib/types";

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
      setDescription: (val: string) => set({ description: val }),
      setSubtotal: (val: number) => set({ subtotal: val }),
      setTip: (val: number) => set({ tip: val }),
      setTax: (val: number) => set({ tax: val }),
      setImageUrl: (val: string) => set({ imageUrl: val }),
      setGuestCount: (val: number) => set({ guestCount: val }),
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
    }),
    { name: "photo-store" },
  ),
);
