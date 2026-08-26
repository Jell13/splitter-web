export interface PhotoConfirmationProps {
    imageUrl: string;
}

export interface NameEntryPromptProp{
    onSubmit: (name : string) => void;
}

export interface ManualBillState{
    subtotal: number;
    tax: number;
    tip: number;
    description: string;
    guestCount: number;
    hasHydrated: boolean;
    setHasHydrated: (val: boolean) => void;
    setSubtotal: (subtotal : number) => void;
    setTax: (tax : number) => void;
    setTip: (tip : number) => void;
    setDescription: (description : string) => void;
    setGuestCount: (guestCount : number) => void;
    reset: () => void;
}

export interface UserState{
    name: string | null;
    setName: (name: string) => void;
}

export interface Participant{
    localId: string;
    convexId?: string;
    initials: string;
    name: string;
    isSelf?: boolean;
}

export interface ReceiptItems{
    id: string;
    name: string;
    price: number;
    assignedUserIds: string[];
}


export interface PhotoBillState{
    subtotal: number;
    description: string;
    imageUrl: string;
    tip: number;
    tax: number;
    guestCount: number;
    items: ReceiptItems[];
    participants: Participant[];
    hasHydrated: boolean;
    setHasHydrated: (val: boolean) => void;
    setSubtotal: (subtotal : number) => void;
    setItems: (item : ReceiptItems[]) => void;
    setDescription: (description : string) => void;
    setImageUrl: (imageUrl : string) => void;
    setTip: (tip : number) => void;
    setTax: (tax : number) => void;
    setGuestCount: (guestCount: number) => void;
    addParticipant: (name: string, initials: string) => void;
    toggleItemAssignment: (itemId: string, name: string) => void;
    ensureSelfParticipant: (name: string, initials: string) => void;
    removeParticipant: (localId: string) => void;
    reset: () => void;
}

export interface calculateSplitProp {
    subtotal: number;
    tip: number;
    tax: number;
    totalPeople: number;
}
