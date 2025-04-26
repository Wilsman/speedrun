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
        // order: i, // Removed - No longer in schema
        // Add wikiUrl here if needed based on schema
      });
    }
    return null;
  },
});

// --- DELETE ALL QUESTS (Use with caution!) ---
export const deleteAllLightkeeperQuests = mutation({
  args: { confirm: v.boolean() }, // Add confirmation flag
  handler: async (ctx, args) => {
    if (!args.confirm) {
      throw new Error("You must confirm deletion by passing { confirm: true }.");
    }
    console.warn("Deleting all documents from lightkeeperQuests table...");
    const quests = await ctx.db.query("lightkeeperQuests").collect();
    let deletedCount = 0;
    for (const quest of quests) {
      await ctx.db.delete(quest._id);
      deletedCount++;
    }
    console.log(`Deleted ${deletedCount} quests.`);
    // Also delete related progress entries
    const progressEntries = await ctx.db.query("userLightkeeperProgress").collect();
    let deletedProgressCount = 0;
    for (const entry of progressEntries) {
        // Check if the related quest still exists (shouldn't, but safer)
        const relatedQuest = await ctx.db.get(entry.questId);
        if (!relatedQuest) { 
            await ctx.db.delete(entry._id);
            deletedProgressCount++;
        }
    }
    console.log(`Deleted ${deletedProgressCount} related progress entries.`);
    return { deletedQuests: deletedCount, deletedProgress: deletedProgressCount };
  },
});

// --- GET ALL QUESTS ---
export const getAllLightkeeperQuests = query({
  args: {},
  handler: async (ctx) => {
    // Removed .withIndex("by_order").order("asc") as it's no longer valid
    return await ctx.db.query("lightkeeperQuests").collect(); 
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
    initialState: v.optional(v.boolean()), // Add optional argument
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
      // Insert new: use initialState (default true if not provided)
      const completedState = args.initialState === undefined ? true : args.initialState;
      await ctx.db.insert("userLightkeeperProgress", {
        userId: userId,
        questId: args.questId,
        completed: completedState, // Use the determined state
        subTasksCompleted: [], // Initialize subtasks as empty array
      });
      return { completed: completedState };
    }
  },
});

// --- TOGGLE SUB-TASK COMPLETION ---
export const toggleLightkeeperSubTask = mutation({
  args: {
    questId: v.id("lightkeeperQuests"),
    subTaskIndex: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User must be logged in to update progress");
    }

    // Find the existing progress document for the main quest
    const existingProgress = await ctx.db
      .query("userLightkeeperProgress")
      .withIndex("by_user_quest", (q) =>
        q.eq("userId", userId).eq("questId", args.questId)
      )
      .unique();

    if (!existingProgress) {
      // Should not happen if the main quest checkbox exists, but handle defensively
      throw new Error("Main quest progress not found. Cannot toggle sub-task.");
    }

    // Get the current list of completed sub-task indices, or initialize if undefined
    const currentSubTasks = existingProgress.subTasksCompleted ?? [];

    // Check if the subTaskIndex is already in the array
    const indexInArray = currentSubTasks.indexOf(args.subTaskIndex);

    let newSubTasks: number[];

    if (indexInArray > -1) {
      // If it exists, remove it
      newSubTasks = currentSubTasks.filter((index) => index !== args.subTaskIndex);
    } else {
      // If it doesn't exist, add it
      newSubTasks = [...currentSubTasks, args.subTaskIndex].sort((a, b) => a - b); // Keep sorted
    }

    // Patch the document with the updated array
    await ctx.db.patch(existingProgress._id, {
      subTasksCompleted: newSubTasks,
    });

    return { subTasksCompleted: newSubTasks };
  },
});
