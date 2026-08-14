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
    // total: number;
    // setTotal: (total: number) => void;
    setSubtotal: (subtotal : number) => void;
    setTax: (tax : number) => void;
    setTip: (tip : number) => void;
    setDescription: (description : string) => void;
    setGuestCount: (guestCount : number) => void;
    reset: () => void;
}