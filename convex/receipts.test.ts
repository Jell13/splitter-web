/// <reference types="vite/client" />

import { afterEach, expect, test, vi } from "vitest";
import { convexTest } from "convex-test";
import schema from "./schema";
import { api } from "./_generated/api";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

const modules = import.meta.glob("./**/*.ts");

function testFakeOpenAI(content: string, ok = true) {
  vi.stubGlobal(
    "fetch",
    vi.fn(
      async () =>
        ({
          ok,
          text: async () => content,
          json: async () => ({ choices: [{ message: { content } }] }),
        }) as unknown as Response,
    ),
  );
}

test("test an open ai call", async () => {
  vi.stubEnv("OPENAI_API_KEY", "test_key");
  testFakeOpenAI(
    JSON.stringify({
      description: "In n Out",
      items: [{ name: "Burger", price: 5.5 }],
      subtotal: 5.5,
      tax: 0.5,
      tip: 1,
    }),
  );

  const t = convexTest(schema, modules);
  const result = await t.action(api.receipts.parseReceipt, {
    imageUrl: "https://example.com/receipt.jpg"
  });

  expect(result.description).toBe("In n Out");
  expect(result.subtotal).toBe(5.5);
});

test("throws when the OpenAI request itself fails", async () => {
    vi.stubEnv("OPENAI_API_KEY", "test_key");
    vi.stubGlobal(
        "fetch",
        vi.fn(async () => ({
            ok: false,
            text: async () => "rate limited"
        }) as unknown as Response)
    )

    const t = convexTest(schema, modules);
    await expect(t.action(api.receipts.parseReceipt, { imageUrl: "https://example.com/x.jpg"})).rejects.toThrow("OpenAI API error");
})

test("Test OpenAI not returning normal JSON", async () => {
    vi.stubEnv("OPENAI_API_KEY", "test-key");
    testFakeOpenAI("Not an official json");


    const t = convexTest(schema, modules);
    const promise = t.action(api.receipts.parseReceipt, {imageUrl: "https://example.com/x.jpg"})
    await expect(promise).rejects.toThrow("Not an official JSON being returned");
})
