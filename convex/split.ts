import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return ctx.storage.generateUploadUrl();
  },
});

export const saveReceiptImage = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const { storageId } = args;
    const url = await ctx.storage.getUrl(storageId);
    if (!url) throw new Error("Failed to resolve uploaded file URL");

    const identity = await ctx.auth.getUserIdentity();
    let uploadedByUserId = undefined;

    if (identity) {
      const user = await ctx.db
        .query("users")
        .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
        .unique();
      uploadedByUserId = user?._id;
    }

    const receiptImageId = await ctx.db.insert("receiptImages", {
      url,
      uploadedAt: Date.now(),
      uploadedByUserId,
    });

    return { receiptImageId, url };
  },
});
