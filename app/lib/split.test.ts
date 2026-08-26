import { describe, expect, it } from "vitest";
import { calculatePerPerson } from "./split";

describe("Calculating the price for each person", () => {

    it("splits the total among the amount of people", () => {
        expect(calculatePerPerson(35, 0, 0, 5)).toBe(7);
    })

    it("Splits the total and return", () => {
        expect(calculatePerPerson(100, 8, 9.3, 4)).toBeCloseTo(29.3, 1);
    })

    it("Throw error bc no people", () => {
        expect(() => calculatePerPerson(20,0 ,0 ,0)).toThrow();
    })
})