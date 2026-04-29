/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as batches from "../batches.js";
import type * as colleges from "../colleges.js";
import type * as counselings from "../counselings.js";
import type * as counselor from "../counselor.js";
import type * as mentors from "../mentors.js";
import type * as profiles from "../profiles.js";
import type * as ranks from "../ranks.js";
import type * as seed from "../seed.js";
import type * as seed_aishe from "../seed_aishe.js";
import type * as seed_bulk_colleges from "../seed_bulk_colleges.js";
import type * as seed_india_major from "../seed_india_major.js";
import type * as seed_international from "../seed_international.js";
import type * as seed_mentors from "../seed_mentors.js";
import type * as sessions from "../sessions.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  batches: typeof batches;
  colleges: typeof colleges;
  counselings: typeof counselings;
  counselor: typeof counselor;
  mentors: typeof mentors;
  profiles: typeof profiles;
  ranks: typeof ranks;
  seed: typeof seed;
  seed_aishe: typeof seed_aishe;
  seed_bulk_colleges: typeof seed_bulk_colleges;
  seed_india_major: typeof seed_india_major;
  seed_international: typeof seed_international;
  seed_mentors: typeof seed_mentors;
  sessions: typeof sessions;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
