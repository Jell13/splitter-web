import { v } from "convex/values";
import { internalMutation, query } from "./_generated/server";

export const createFromClerk = internalMutation({
    args: {
        userId: v.string(),
        name: v.string(),
        email: v.string()
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db.query("users").withIndex("by_userId", (q) => q.eq("userId", args.userId)).unique();
        if (existing){
            return existing._id
        }

        return await ctx.db.insert("users", {
            userId: args.userId,
            isGuest: false,
            name: args.name,
            email: args.email
        })

    }
})

export const deleteFromClerk = internalMutation({
    args: {
        userId: v.string()
    },
    handler: async (ctx, args) => {
        const user = await ctx.db.query("users").withIndex("by_userId", (q) => q.eq("userId", args.userId)).unique();
        if (!user){
            return
        }
        await ctx.db.delete("users", user._id)

    }
})

export const getUserSplits = query({
    args: {
        userId: v.string()
    },
    handler: async (ctx, args) => {

        const { userId } = args;
        const user = await ctx.db.query("users").withIndex("by_userId", q => q.eq("userId", userId)).unique();
        if (!user){
            return []
        }

        const allSplit = await ctx.db.query("splits").withIndex("by_creatorId", q => q.eq("createdByUserId", user?._id)).collect()

        return allSplit;
    }
})