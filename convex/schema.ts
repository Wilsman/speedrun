import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  // Explicitly define users table to include tokenIdentifier
  users: defineTable({
    ...authTables.users.validator.fields, // Merge specific field validators from authTables
    // Fields required by our app - Make optional to handle existing docs
    tokenIdentifier: v.optional(v.string()),
  }).index("by_tokenIdentifier", ["tokenIdentifier"])
    .index("email", ["email"]), // Correct index name for email lookup by @convex-dev/auth

  // User's task progress - Use taskIdentifier string instead of taskId
  userTaskProgress: defineTable({
    userId: v.id("users"),
    // Restore taskIdentifier to required
    taskIdentifier: v.string(),
    completed: v.boolean(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_taskIdentifier", ["userId", "taskIdentifier"]),

  // User's overall progress
  userProgress: defineTable({
    userId: v.id("users"),
    completedTasks: v.array(v.string()),
    completedBossTasks: v.array(v.string()),
    hideoutProgress: v.object({
      items: v.record(v.string(), v.number()),
      skills: v.record(v.string(), v.number()),
      traders: v.record(v.string(), v.number()),
    }),
    prestigeProgress: v.object({
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
    }),
  }).index("by_user", ["userId"]),

  // --- Lightkeeper Quest Tables ---
  lightkeeperQuests: defineTable({
    name: v.string(),
    wikiUrl: v.optional(v.string()),
  }).index("by_name", ["name"]),

  userLightkeeperProgress: defineTable({
    userId: v.id("users"),
    questId: v.id("lightkeeperQuests"),
    completed: v.boolean(),
    subTasksCompleted: v.optional(v.array(v.number())),
  })
    .index("by_user_quest", ["userId", "questId"])
    .index("by_user", ["userId"]),

  // --- New Tables for Collector ---
  collectorItems: defineTable({
    name: v.string(),
    order: v.number(),
    img: v.optional(v.string()),
  }).index("by_order", ["order"]), // Add index for ordering

  userCollectorProgress: defineTable({
    userId: v.id("users"),
    itemId: v.id("collectorItems"),
    // We only store found items, so 'completed' boolean isn't needed
  })
    .index("by_user_item", ["userId", "itemId"]) // Index for toggling
    .index("by_userId", ["userId"]),          // Index for listing user's progress

  // User Notes
  userNotes: defineTable({
    userId: v.id("users"),
    content: v.string(),
  }).index("by_userId", ["userId"]),
};

export default defineSchema({
  ...authTables, // Spread base auth tables first
  ...applicationTables, // Spread our tables
});
