/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as ai from "../ai.js";
import type * as auth from "../auth.js";
import type * as batches from "../batches.js";
import type * as cleanup from "../cleanup.js";
import type * as colleges from "../colleges.js";
import type * as counselings from "../counselings.js";
import type * as counselor from "../counselor.js";
import type * as diagnostics from "../diagnostics.js";
import type * as http from "../http.js";
import type * as mentors from "../mentors.js";
import type * as migration from "../migration.js";
import type * as payments from "../payments.js";
import type * as profiles from "../profiles.js";
import type * as rankings from "../rankings.js";
import type * as ranks from "../ranks.js";
import type * as razorpay from "../razorpay.js";
import type * as scraper from "../scraper.js";
import type * as seed from "../seed.js";
import type * as seed_aishe from "../seed_aishe.js";
import type * as seed_bulk_colleges from "../seed_bulk_colleges.js";
import type * as seed_clean from "../seed_clean.js";
import type * as seed_counselings from "../seed_counselings.js";
import type * as seed_data from "../seed_data.js";
import type * as seed_deep_links from "../seed_deep_links.js";
import type * as seed_deep_links_2 from "../seed_deep_links_2.js";
import type * as seed_india_major from "../seed_india_major.js";
import type * as seed_international from "../seed_international.js";
import type * as seed_mentors from "../seed_mentors.js";
import type * as seed_resources_massive from "../seed_resources_massive.js";
import type * as seed_test from "../seed_test.js";
import type * as sessions from "../sessions.js";
import type * as subscriptions from "../subscriptions.js";
import type * as sync from "../sync.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  ai: typeof ai;
  auth: typeof auth;
  batches: typeof batches;
  cleanup: typeof cleanup;
  colleges: typeof colleges;
  counselings: typeof counselings;
  counselor: typeof counselor;
  diagnostics: typeof diagnostics;
  http: typeof http;
  mentors: typeof mentors;
  migration: typeof migration;
  payments: typeof payments;
  profiles: typeof profiles;
  rankings: typeof rankings;
  ranks: typeof ranks;
  razorpay: typeof razorpay;
  scraper: typeof scraper;
  seed: typeof seed;
  seed_aishe: typeof seed_aishe;
  seed_bulk_colleges: typeof seed_bulk_colleges;
  seed_clean: typeof seed_clean;
  seed_counselings: typeof seed_counselings;
  seed_data: typeof seed_data;
  seed_deep_links: typeof seed_deep_links;
  seed_deep_links_2: typeof seed_deep_links_2;
  seed_india_major: typeof seed_india_major;
  seed_international: typeof seed_international;
  seed_mentors: typeof seed_mentors;
  seed_resources_massive: typeof seed_resources_massive;
  seed_test: typeof seed_test;
  sessions: typeof sessions;
  subscriptions: typeof subscriptions;
  sync: typeof sync;
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
