import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getUser } from "./users";

/**
 * Query to get the user's note.
 * Returns the note content as a string, or null if no note exists.
 */
export const getNote = query({
  args: {},
  returns: v.union(v.object({ _id: v.id("userNotes"), content: v.string() }), v.null()),
  handler: async (ctx) => {
    const user = await getUser(ctx);
    if (!user) {
      // Should not happen if called from an authenticated context
      console.error("User not found in getNote");
      return null;
    }

    const note = await ctx.db
      .query("userNotes")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .unique();

    // Return only the fields defined in the 'returns' validator
    if (note) {
      return { _id: note._id, content: note.content };
    } else {
      return null;
    }
  },
});

/**
 * Mutation to save the user's note.
 * Upserts the note content for the authenticated user.
 */
export const saveNote = mutation({
  args: { content: v.string() },
  returns: v.null(),
  handler: async (ctx, { content }) => {
    const user = await getUser(ctx);
    if (!user) {
      // Should not happen if called from an authenticated context
      console.error("User not found in saveNote");
      return null;
    }

    const existingNote = await ctx.db
      .query("userNotes")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .unique();

    if (existingNote) {
      // Update existing note
      await ctx.db.patch(existingNote._id, { content });
    } else {
      // Create new note
      await ctx.db.insert("userNotes", {
        userId: user._id,
        content,
      });
    }
    return null;
  },
});
