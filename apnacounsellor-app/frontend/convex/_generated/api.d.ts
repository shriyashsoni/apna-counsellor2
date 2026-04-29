/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as batches from "../batches.js";
import type * as chatHistory from "../chatHistory.js";
import type * as colleges from "../colleges.js";
import type * as counsellorApps from "../counsellorApps.js";
import type * as notifications from "../notifications.js";
import type * as payments from "../payments.js";
import type * as postedSessions from "../postedSessions.js";
import type * as reviews from "../reviews.js";
import type * as sessions from "../sessions.js";
import type * as users from "../users.js";
import type * as withdrawals from "../withdrawals.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  batches: typeof batches;
  chatHistory: typeof chatHistory;
  colleges: typeof colleges;
  counsellorApps: typeof counsellorApps;
  notifications: typeof notifications;
  payments: typeof payments;
  postedSessions: typeof postedSessions;
  reviews: typeof reviews;
  sessions: typeof sessions;
  users: typeof users;
  withdrawals: typeof withdrawals;
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
