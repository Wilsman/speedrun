import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

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

    // --- Logging Start ---
    console.log(`tasks.list called with filter: ${JSON.stringify(args.filter)}, search: '${args.search ?? ''}'`);

    // --- Optimized Task Fetching ---
    let tasksQuery;

    if (args.search) {
      // Use search index

      // Extract trader filter value *before* the callback
      let traderToFilter: string | undefined = undefined;
      if (typeof args.filter === "object" && "trader" in args.filter) {
        traderToFilter = args.filter.trader;
      }

      tasksQuery = ctx.db
        .query("tasks")
        .withSearchIndex("search_name", (q) => {
          let query = q.search("name", args.search!);
          // Apply trader filter using the pre-extracted value
          if (traderToFilter !== undefined) {
            query = query.eq("trader", traderToFilter);
          }
          return query;
        });
      // Note: Search results don't guarantee order, so we sort later
    } else if (typeof args.filter === "object" && "trader" in args.filter) {
      // Use trader index
      const traderValue = args.filter.trader; // Extract the string value
      tasksQuery = ctx.db
        .query("tasks")
        .withIndex("by_trader", (q) => q.eq("trader", traderValue)) // Use the extracted string value
        .order("asc"); // Order by default task order
    } else {
      // Filter is "all", "completed", or "incomplete" - fetch all tasks initially
      tasksQuery = ctx.db.query("tasks").order("asc"); // Order by default task order
    }

    const tasks = await tasksQuery.collect();

    // --- Logging Task Count ---
    console.log(`tasks.list: Fetched ${tasks.length} initial tasks.`);

    if (tasks.length === 0) {
      return []; // No tasks match the initial filter/search
    }

    const taskIds = tasks.map((task) => task._id);

    // --- Optimized Progress Fetching ---
    // Fetch only progress relevant to the retrieved tasks for the current user
    const userProgress = await ctx.db
      .query("userTaskProgress")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      // Filter progress to only include tasks we are interested in
      .filter((q) =>
        q.or(...taskIds.map((id) => q.eq(q.field("taskId"), id)))
      )
      .collect();

    // --- Logging Progress Count ---
    console.log(`tasks.list: Fetched ${userProgress.length} progress entries for relevant tasks.`);

    const completedTaskIds = new Set(
      userProgress.map((progress) => progress.taskId.toString())
    );

    // --- Combine and Final Filter ---
    let tasksWithProgress = tasks.map((task) => ({
      ...task,
      completed: completedTaskIds.has(task._id.toString()),
    }));

    // Apply completion status filter if requested
    if (args.filter === "completed") {
      tasksWithProgress = tasksWithProgress.filter((task) => task.completed);
    } else if (args.filter === "incomplete") {
      tasksWithProgress = tasksWithProgress.filter((task) => !task.completed);
    }

    // Ensure consistent sorting if search was used, as search index doesn't preserve order
    if (args.search) {
        tasksWithProgress.sort((a, b) => a.order - b.order);
    }

    // --- Logging Final Count ---
    console.log(`tasks.list: Returning ${tasksWithProgress.length} tasks.`);

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
