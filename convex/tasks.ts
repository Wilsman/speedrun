import { v } from "convex/values";
import { mutation, query } from "./_generated/server"; 
import { getAuthUserId } from "@convex-dev/auth/server";

// REMOVED list query as tasks are now local
// export const list = query({ ... });

// NEW Query to get user's progress for all tasks
export const getProgress = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      console.log("getProgress: No user ID found, returning empty progress.");
      return {}; // Return empty object if not authenticated
    }

    console.log(`getProgress: Fetching progress for user ${userId}`);
    const progressEntries = await ctx.db
      .query("userTaskProgress")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    console.log(`getProgress: Found ${progressEntries.length} progress entries.`);

    // Convert the array of progress entries into a Record<string, boolean>
    const progressMap: Record<string, boolean> = {};
    for (const entry of progressEntries) {
      progressMap[entry.taskIdentifier] = entry.completed;
    }

    return progressMap;
  },
});

export const toggleTask = mutation({
  args: {
    taskIdentifier: v.string(), // New argument: "Trader:Task Name"
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Query by userId and the new taskIdentifier
    const existingProgress = await ctx.db
      .query("userTaskProgress")
      // Assuming the schema will be updated to have taskIdentifier indexed
      .withIndex("by_user_and_taskIdentifier", (q) =>
        q.eq("userId", userId).eq("taskIdentifier", args.taskIdentifier)
      )
      .unique();

    if (existingProgress) {
      await ctx.db.delete(existingProgress._id);
    } else {
      // Insert using the new taskIdentifier
      await ctx.db.insert("userTaskProgress", {
        userId,
        taskIdentifier: args.taskIdentifier, // New field
        completed: true, // Assuming toggle always sets to completed
      });
    }
  },
});

// REMOVED initializeTasks mutation as tasks table is removed
// Initial task data
// const TASKS = [ ... ];
// export const initializeTasks = mutation({ ... });
