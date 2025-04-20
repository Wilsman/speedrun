import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

export const getHideoutProgress = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const userProgress = await ctx.db
      .query("userProgress")
      .withIndex("by_user", q => q.eq("userId", userId))
      .unique();

    if (!userProgress) {
      return {
        hideoutProgress: {
          items: {},
          skills: {},
          traders: {},
        },
      };
    }

    return {
      hideoutProgress: userProgress.hideoutProgress,
    };
  },
});

export const updateHideoutProgress = mutation({
  args: {
    items: v.record(v.string(), v.number()),
    skills: v.record(v.string(), v.number()),
    traders: v.record(v.string(), v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const userProgress = await ctx.db
      .query("userProgress")
      .withIndex("by_user", q => q.eq("userId", userId))
      .unique();

    if (!userProgress) {
      await ctx.db.insert("userProgress", {
        userId,
        completedTasks: [],
        completedBossTasks: [],
        hideoutProgress: {
          items: args.items,
          skills: args.skills,
          traders: args.traders,
        },
        prestigeProgress: {
          currentPrestige: 1,
          level: 0,
          strength: 0,
          endurance: 0,
          charisma: 0,
          intelligenceCenter: 0,
          security: 0,
          restSpace: 0,
          roubles: 0,
          collectorComplete: false,
          figurines: [],
          scavsKilled: 0,
          pmcsKilled: 0,
          labsExtracted: false,
        },
      });
      return;
    }

    await ctx.db.patch(userProgress._id, {
      hideoutProgress: {
        items: args.items,
        skills: args.skills,
        traders: args.traders,
      },
    });
  },
});
