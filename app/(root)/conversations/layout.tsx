"use client"

import ItemsList from '@/components/shared/items-list/ItemsList'
import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'
import { Loader2 } from 'lucide-react'
import React from 'react'
import DMConversationItem from './_components/DMConversationItem'
import CreateGroupDialog from './_components/CreateGroupDialog'
import GroupConversationItem from './_components/GroupConversationItem'

type Props = React.PropsWithChildren<object>

const ConversationsLayout = ({ children }: Props) => {
	const conversations = useQuery(api.conversations.get)

	return (
		<>
			<ItemsList title="Conversations" action={<CreateGroupDialog />}>{
				conversations === undefined
					? (
						<div className="w-full h-full flex items-center justify-center">
							<Loader2 className="animate-spin" />
						</div>
					)
					: conversations.length === 0
						? (
							<p className='w-full h-full flex items-center justify-center'>No se encontraron conversaciones</p>
						) : (
							conversations.map((conversation) => {
								if (!conversation.conversation.isGroup && conversation.otherMember) {
									return (
										<GroupConversationItem
											key={conversation.conversation._id}
											id={conversation.conversation._id}
											name={conversation.conversation.name || ""}
											lastMessageContent={conversation.lastMessage?.content}
											lastMessageSender={conversation.lastMessage?.sender}
											unseenCount={conversation.unseenCount} />
									);
								}

								return (
									<DMConversationItem
										key={conversation.conversation._id}
										id={conversation.conversation._id}
										username={conversation.otherMember?.username || ""}
										imageUrl={conversation.otherMember?.imageUrl || ""}
										lastMessageContent={conversation.lastMessage?.content}
										lastMessageSender={conversation.lastMessage?.sender}
										unseenCount={conversation.unseenCount} />
								);
							})
						)}
			</ItemsList>
			{children}
		</>
	)
}

export default ConversationsLayout