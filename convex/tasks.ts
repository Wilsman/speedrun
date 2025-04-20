import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Doc, Id } from "./_generated/dataModel";

export const list = query({
  args: {
    filter: v.union(
      v.literal("all"),
      v.literal("completed"),
      v.literal("incomplete"),
      v.object({ trader: v.string() })
    ),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    let tasksQuery = ctx.db.query("tasks").order("asc");
    
    if (typeof args.filter === "object" && "trader" in args.filter) {
      const trader = args.filter.trader;
      tasksQuery = tasksQuery.filter(q => q.eq(q.field("trader"), trader));
    }

    if (args.search) {
      const searchTerm = args.search;
      tasksQuery = tasksQuery.filter(q => q.eq(q.field("name"), searchTerm));
    }

    const tasks = await tasksQuery.collect();
    const userProgress = await ctx.db
      .query("userTaskProgress")
      .filter(q => q.eq(q.field("userId"), userId))
      .collect();

    const completedTaskIds = new Set(
      userProgress.map(progress => progress.taskId.toString())
    );

    const tasksWithProgress = tasks.map(task => ({
      ...task,
      completed: completedTaskIds.has(task._id.toString()),
    }));

    if (args.filter === "completed") {
      return tasksWithProgress.filter(task => task.completed);
    } else if (args.filter === "incomplete") {
      return tasksWithProgress.filter(task => !task.completed);
    }

    return tasksWithProgress;
  },
});

export const toggleTask = mutation({
  args: {
    taskId: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existingProgress = await ctx.db
      .query("userTaskProgress")
      .filter(q => 
        q.and(
          q.eq(q.field("userId"), userId),
          q.eq(q.field("taskId"), args.taskId)
        )
      )
      .unique();

    if (existingProgress) {
      await ctx.db.delete(existingProgress._id);
    } else {
      await ctx.db.insert("userTaskProgress", {
        userId,
        taskId: args.taskId,
        completed: true,
      });
    }
  },
});

// Initial task data
const TASKS = [
  // Prapor
  { trader: "Prapor", name: "Shooting Cans", order: 1 },
  { trader: "Prapor", name: "Debut", order: 2 },
  // ... rest of the tasks ...
];

export const initializeTasks = mutation({
  args: {},
  handler: async (ctx) => {
    for (const task of TASKS) {
      await ctx.db.insert("tasks", task);
    }
  },
});
