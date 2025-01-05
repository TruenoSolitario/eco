import { v } from "convex/values"
import { defineSchema, defineTable } from "convex/server"

export default defineSchema({
    users: defineTable({
        username: v.string(),
        imageUrl: v.string(),
        clerkId: v.string(),
        email: v.string(),
    })
        .index("by_email", ["email"])
        .index("by_clerkId", ["clerkId"]),
})