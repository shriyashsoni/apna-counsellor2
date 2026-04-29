import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  counselings: defineTable({
    name: v.string(),
    category: v.string(), // Engineering / Medical
    region: v.string(),   // India / Abroad
    exam: v.optional(v.string()),
    officialUrl: v.optional(v.string()),
    description: v.optional(v.string()),
  }).searchIndex("by_name", {
    searchField: "name",
  }),
  
  colleges: defineTable({
    counselingId: v.id("counselings"),
    name: v.string(),
    location: v.optional(v.string()),
    type: v.string(), // Government / Private
    fees: v.optional(v.string()),
    placementStats: v.optional(v.string()),
    aisheCode: v.optional(v.string()),
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
  }),
  
  processes: defineTable({
    counselingId: v.id("counselings"),
    stepNumber: v.number(),
    title: v.string(),
    details: v.string(),
  }),

  mentors: defineTable({
    name: v.string(),
    expertise: v.string(), // e.g. "IIT Admissions", "Medical Counseling"
    bio: v.string(),
    rating: v.number(),
    avatar: v.optional(v.string()),
  }),

  sessions: defineTable({
    mentorId: v.id("mentors"),
    title: v.string(),
    description: v.string(),
    date: v.string(), // ISO string
    price: v.number(),
    availableSlots: v.number(),
  }),

  bookings: defineTable({
    sessionId: v.id("sessions"),
    studentId: v.string(), // Using a string placeholder for now
    status: v.string(),    // "booked", "completed", "cancelled"
    bookingDate: v.string(),
  }),
});
