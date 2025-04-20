import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

const BOSS_TASKS: Record<string, BossTaskData> = {
  Killa: {
    finalTask: "The Huntsman Path - Sellout",
    tasks: [
      "Acquaintance",
      "Only Business",
      "The Tarkov Shooter - Part 1",
      "The Tarkov Shooter - Part 2",
      "The Tarkov Shooter - Part 3",
      "The Survivalist Path - Unprotected",
      "The Survivalist Path - Thrifty",
      "The Survivalist Path - Zhivchik",
      "The Survivalist Path - Wounded Beast",
      "The Survivalist Path - Tough Guy",
      "The Huntsman Path - Secured Perimeter",
      "The Huntsman Path - Forest Cleaning",
      "Big Sale",
      "Make ULTRA Great Again",
      "The Blood of War - Part 1",
      "Dressed to Kill",
      "Database - Part 1",
      "Database - Part 2",
      "Gratitude",
      "Sales Night",
    ],
    leftToComplete: 21,
  },
  Goons: {
    finalTask: "Stray Dogs",
    tasks: [
      "Acquaintance",
      "Only Business",
      "The Tarkov Shooter - Part 1",
      "The Tarkov Shooter - Part 2",
      "The Tarkov Shooter - Part 3",
      "The Survivalist Path - Unprotected",
      "The Survivalist Path - Thrifty",
      "The Survivalist Path - Zhivchik",
      "The Survivalist Path - Wounded Beast",
      "The Survivalist Path - Tough Guy",
      "The Huntsman Path - Secured Perimeter",
      "The Huntsman Path - Forest Cleaning",
      "Big Sale",
      "Make ULTRA Great Again",
      "The Blood of War - Part 1",
      "Dressed to Kill",
      "Database - Part 1",
      "Database - Part 2",
      "Gratitude",
      "Sales Night",
      "The Huntsman Path - Trophy",
      "The Huntsman Path - Woods Keeper",
      "The Huntsman Path - Sellout",
    ],
    leftToComplete: 24,
  },
  Tagilla: {
    finalTask: "The Huntsman Path - Factory Chief",
    tasks: [
      "Acquaintance",
      "The Tarkov Shooter - Part 1",
      "The Tarkov Shooter - Part 2",
      "The Tarkov Shooter - Part 3",
      "The Survivalist Path - Unprotected",
      "The Survivalist Path - Thrifty",
      "The Survivalist Path - Zhivchik",
      "The Survivalist Path - Wounded Beast",
      "The Survivalist Path - Tough Guy",
      "The Huntsman Path - Secured Perimeter",
      "The Huntsman Path - Forest Cleaning",
      "Saving The Mole",
      "Gunsmith - Part 1",
      "Gunsmith - Part 2",
      "Signal - Part 1",
      "Signal - Part 2",
      "Scout",
    ],
    leftToComplete: 18,
  },
  Shturman: {
    finalTask: "The Huntsman Path - Woods Keeper",
    tasks: [
      "Acquaintance",
      "The Tarkov Shooter - Part 1",
      "The Tarkov Shooter - Part 2",
      "The Tarkov Shooter - Part 3",
      "The Survivalist Path - Unprotected",
      "The Survivalist Path - Thrifty",
      "The Survivalist Path - Zhivchik",
      "The Survivalist Path - Wounded Beast",
      "The Survivalist Path - Tough Guy",
      "The Huntsman Path - Secured Perimeter",
      "First In Line",
      "Shortage",
      "Sanitary Standards - Part 1",
      "Sanitary Standards - Part 2",
      "Painkiller",
      "Pharmacist",
      "Supply Plans",
    ],
    leftToComplete: 18,
  },
  Reshala: {
    finalTask: "The Huntsman Path - Trophy",
    tasks: [
      "Acquaintance",
      "The Tarkov Shooter - Part 1",
      "The Tarkov Shooter - Part 2",
      "The Tarkov Shooter - Part 3",
      "The Survivalist Path - Unprotected",
      "The Survivalist Path - Thrifty",
      "The Survivalist Path - Zhivchik",
      "The Survivalist Path - Wounded Beast",
      "The Survivalist Path - Tough Guy",
      "The Huntsman Path - Secured Perimeter",
    ],
    leftToComplete: 11,
  },
  Glukhar: {
    finalTask: "The Huntsman Path - Eraser - Part 1",
    tasks: [
      "Acquaintance",
      "The Survivalist Path - Unprotected",
      "The Survivalist Path - Thrifty",
      "The Delicious Sausage",
      "Reserve",
      "Pest Control",
    ],
    leftToComplete: 7,
  },
};

// Define the interface before using it
interface BossTaskData {
  finalTask: string;
  tasks: string[];
  leftToComplete: number;
}

export type BossName = keyof typeof BOSS_TASKS;

// Get boss tasks and progress
export const list = query({
  args: {
    boss: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const userProgress = await ctx.db
      .query("userProgress")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    const completedTasks = userProgress?.completedBossTasks ?? [];

    if (args.boss) {
      const bossData = BOSS_TASKS[args.boss];
      if (!bossData) return [];
      return bossData.tasks.filter((task) => completedTasks.includes(task));
    }

    return completedTasks;
  },
});

// Toggle a boss task completion
export const toggleBossTask = mutation({
  args: {
    taskName: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const userProgress = await ctx.db
      .query("userProgress")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (!userProgress) {
      await ctx.db.insert("userProgress", {
        userId,
        completedTasks: [],
        completedBossTasks: [args.taskName],
        hideoutProgress: {
          items: {},
          skills: {},
          traders: {},
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

    const completedTasks = new Set(userProgress.completedBossTasks);
    if (completedTasks.has(args.taskName)) {
      completedTasks.delete(args.taskName);
    } else {
      completedTasks.add(args.taskName);
    }

    await ctx.db.patch(userProgress._id, {
      completedBossTasks: Array.from(completedTasks),
    });
  },
});

// Get all boss data
export const getBossData = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const userProgress = await ctx.db
      .query("userProgress")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    const completedTasks = userProgress?.completedBossTasks ?? [];

    return Object.entries(BOSS_TASKS).map(([boss, data]) => {
      // Check if all prerequisite tasks are completed
      const prerequisiteTasks = data.tasks;
      const completedPrerequisites = prerequisiteTasks.filter((task) =>
        completedTasks.includes(task)
      ).length;
      const allPrerequisitesCompleted =
        completedPrerequisites === prerequisiteTasks.length;

      // Create the list of tasks with the final task at the top
      const orderedTasks = [data.finalTask, ...data.tasks];

      return {
        boss,
        // Include information about whether the final task is unlocked
        tasks: orderedTasks,
        finalTask: data.finalTask,
        finalTaskUnlocked: allPrerequisitesCompleted,
        leftToComplete: data.leftToComplete,
        completed:
          data.tasks.filter((task) => completedTasks.includes(task)).length +
          (completedTasks.includes(data.finalTask) ? 1 : 0),
      };
    });
  },
});
