"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";

export const parseReceipt = action({
  args: {
    imageUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const { imageUrl } = args;
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY not set");

    const prompt = `You are reading a photo of a restaurant or store receipt. Extract the following information and return it as a single JSON object, with EXACTLY this shape:

{
  "description": string,
  "items": [
    { "name": string, "price": number }
  ],
  "subtotal": number,
  "tax": number,
  "tip": number
}

Rules:
- "description" is the merchant/restaurant name. If it isn't legible or isn't present, use "Receipt".
- "items" is every line item you can read, with its price. If no items are legible at all, return an empty array [].
- If a promo, discount, or coupon reduces an item's price, apply that reduction directly to the item's own price — do NOT list the discount or promo as its own separate line item.
- If an item is made fully free by a discount or promo (its final price is $0), exclude that item from the items array entirely — there's nothing to charge for it.
- "subtotal" is the pre-tax, pre-tip total, reflecting prices AFTER any discounts have been applied. If it isn't shown, calculate it by summing all item prices (post-discount). If items are also unreadable, use 0.
- "tax" is the tax amount in dollars. If no tax is shown on the receipt, use 0.
- "tip" is the tip amount in dollars. If no tip is shown, use 0.
- All prices and totals must be plain numbers (e.g. 12.50), never strings, never including a "$" sign.
- Return ONLY the JSON object. No explanation, no markdown code fences, no additional text before or after it.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-nano",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt,
              },
              { type: "image_url", image_url: { url: imageUrl } },
            ],
          },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${await response.text()}`);
    }

    const json = await response.json();
    let parse;
    try{
      parse = JSON.parse(json.choices[0].message.content);
      return parse;
    } catch(error){
      throw new Error("Not an official JSON being returned")
    }
  },
});
