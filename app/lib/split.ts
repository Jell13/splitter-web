import { calculateSplitProp } from "./types";

export const calculatePerPerson = (subtotal: number, tip:number, tax:number, totalPeople:number) => {

    if (totalPeople <= 0){
        throw new Error("must have more than 0 people")
    }
    const total = subtotal + tip + tax;
    return total / totalPeople;

}