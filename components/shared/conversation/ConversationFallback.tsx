import { Card } from '@/components/ui/card'
import React from 'react'

const ConversationFallback = () => {
	return (
		<Card className='hidden lg:flex h-full w-full p-2 items-center justify-center bg-secondary text-secondary-foreground'>
			Selecciona/Comienza una conversación para empezar!
		</Card>
	)
}

export default ConversationFallback