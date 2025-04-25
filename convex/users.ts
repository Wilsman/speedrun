import { mutation } from "./_generated/server";

/**
 * Ensures a user document exists for the currently authenticated user.
 * Checks by tokenIdentifier and creates a new user document if one doesn't exist.
 * 
 * @returns The Convex document ID (_id) of the user.
 * @throws Error if the user is not authenticated.
 */
export const ensureUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Called ensureUser without authentication present");
    }

    // Check if user already exists
    const user = await ctx.db
      .query("users")
      // Use filter directly; Convex should use the index if defined
      .filter(q => q.eq(q.field("tokenIdentifier" as any), identity.tokenIdentifier))
      .unique();

    // If user exists, return their ID
    if (user !== null) {
      return user._id;
    }

    // If user doesn't exist, create them
    const userId = await ctx.db.insert("users", {
      // Workaround: Explicitly cast to allow setting tokenIdentifier
      tokenIdentifier: identity.tokenIdentifier,
      // name: identity.name, // Optional: Sync name if available
      // email: identity.email, // Optional: Sync email if available
    } as any); // Cast the whole object

    return userId;
  },
});
