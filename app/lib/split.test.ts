import { describe, expect, it } from "vitest";
import {
  calculatePerPerson,
  computeItemShares,
  getInitials,
  roundToCents,
  sanitizeAmount,
  tipFromPercent,
  toAmount,
  uniqueInitials,
} from "./split";
import { Participant, ReceiptItems } from "./types";

describe("Calculating the price for each person", () => {
  it("splits the total among the amount of people", () => {
    expect(calculatePerPerson(35, 0, 0, 5)).toBe(7);
  });

  it("Splits the total and return", () => {
    expect(calculatePerPerson(100, 8, 9.3, 4)).toBeCloseTo(29.3, 1);
  });

  it("Throw error bc no people", () => {
    expect(() => calculatePerPerson(20, 0, 0, 0)).toThrow();
  });
});

describe("sanitizeAmount", () => {
  it("strips non-numeric characters", () => {
    expect(sanitizeAmount("$12")).toBe("12");
    expect(sanitizeAmount("1,234.5")).toBe("1234.5");
  });

  it("keeps only one decimal point and two decimals", () => {
    expect(sanitizeAmount("12.5.3")).toBe("12.53");
    expect(sanitizeAmount("9.999")).toBe("9.99");
  });

  it("allows a trailing decimal point while typing", () => {
    expect(sanitizeAmount("12.")).toBe("12.");
  });
});

describe("toAmount", () => {
  it("treats empty or junk as 0", () => {
    expect(toAmount("")).toBe(0);
    expect(toAmount(".")).toBe(0);
    expect(toAmount("12.5")).toBe(12.5);
  });
});

describe("tipFromPercent", () => {
  it("rounds to cents", () => {
    expect(tipFromPercent(33.33, 18)).toBe(6);
    expect(tipFromPercent(100, 15)).toBe(15);
  });
});

describe("getInitials", () => {
  it("handles one and two word names", () => {
    expect(getInitials("jason")).toBe("JA");
    expect(getInitials("Jason Sugiharto")).toBe("JS");
    expect(getInitials("   ")).toBe("?");
  });
});

describe("roundToCents", () => {
  it("keeps the sum equal to the rounded total", () => {
    const parts = roundToCents([10 / 3, 10 / 3, 10 / 3]);
    expect(parts.reduce((a, b) => a + b, 0)).toBeCloseTo(10, 5);
  });
});

describe("computeItemShares", () => {
  const people: Participant[] = [
    { localId: "a", name: "A", initials: "A" },
    { localId: "b", name: "B", initials: "B" },
  ];

  it("splits items and tax/tip proportionally", () => {
    const items: ReceiptItems[] = [
      { id: "1", name: "Steak", price: 30, assignedUserIds: ["a"] },
      { id: "2", name: "Salad", price: 10, assignedUserIds: ["b"] },
      { id: "3", name: "Fries", price: 10, assignedUserIds: ["a", "b"] },
    ];
    const { shares, unassignedTotal } = computeItemShares(items, people, 5, 5);
    expect(unassignedTotal).toBe(0);
    // A: 35 of 50 subtotal -> 35 + 7 = 42; B: 15 -> 15 + 3 = 18
    expect(shares[0].amount).toBe(42);
    expect(shares[1].amount).toBe(18);
  });

  it("reports unassigned items", () => {
    const items: ReceiptItems[] = [
      { id: "1", name: "Steak", price: 30, assignedUserIds: [] },
      { id: "2", name: "Salad", price: 10, assignedUserIds: ["b"] },
    ];
    const result = computeItemShares(items, people, 0, 0);
    expect(result.unassignedTotal).toBe(30);
    expect(result.unassignedCount).toBe(1);
  });

  it("does not produce NaN with an empty bill", () => {
    const { shares } = computeItemShares([], people, 5, 5);
    expect(shares.every((s) => s.amount === 0)).toBe(true);
  });

  it("ignores assignees who are no longer participants", () => {
    const items: ReceiptItems[] = [
      { id: "1", name: "Steak", price: 30, assignedUserIds: ["gone", "a"] },
    ];
    const { shares } = computeItemShares(items, people, 0, 0);
    expect(shares[0].amount).toBe(30);
  });
});

describe("uniqueInitials", () => {
  it("keeps normal initials when free", () => {
    expect(uniqueInitials("Sam", ["AL"])).toBe("SA");
  });

  it("avoids clashing initials", () => {
    expect(uniqueInitials("Sara", ["SA"])).toBe("SR");
    expect(uniqueInitials("Sa", ["SA"])).toBe("S2");
  });
});

describe("computeItemShares edge cases", () => {
  const people: Participant[] = [
    { localId: "a", name: "A", initials: "A" },
    { localId: "b", name: "B", initials: "B" },
    { localId: "c", name: "C", initials: "C" },
  ];

  it("does not require a $0 comped item to be assigned", () => {
    const items: ReceiptItems[] = [
      { id: "1", name: "Steak", price: 30, assignedUserIds: ["a"] },
      { id: "2", name: "Free dessert", price: 0, assignedUserIds: [] },
    ];
    expect(computeItemShares(items, people, 0, 0).unassignedCount).toBe(0);
  });

  it("always adds up to the exact bill total, to the cent", () => {
    const items: ReceiptItems[] = [
      { id: "1", name: "Pizza", price: 19.99, assignedUserIds: ["a", "b", "c"] },
      { id: "2", name: "Wings", price: 13.37, assignedUserIds: ["a", "b"] },
      { id: "3", name: "Soda", price: 2.49, assignedUserIds: ["c"] },
    ];
    const tax = 3.21;
    const tip = 7.17;
    const { shares } = computeItemShares(items, people, tax, tip);
    const sumCents = shares.reduce((s, p) => s + Math.round(p.amount * 100), 0);
    expect(sumCents).toBe(Math.round((19.99 + 13.37 + 2.49 + tax + tip) * 100));
  });
});
