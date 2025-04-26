/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as bosses from "../bosses.js";
import type * as collector from "../collector.js";
import type * as hideout from "../hideout.js";
import type * as http from "../http.js";
import type * as lightkeeper from "../lightkeeper.js";
import type * as loadCollectorItems from "../loadCollectorItems.js";
import type * as loadTasks from "../loadTasks.js";
import type * as migrate_collectoritemsimg from "../migrate_collectoritemsimg.js";
import type * as migrate_patch from "../migrate_patch.js";
import type * as migrate_prestigeProgress_patch from "../migrate_prestigeProgress_patch.js";
import type * as notes from "../notes.js";
import type * as prestige from "../prestige.js";
import type * as tasks from "../tasks.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  bosses: typeof bosses;
  collector: typeof collector;
  hideout: typeof hideout;
  http: typeof http;
  lightkeeper: typeof lightkeeper;
  loadCollectorItems: typeof loadCollectorItems;
  loadTasks: typeof loadTasks;
  migrate_collectoritemsimg: typeof migrate_collectoritemsimg;
  migrate_patch: typeof migrate_patch;
  migrate_prestigeProgress_patch: typeof migrate_prestigeProgress_patch;
  notes: typeof notes;
  prestige: typeof prestige;
  tasks: typeof tasks;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
