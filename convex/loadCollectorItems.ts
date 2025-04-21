// convex/loadCollectorItems.ts
import { internalMutation } from "./_generated/server";
import itemData from "./collectorItems.json";

export const load = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Clear existing items
    const existingItems = await ctx.db.query("collectorItems").collect();
    for (const item of existingItems) {
      await ctx.db.delete(item._id);
    }
    console.log(`Cleared ${existingItems.length} existing collector items.`);

    // Load new items
    let count = 0;
    for (const item of itemData) {
      await ctx.db.insert("collectorItems", {
        name: item.name,
        order: item.order,
        img: item.img,
      });
      count++;
    }
    console.log(`Loaded ${count} new collector items.`);
  },
});
