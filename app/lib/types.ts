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
    imageUrl: string;
    description: string;
    guestCount: number;
    setSubtotal: (subtotal : string) => void;
    setTax: (tax : string) => void;
    setTip: (tip : string) => void;
    setDescription: (description : string) => void;
    setGuestCount: (guestCount : number) => void;
    reset: () => void;
}