// convex/collector.ts
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {}, // No arguments needed to list all items
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return []; // Return empty if not logged in

    // Fetch all collector items, ordered using the index
    const items = await ctx.db
      .query("collectorItems")
      .withIndex("by_order") // Use the index
      .order("asc")         // Specify ascending direction
      .collect();

    // Fetch user's progress for collector items
    const userProgress = await ctx.db
      .query("userCollectorProgress")
      .withIndex("by_userId", q => q.eq("userId", userId))
      .collect();

    // Create a set of found item IDs for quick lookup
    const foundItemIds = new Set(
      userProgress.map(progress => progress.itemId.toString())
    );

    // Combine item data with found status
    const itemsWithProgress = items.map(item => ({
      ...item,
      found: foundItemIds.has(item._id.toString()),
    }));

    return itemsWithProgress;
  },
});

export const toggleItem = mutation({
  args: {
    itemId: v.id("collectorItems"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check if progress record exists for this user and item
    const existingProgress = await ctx.db
      .query("userCollectorProgress")
      .withIndex("by_user_item", q =>
        q.eq("userId", userId).eq("itemId", args.itemId)
      )
      .unique();

    if (existingProgress) {
      // Item was found, now mark as not found (delete record)
      await ctx.db.delete(existingProgress._id);
    } else {
      // Item was not found, now mark as found (insert record)
      await ctx.db.insert("userCollectorProgress", {
        userId,
        itemId: args.itemId,
      });
    }
  },
});
