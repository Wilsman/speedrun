import { mutation } from "./_generated/server";

/**
 * Migration: Patch all userProgress.prestigeProgress objects to include all required fields for the latest schema.
 * Run this mutation once from the Convex dashboard or via code to update all existing docs.
 */
export const forcePrestigeProgressPatch = mutation({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("userProgress").collect();
    for (const doc of all) {
      const p = doc.prestigeProgress ?? {};
      // Patch missing fields with default values
      const patched = {
        currentPrestige: p.currentPrestige ?? 1,
        level: p.level ?? 0,
        strength: p.strength ?? 0,
        endurance: p.endurance ?? 0,
        charisma: p.charisma ?? 0,
        intelligenceCenter: p.intelligenceCenter ?? 0,
        security: p.security ?? 0,
        restSpace: p.restSpace ?? 0,
        roubles: p.roubles ?? 0,
        collectorComplete: p.collectorComplete ?? false,
        figurines: Array.isArray(p.figurines) ? p.figurines : [],
        scavsKilled: p.scavsKilled ?? 0,
        pmcsKilled: p.pmcsKilled ?? 0,
        labsExtracted: p.labsExtracted ?? false,
      };
      await ctx.db.patch(doc._id, { prestigeProgress: patched });
    }
  },
});
