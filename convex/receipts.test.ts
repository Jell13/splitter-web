/// <reference types="vite/client" />

import { afterEach, expect, test, vi } from "vitest";
import { convexTest } from "convex-test";
import { register as registerRateLimiter } from "@convex-dev/rate-limiter/test";
import schema from "./schema";
import { api } from "./_generated/api";

function setupTest() {
  const t = convexTest(schema, modules);
  registerRateLimiter(t);
  return t;
}

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

  const t = setupTest();
  const result = await t.action(api.receipts.parseReceipt, {
    imageUrl: "https://example.com/receipt.jpg",
    browserId: "test-browser",
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

    const t = setupTest();
    await expect(t.action(api.receipts.parseReceipt, { imageUrl: "https://example.com/x.jpg", browserId: "test-browser"})).rejects.toThrow("OpenAI API error");
})

test("Test OpenAI not returning normal JSON", async () => {
    vi.stubEnv("OPENAI_API_KEY", "test-key");
    testFakeOpenAI("Not an official json");


    const t = setupTest();
    const promise = t.action(api.receipts.parseReceipt, {imageUrl: "https://example.com/x.jpg", browserId: "test-browser"})
    await expect(promise).rejects.toThrow("Not an official JSON being returned");
})
