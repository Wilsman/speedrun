import { internalMutation } from "./_generated/server";
import taskData from "./tasks.json";

export const load = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Clear existing tasks
    const existingTasks = await ctx.db.query("tasks").collect();
    for (const task of existingTasks) {
      await ctx.db.delete(task._id);
    }

    // Load new tasks
    for (const [trader, tasks] of Object.entries(taskData)) {
      for (const task of tasks) {
        await ctx.db.insert("tasks", {
          name: task.name,
          trader,
          order: task.order,
        });
      }
    }
  },
});
