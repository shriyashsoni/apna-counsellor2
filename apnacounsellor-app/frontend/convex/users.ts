import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

export const getById = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const listByRole = query({
  args: { role: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.role) {
      return await ctx.db
        .query("users")
        .withIndex("by_role", (q) => q.eq("role", args.role!))
        .collect();
    }
    return await ctx.db.query("users").collect();
  },
});

export const listMentors = query({
  args: {
    search: v.optional(v.string()),
    skill: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let mentors = await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", "mentor"))
      .collect();

    if (args.search) {
      const s = args.search.toLowerCase();
      mentors = mentors.filter(
        (m) =>
          m.name.toLowerCase().includes(s) ||
          (m.college || "").toLowerCase().includes(s) ||
          (m.branch || "").toLowerCase().includes(s)
      );
    }
    if (args.skill) {
      mentors = mentors.filter((m) =>
        (m.skills || []).includes(args.skill!)
      );
    }
    return mentors
      .map((m) => ({ ...m, passwordHash: undefined }))
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 50);
  },
});

export const createUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    passwordHash: v.string(),
    role: v.string(),
    phone: v.optional(v.string()),
    createdAt: v.string(),
    // All optional role-specific fields
    college: v.optional(v.string()),
    course: v.optional(v.string()),
    branch: v.optional(v.string()),
    year: v.optional(v.string()),
    linkedin: v.optional(v.string()),
    termsAccepted: v.optional(v.boolean()),
    collegeIdUrl: v.optional(v.string()),
    profilePhoto: v.optional(v.string()),
    blocked: v.optional(v.boolean()),
    verified: v.optional(v.boolean()),
    profileComplete: v.optional(v.boolean()),
    bio: v.optional(v.string()),
    avatar: v.optional(v.string()),
    // Student
    academicClass: v.optional(v.string()),
    exam: v.optional(v.string()),
    marks: v.optional(v.string()),
    rank: v.optional(v.string()),
    interests: v.optional(v.array(v.string())),
    budget: v.optional(v.string()),
    preferredLocation: v.optional(v.string()),
    onboardingComplete: v.optional(v.boolean()),
    // Admin/Counsellor
    qualification: v.optional(v.string()),
    experience: v.optional(v.string()),
    specialization: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    if (existing) throw new Error("Email already registered");

    const isStudent = args.role === "student";
    const isMentor = args.role === "mentor";

    const doc: any = {
      name: args.name,
      email: args.email,
      passwordHash: args.passwordHash,
      role: args.role,
      phone: args.phone || "",
      avatar: args.avatar || args.profilePhoto || "",
      profilePhoto: args.profilePhoto || "",
      bio: args.bio || "",
      verified: args.verified ?? false,
      blocked: args.blocked ?? false,
      profileComplete: args.profileComplete ?? false,
      college: args.college || "",
      course: args.course || "",
      branch: args.branch || "",
      year: args.year || "",
      linkedin: args.linkedin || "",
      termsAccepted: args.termsAccepted || false,
      collegeIdUrl: args.collegeIdUrl || "",
      createdAt: args.createdAt,
    };

    if (isMentor) {
      Object.assign(doc, {
        approved: false, approvalStatus: "not_submitted", onboardingStep: 1,
        onboardingComplete: false, skills: [], pricing: 500, pricing30: 300,
        pricing60: 500, availability: [], weeklySlots: [], rating: 0,
        reviewsCount: 0, sessionsCount: 0, earnings: 0, profileViews: 0,
        responseTime: "< 1 hour", headline: "", about: "", whyBook: "",
        helpCategories: [], languages: ["English", "Hindi"],
        sessionTypes: ["1:1 Call"], instantBooking: false,
        achievements: [], internships: [], entranceExam: "", rankPercentile: "",
      });
    } else if (isStudent) {
      Object.assign(doc, {
        academicClass: args.academicClass || "",
        exam: args.exam || "",
        marks: args.marks || "",
        rank: args.rank || "",
        interests: args.interests || [],
        budget: args.budget || "",
        preferredLocation: args.preferredLocation || "",
        onboardingComplete: args.onboardingComplete ?? false,
      });
    } else {
      // admin / counsellor
      Object.assign(doc, {
        qualification: args.qualification || "",
        experience: args.experience || "",
        specialization: args.specialization || [],
      });
    }

    return await ctx.db.insert("users", doc);
  },
});

export const updateUser = mutation({
  args: {
    id: v.id("users"),
    data: v.any(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, args.data);
    return await ctx.db.get(args.id);
  },
});

export const blockUser = mutation({
  args: {
    id: v.id("users"),
    blocked: v.boolean(),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      blocked: args.blocked,
      blockedReason: args.reason,
    });
  },
});

export const approvementor = mutation({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      approved: true,
      approvalStatus: "approved",
      verified: true,
    });
  },
});

export const deleteUser = mutation({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const countByRole = query({
  args: { role: v.string() },
  handler: async (ctx, args) => {
    const users = await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", args.role))
      .collect();
    return users.length;
  },
});
