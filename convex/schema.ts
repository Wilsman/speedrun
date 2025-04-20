import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  // Base tasks table - stores the task definitions
  tasks: defineTable({
    name: v.string(),
    trader: v.string(),
    order: v.number(),
  })
    .index("by_trader", ["trader"])
    .searchIndex("search_name", {
      searchField: "name",
      filterFields: ["trader"],
    }),

  // User's task progress
  userTaskProgress: defineTable({
    userId: v.id("users"),
    taskId: v.id("tasks"),
    completed: v.boolean(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_task", ["userId", "taskId"]),

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

  // --- New Tables for Collector ---
  collectorItems: defineTable({
    name: v.string(),
    order: v.number(),
  }).index("by_order", ["order"]), // Add index for ordering

  userCollectorProgress: defineTable({
    userId: v.id("users"),
    itemId: v.id("collectorItems"),
    // We only store found items, so 'completed' boolean isn't needed
  })
    .index("by_user_item", ["userId", "itemId"]) // Index for toggling
    .index("by_userId", ["userId"]),          // Index for listing user's progress
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
