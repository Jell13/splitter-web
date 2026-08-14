import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ManualBillState } from "../lib/types";

const initialState = {
    description: "",
    subtotal: 0,
    tip: 0,
    tax: 0,
    guestCount: 1
}

export const useManualStore = create<ManualBillState>()(
    persist(
        (set) => ({
            ...initialState,
            setDescription: (val : string) => set({description: val}),
            setSubtotal: (val: number) => set({subtotal: val}),
            setTip: (val : number) => set({tip: val}),
            setTax: (val: number) => set({tax: val}),
            setGuestCount: (val: number) => set({guestCount: val}),
            reset: () => set(initialState)
        }),
        { name: "manual-draft-storage"}
    )
)