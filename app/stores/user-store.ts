import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState{
    name: string | null;
    setName: (name: string) => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            name: null,
            setName: (name) => set({name})
        }),
        { name: "user-storage "}
    )
)