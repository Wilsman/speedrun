import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

// Define prestige requirements for each level
export const PRESTIGE_REQUIREMENTS: Record<number, {
  name: string;
  level: number;
  strength: number;
  endurance: number;
  charisma: number;
  intelligenceCenter: number;
  security: number;
  restSpace: number;
  roubles: number;
  figurines: string[];
  scavsKilled: number;
  pmcsKilled: number;
  labsExtracted: boolean;
}> = {
  1: {
    name: "A New Beginning - Prestige 1",
    level: 55,
    strength: 20,
    endurance: 20,
    charisma: 15,
    intelligenceCenter: 2,
    security: 3,
    restSpace: 3,
    roubles: 20000000,
    figurines: [
      "Bear operative figurine",
      "Cultist figurine",
      "Den figurine",
      "Killa figurine",
      "Politician Mutkevich figurine",
      "Reshala figurine",
      "Ryzhy figurine",
      "Scav figurine",
      "Tagilla figurine",
      "USEC operative figurine"
    ],
    scavsKilled: 50,
    pmcsKilled: 0,
    labsExtracted: true,
  },
  2: {
    name: "A New Beginning - Prestige 2",
    level: 55,
    strength: 20,
    endurance: 20,
    charisma: 15,
    intelligenceCenter: 2,
    security: 3,
    restSpace: 3,
    roubles: 20000000,
    figurines: [
      "Bear operative figurine (FIR)",
      "Cultist figurine (FIR)",
      "Den figurine (FIR)",
      "Killa figurine (FIR)",
      "Politician Mutkevich figurine (FIR)",
      "Reshala figurine (FIR)",
      "Ryzhy figurine (FIR)",
      "Scav figurine (FIR)",
      "Tagilla figurine (FIR)",
      "USEC operative figurine (FIR)"
    ],
    scavsKilled: 0,
    pmcsKilled: 15,
    labsExtracted: true,
  },
};

export const getPrestigeProgress = query({
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
      };
    }

    return {
      prestigeProgress: userProgress.prestigeProgress,
    };
  },
});

export const updatePrestigeProgress = mutation({
  args: {
    currentPrestige: v.number(),
    level: v.number(),
    strength: v.number(),
    endurance: v.number(),
    charisma: v.number(),
    intelligenceCenter: v.number(),
    security: v.number(),
    restSpace: v.number(),
    roubles: v.number(),
    collectorComplete: v.boolean(),
    figurines: v.array(v.string()),
    scavsKilled: v.number(),
    pmcsKilled: v.number(),
    labsExtracted: v.boolean(),
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
          items: {},
          skills: {},
          traders: {},
        },
        prestigeProgress: {
          currentPrestige: args.currentPrestige,
          level: args.level,
          strength: args.strength,
          endurance: args.endurance,
          charisma: args.charisma,
          intelligenceCenter: args.intelligenceCenter,
          security: args.security,
          restSpace: args.restSpace,
          roubles: args.roubles,
          collectorComplete: args.collectorComplete,
          figurines: args.figurines,
          scavsKilled: args.scavsKilled,
          pmcsKilled: args.pmcsKilled,
          labsExtracted: args.labsExtracted,
        },
      });
      return;
    }

    await ctx.db.patch(userProgress._id, {
      prestigeProgress: {
        currentPrestige: args.currentPrestige,
        level: args.level,
        strength: args.strength,
        endurance: args.endurance,
        charisma: args.charisma,
        intelligenceCenter: args.intelligenceCenter,
        security: args.security,
        restSpace: args.restSpace,
        roubles: args.roubles,
        collectorComplete: args.collectorComplete,
        figurines: args.figurines,
        scavsKilled: args.scavsKilled,
        pmcsKilled: args.pmcsKilled,
        labsExtracted: args.labsExtracted,
      },
    });
  },
});

// Add a function to get prestige requirements for a specific level
export const getPrestigeRequirements = query({
  args: {
    prestigeLevel: v.number(),
  },
  handler: async (ctx, args) => {
    const { prestigeLevel } = args;
    
    if (prestigeLevel in PRESTIGE_REQUIREMENTS) {
      return PRESTIGE_REQUIREMENTS[prestigeLevel];
    }
    
    throw new Error(`Prestige level ${prestigeLevel} not found`);
  },
});

// Add a function to calculate prestige completion
export const calculatePrestigeCompletion = query({
  args: {
    prestigeLevel: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const { prestigeLevel } = args;
    if (!(prestigeLevel in PRESTIGE_REQUIREMENTS)) {
      throw new Error(`Prestige level ${prestigeLevel} not found`);
    }

    const requirements = PRESTIGE_REQUIREMENTS[prestigeLevel];
    const userProgress = await ctx.db
      .query("userProgress")
      .withIndex("by_user", q => q.eq("userId", userId))
      .unique();

    if (!userProgress) return { completedRequirements: 0, totalRequirements: 0, percentage: 0 };

    const progress = userProgress.prestigeProgress;
    
    // Check each requirement
    const requirementChecks = [
      progress.level >= requirements.level,
      progress.strength >= requirements.strength,
      progress.endurance >= requirements.endurance,
      progress.charisma >= requirements.charisma,
      progress.intelligenceCenter >= requirements.intelligenceCenter,
      progress.security >= requirements.security,
      progress.restSpace >= requirements.restSpace,
      progress.roubles >= requirements.roubles,
      progress.collectorComplete,
      // Check if all required figurines are collected
      requirements.figurines.every((fig: string) => progress.figurines.includes(fig)),
      // Check scavs killed requirement if applicable
      requirements.scavsKilled > 0 ? progress.scavsKilled >= requirements.scavsKilled : true,
      // Check PMCs killed requirement if applicable
      requirements.pmcsKilled > 0 ? progress.pmcsKilled >= requirements.pmcsKilled : true,
      // Check Labs extraction
      requirements.labsExtracted ? progress.labsExtracted : true,
    ];

    const totalRequirements = requirementChecks.length;
    const completedRequirements = requirementChecks.filter(Boolean).length;
    const percentage = (completedRequirements / totalRequirements) * 100;

    return {
      completedRequirements,
      totalRequirements,
      percentage,
      requirementChecks,
    };
  },
});
