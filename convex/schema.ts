import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        userId: v.string(),
        isGuest: v.boolean(),
        name: v.string(),
        email: v.string(),
    }).index("by_userId", ["userId"]),
    
    splits: defineTable({
        createdByUserId: v.id("users"),
        method: v.string(),
        subtotal: v.number(),
        tax: v.number(),
        tip: v.number(),
        total: v.number(),
        status: v.string(),
        items: v.array(v.object({
            name: v.string(),
            price: v.number(),
            quantity: v.number(),
            assignedUserIds: v.array(v.id("users"))
        }))

    }),

    split_participants: defineTable({
        splitId: v.id("splits"),
        userId: v.id("users"),
        amountOwed: v.number(),
        hasPaid: v.number()
    }).index("by_split", ["splitId"])
    .index("by_user", ["userId"]),

    receiptImages: defineTable({
        url: v.string(),
        uploadedAt: v.number(),
        uploadedByUserId: v.optional(v.id("users"))
    })
    
})