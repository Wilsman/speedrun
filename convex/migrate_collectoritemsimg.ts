import { mutation } from "./_generated/server";

/**
 * Migration: Add img field to collectorItems table
 * Run this mutation once from the Convex dashboard or via code to update all existing docs.
 */
import itemData from "./collectorItems.json";

export const addImgToCollectorItems = mutation({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("collectorItems").collect();
    for (const doc of all) {
      // Match by name and order (as in loader)
      const match = itemData.find(
        (item) => item.name === doc.name && item.order === doc.order
      );
      if (match && match.img) {
        await ctx.db.patch(doc._id, { img: match.img });
      }
    }
  },
});
