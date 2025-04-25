import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// --- QUEST LIST ---
const QUEST_LIST = [
  "Burning Rubber",
  "Debut",
  "First in Line",
  "Luxurious Life",
  "Saving the Mole",
  "Shooting Cans",
  "Shortage",
  "Acquaintance",
  "Background Check",
  "Gunsmith - Part 1",
  "Introduction",
  "The Huntsman Path - Forest Cleaning",
  "The Huntsman Path - Secured Perimeter",
  "The Survivalist Path - Thrifty",
  "The Survivalist Path - Tough Guy",
  "The Survivalist Path - Unprotected but Dangerous",
  "The Survivalist Path - Wounded Beast",
  "The Survivalist Path - Zhivchik",
  "The Tarkov Shooter - Part 1",
  "The Tarkov Shooter - Part 2",
  "The Tarkov Shooter - Part 3",
  "The Tarkov Shooter - Part 4",
  "The Tarkov Shooter - Part 5",
  "Sanitary Standards - Part 1",
  "BP Depot",
  "Delivery from the Past",
  "Gunsmith - Part 2",
  "Supplier",
  "Bad Rep Evidence",
  "Gunsmith - Part 3",
  "The Extortionist",
  "Golden Swag",
  "Painkiller",
  "Sanitary Standards - Part 2",
  "What’s on the Flash Drive?",
  "Friend From the West - Part 1",
  "Friend From the West - Part 2",
  "Ice Cream Cones",
  "Chemical - Part 1",
  "Chemical - Part 2",
  "Fishing Gear",
  "Gunsmith - Part 4",
  "Gunsmith - Part 5",
  "Pharmacist",
  "Scrap Metal",
  "Tigr Safari",
  "Chemical - Part 3",
  "Chemical - Part 4 (choice)",
  "Eagle Eye",
  "Humanitarian Supplies",
  "Broadcast - Part 1",
  "Cargo X - Part 1",
  "Cargo X - Part 2",
  "Cargo X - Part 3",
  "Cargo X - Part 4",
  "Farming - Part 1",
  "Farming - Part 2",
  "Spa Tour - Part 1",
  "Spa Tour - Part 2",
  "Spa Tour - Part 3",
  "Spa Tour - Part 4",
  "Spa Tour - Part 5",
  "Spa Tour - Part 6",
  "Spa Tour - Part 7",
  "The Cult - Part 1",
  "The Cult - Part 2",
  "Gunsmith - Part 6",
  "A Fuel Matter",
  "Big Sale",
  "Broadcast - Part 2",
  "Database - Part 1",
  "Database - Part 2",
  "Gunsmith - Part 7",
  "Make ULTRA Great Again",
  "Only Business",
  "Shaking up the Teller",
  "Gunsmith - Part 8",
  "Seaside Vacation",
  "The Punisher - Part 1",
  "Setup",
  "The Punisher - Part 2",
  "Gunsmith - Part 9",
  "The Punisher - Part 3",
  "Courtesy Visit",
  "Gunsmith - Part 10",
  "Health Care Privacy - Part 1",
  "Health Care Privacy - Part 2",
  "The Punisher - Part 4",
  "Informed Means Armed",
  "Lost Contact",
  "Chumming",
  "Debtor",
  "House Arrest - Part 1",
  "Assessment - Part 1",
  "Assessment - Part 2",
  "Assessment - Part 3",
  "Getting Acquainted",
  "Key to the Tower",
  "Knock-Knock",
  "Network Provider - Part 1",
  "Network Provider - Part 2",
];

// --- SEED QUESTS ---
export const seedLightkeeperQuests = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("lightkeeperQuests").collect();
    if (existing.length > 0) return null;
    for (let i = 0; i < QUEST_LIST.length; i++) {
      await ctx.db.insert("lightkeeperQuests", {
        name: QUEST_LIST[i],
        order: i,
      });
    }
    return null;
  },
});

// --- GET ALL QUESTS ---
export const getAllLightkeeperQuests = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("lightkeeperQuests").withIndex("by_order").order("asc").collect();
  },
});

// --- GET USER PROGRESS ---
export const getUserLightkeeperProgress = query({
  args: {},
  handler: async (ctx, _args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    return await ctx.db
      .query("userLightkeeperProgress")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

// --- TOGGLE QUEST COMPLETION ---
export const toggleLightkeeperQuest = mutation({
  args: {
    questId: v.id("lightkeeperQuests"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User must be logged in to update progress");
    }

    const existing = await ctx.db
      .query("userLightkeeperProgress")
      .withIndex("by_user_quest", (q) =>
        q.eq("userId", userId).eq("questId", args.questId)
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { completed: !existing.completed });
      return { completed: !existing.completed };
    } else {
      await ctx.db.insert("userLightkeeperProgress", {
        userId: userId,
        questId: args.questId,
        completed: true,
      });
      return { completed: true };
    }
  },
});
