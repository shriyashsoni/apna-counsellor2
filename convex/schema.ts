import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  
  users: defineTable({
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    image: v.optional(v.string()),
    role: v.optional(v.string()), // "student", "mentor", "admin"
    phone: v.optional(v.string()),
    bio: v.optional(v.string()),
    blocked: v.optional(v.boolean()),
    verified: v.optional(v.boolean()),
    createdAt: v.optional(v.string()),
    
    // Auth fields (making them optional to avoid conflict with authTables)
    emailVerificationTime: v.optional(v.number()),
    phoneVerificationTime: v.optional(v.number()),

    // Unified Profile Fields (Student)
    academicClass: v.optional(v.string()),
    exam: v.optional(v.string()),
    marks: v.optional(v.string()),
    rank: v.optional(v.string()),
    interests: v.optional(v.array(v.string())),
    budget: v.optional(v.string()),
    preferredLocation: v.optional(v.string()),
    onboardingComplete: v.optional(v.boolean()),
    
    // Unified Profile Fields (Mentor)
    college: v.optional(v.string()),
    course: v.optional(v.string()),
    branch: v.optional(v.string()),
    year: v.optional(v.string()),
    linkedin: v.optional(v.string()),
    approved: v.optional(v.boolean()),
    skills: v.optional(v.array(v.string())),
    pricing: v.optional(v.number()),
    rating: v.optional(v.number()),
    reviewsCount: v.optional(v.number()),
    sessionsCount: v.optional(v.number()),
    earnings: v.optional(v.number()),
    headline: v.optional(v.string()),
    about: v.optional(v.string()),
  }).index("by_email", ["email"]).index("by_role", ["role"]),


  // Legacy/Compatibility table (keeping for now to avoid breaking existing code)
  profiles: defineTable({
    userId: v.string(), // Clerk ID
    email: v.optional(v.string()),
    fullName: v.string(),
    phone: v.string(),
    city: v.string(),
    examType: v.string(),
    targetYear: v.number(),
    rank: v.optional(v.number()),
    category: v.string(),
    interestedStates: v.array(v.string()),
    onboarded: v.boolean(),
  }).index("by_userId", ["userId"]).index("by_email", ["email"]),


  // --- CONTENT & DATA TABLES ---

  colleges: defineTable({
    collegeId: v.optional(v.string()),
    counselingId: v.optional(v.id("counselings")),
    aisheCode: v.optional(v.string()),
    name: v.string(),
    shortName: v.optional(v.string()),
    state: v.optional(v.string()),
    city: v.optional(v.string()),
    location: v.optional(v.string()),
    type: v.optional(v.string()),
    nirfRank: v.optional(v.number()),
    established: v.optional(v.number()),
    annualFee: v.optional(v.string()),
    avgPackage: v.optional(v.string()),
    website: v.optional(v.string()),
    branches: v.optional(v.array(v.string())),
    cutoffs: v.optional(v.any()),
    imageUrl: v.optional(v.string()),
    description: v.optional(v.string()),
    createdAt: v.optional(v.string()),
  }).index("by_college_id", ["collegeId"])
    .index("by_state", ["state"])
    .index("by_counseling", ["counselingId"])
    .searchIndex("by_name", {
      searchField: "name",
    }),

  counselings: defineTable({
    name: v.string(),
    category: v.string(), // Engineering / Medical
    region: v.string(),   // India / Abroad
    exam: v.optional(v.string()),
    officialUrl: v.optional(v.string()),
    description: v.optional(v.string()),
    links: v.optional(v.array(v.object({ label: v.string(), url: v.string() }))),
  }).searchIndex("by_name", {
    searchField: "name",
  }),

  ranks: defineTable({
    collegeId: v.id("colleges"),
    courseName: v.string(),
    category: v.string(), // General, OBC, SC, ST, etc.
    year: v.number(),
    openingRank: v.number(),
    closingRank: v.number(),
  }).index("by_college", ["collegeId"]),

  processes: defineTable({
    counselingId: v.id("counselings"),
    stepNumber: v.number(),
    title: v.string(),
    details: v.string(),
  }).index("by_counseling", ["counselingId"]),

  // --- LEGACY COMPATIBILITY TABLES ---

  mentors: defineTable({
    name: v.string(),
    expertise: v.string(),
    bio: v.string(),
    rating: v.number(),
    avatar: v.optional(v.string()),
  }),

  bookings: defineTable({
    sessionId: v.id("sessions"),
    studentId: v.string(), 
    status: v.string(),
    bookingDate: v.string(),
  }).index("by_session", ["sessionId"]).index("by_student", ["studentId"]),

  // --- MENTORSHIP & SESSIONS ---

  sessions: defineTable({
    sessionId: v.optional(v.string()),
    studentId: v.optional(v.string()),
    studentName: v.optional(v.string()),
    mentorId: v.optional(v.string()),
    mentorName: v.optional(v.string()),
    date: v.optional(v.string()),
    timeSlot: v.optional(v.string()),
    topic: v.optional(v.string()),
    status: v.optional(v.string()),
    price: v.optional(v.number()),
    createdAt: v.optional(v.string()),
    availableSlots: v.optional(v.number()),
    description: v.optional(v.string()),
    title: v.optional(v.string()),
  }).index("by_mentor", ["mentorId"]).index("by_student", ["studentId"]),

  payments: defineTable({
    paymentId: v.string(),
    amount: v.number(),
    currency: v.string(),
    status: v.string(),
    userId: v.string(),
    mentorId: v.string(),
    sessionId: v.optional(v.string()),
    createdAt: v.string(),
  }).index("by_payment_id", ["paymentId"]).index("by_user", ["userId"]),

  reviews: defineTable({
    reviewId: v.string(),
    mentorId: v.string(),
    reviewerId: v.string(),
    reviewerName: v.string(),
    rating: v.number(),
    comment: v.string(),
    createdAt: v.string(),
  }).index("by_mentor", ["mentorId"]),

  batches: defineTable({
    batchId: v.string(),
    title: v.string(),
    mentorId: v.string(),
    maxStudents: v.number(),
    currentStudents: v.number(),
    price: v.number(),
    startDate: v.string(),
    status: v.string(),
    createdAt: v.string(),
  }).index("by_mentor", ["mentorId"]),

  notifications: defineTable({
    userId: v.string(),
    title: v.string(),
    message: v.string(),
    type: v.string(), // "info", "warning", "success"
    read: v.boolean(),
    createdAt: v.string(),
  }).index("by_user", ["userId"]),

  chatHistory: defineTable({
    sessionId: v.string(),
    userId: v.string(),
    role: v.string(),
    content: v.string(),
    timestamp: v.string(),
  }).index("by_session", ["sessionId"]),

  // --- SUPPORT & DOCUMENTS ---

  documents: defineTable({
    userId: v.string(),
    name: v.string(),
    fileId: v.string(), // Convex Storage ID
    type: v.string(), // "rank_card", "aadhaar", etc.
    status: v.string(), // "pending", "verified", "rejected"
  }).index("by_userId", ["userId"]),

  support: defineTable({
    userId: v.string(),
    subject: v.string(),
    status: v.string(), // "open", "closed"
    priority: v.string(), // "low", "medium", "high"
  }).index("by_userId", ["userId"]),

  messages: defineTable({
    ticketId: v.id("support"),
    sender: v.string(), // "user" or "admin"
    text: v.string(),
  }).index("by_ticketId", ["ticketId"]),
});
