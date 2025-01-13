"use client"

import ConversationContainer from '@/components/shared/conversation/ConversationContainer'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useQuery } from 'convex/react'
import { Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import ChatInput from './_components/input/ChatInput'
import Header from './_components/Header'
import Body from './_components/body/Body'
import { useParams } from 'next/navigation'
import RemoveFriendDialog from './_components/dialogs/RemoveFriendDialog'
import DeleteGroupDialog from './_components/dialogs/DeleteGroupDialog'
import LeaveGroupDialog from './_components/dialogs/LeaveGroupDialog'

type Props = {
	params: {
		conversationId: Id<"conversations">
	}
}

const ConversationPage = ({ params }: Props) => {

	// Para un client component en nextjs 15 hay que hacer esto:
	const paramsRecogidoNuevaForma = useParams<{ conversationId: Id<"conversations">; }>()
	//	id: paramsRecogidoNuevaForma.conversationId
	// En lugar de esto directamente:
	//	id: conversationId

	const conversation = useQuery(api.conversation.get, {
		id: paramsRecogidoNuevaForma.conversationId
	})

	const [removeFriendDialogOpen, setRemoveFriendDialogOpen] = useState(false)
	const [deleteGroupDialogOpen, setDeleteGroupDialogOpen] = useState(false)
	const [leaveGroupDialogOpen, setLeaveGroupDialogOpen] = useState(false)
	const [callType, setCallType] = useState<"audio" | "video" | null>(null)

	return (
		conversation === undefined ?
			<div className='w-full h-full flex items-center justify-center'>
				<Loader2 className='h-8 w-8' />
			</div>
			:
			conversation === null ?
				<p className='w-full h-full flex items-center justify-center'>
					Conversation not found
				</p>
				:
				<ConversationContainer>
					<RemoveFriendDialog
						conversationId={paramsRecogidoNuevaForma.conversationId}
						open={removeFriendDialogOpen}
						setOpen={setRemoveFriendDialogOpen} />
					<LeaveGroupDialog
						conversationId={paramsRecogidoNuevaForma.conversationId}
						open={leaveGroupDialogOpen}
						setOpen={setLeaveGroupDialogOpen} />
					<DeleteGroupDialog
						conversationId={paramsRecogidoNuevaForma.conversationId}
						open={deleteGroupDialogOpen}
						setOpen={setDeleteGroupDialogOpen} />
					<Header
						name={(conversation.isGroup ? conversation.name : conversation.otherMember?.username) || ""}
						imageUrl={conversation.isGroup ? undefined : conversation.otherMember?.imageUrl}
						options={conversation.isGroup
							? [
								{
									label: "Leave group",
									destructive: false,
									onClick: () => setLeaveGroupDialogOpen(true),
								},
								{
									label: "Delete group",
									destructive: true,
									onClick: () => setDeleteGroupDialogOpen(true),
								},
							]
							: [
								{
									label: "Remove friend",
									destructive: true,
									onClick: () => setRemoveFriendDialogOpen(true),
								},
							]} />
					<Body />
					<ChatInput />
				</ConversationContainer>

	)
}

export default ConversationPage