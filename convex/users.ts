import { mutation, internalQuery, QueryCtx } from "./_generated/server";
import { v } from "convex/values";

/**
 * Gets the user record associated with the current session.
 * @param ctx - The query or mutation context.
 * @returns The user document or null if not authenticated.
 */
export async function getUser(ctx: QueryCtx) {
  const auth = await ctx.auth.getUserIdentity();
  if (!auth) {
    console.warn("User is not authenticated.");
    return null;
  }
  const user = await ctx.db
    .query("users")
    .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", auth.tokenIdentifier))
    .unique();

  if (!user) {
    // This can happen if the user was created recently
    console.warn(`User not found for tokenIdentifier: ${auth.tokenIdentifier}`);
    // Optionally, you could attempt to create the user here if needed,
    // but ensureUser is designed for that purpose.
    return null;
  }
  return user;
}

/**
 * Ensures a user record exists for the current session.
 * If the user doesn't exist, it creates a new user record.
 */
export const ensureUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called ensureUser without authentication present");
    }

    // Check if we've already stored this identity before.
    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (user !== null) {
      // If we've seen this identity before but the name has changed, patch the user.
      if (user.name !== identity.name) {
        await ctx.db.patch(user._id, { name: identity.name });
      }
      return user._id;
    }

    // If it's a new identity, create a new user.
    return await ctx.db.insert("users", {
      name: identity.name!,
      tokenIdentifier: identity.tokenIdentifier,
    });
  },
});

// Internal query to get user by token identifier (if needed elsewhere)
export const getUserByTokenIdentifier = internalQuery({
  args: { tokenIdentifier: v.string() },
  async handler(ctx, args) {
    return await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
      .unique();
  },
});
