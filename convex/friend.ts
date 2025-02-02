import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";
import { getUserByClerkId } from "./_utils";
import { currentUser } from "@clerk/nextjs/server";

export const remove = mutation({
	args: {
		conversationId: v.id("conversations"),
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity()

		if (!identity) {
			throw new Error("Sin autorización")
		}

		const currentUser = await getUserByClerkId({
			ctx,
			clerkId: identity.subject
		})

		if (!currentUser) {
			throw new ConvexError("No se encoontró el usuario")
		}

		const conversation = await ctx.db.get(args.conversationId)
		if (!conversation) {
			throw new ConvexError("No se encontró la conversación")
		}

		const memberShips = await ctx.db
			.query("conversationMembers")
			.withIndex("by_conversationId", q => q.eq("conversationId", args.conversationId))
			.collect()
		if (!memberShips || memberShips.length !== 2) {
			throw new ConvexError("Esta conversación no tiene miembros")
		}

		const friendShip = await ctx.db
			.query("friends")
			.withIndex("by_conversationId", q => { return q.eq("conversationId", args.conversationId) })
			.unique()
		if (!friendShip) {
			throw new ConvexError("No se encontró el amigo")
		}

		const messages = await ctx.db
			.query("messages")
			.withIndex("by_conversationId", q => q.eq("conversationId", args.conversationId))
			.collect()

		await ctx.db.delete(args.conversationId)
		await ctx.db.delete(friendShip._id)
		await Promise.all(memberShips.map(async memberShip => {
			await ctx.db.delete(memberShip._id)
		}))
		await Promise.all(messages.map(async message => {
			await ctx.db.delete(message._id)
		}))
	}
})