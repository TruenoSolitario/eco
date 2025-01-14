"use client"

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { api } from '@/convex/_generated/api'
import { useMutationState } from '@/hooks/useMutationState'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from 'convex/react'
import { ConvexError } from 'convex/values'
import { CirclePlus, X } from 'lucide-react'
import React, { useCallback, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const createGroupFormSchema = z.object({
	name: z.string().min(1, { message: "This field can't be empty" }),
	members: z.string().array().min(1, { message: "You must select at least 1 friend" })
})

const CreateGroupDialog = () => {
	const friends = useQuery(api.friends.get)

	const { mutate: createGroup, pending } = useMutationState(api.conversation.createGroup)

	const form = useForm<z.infer<typeof createGroupFormSchema>>({
		resolver: zodResolver(createGroupFormSchema),
		defaultValues: {
			name: "",
			members: [],
		}
	})
	const members = form.watch("members", [])

	const unselectedFriends = useMemo(() => {
		return friends ? friends.filter(friend => !members.includes(friend._id)) : []
	}, [friends, members])

	const handleSubmit = useCallback(
		async (values: z.infer<typeof createGroupFormSchema>) => {
			try {
				await createGroup({ name: values.name, members: values.members });
				form.reset();
				toast.success('Group created successfully!');
			} catch (error) {
				if (error instanceof ConvexError) {
					toast.error(`Error creating group: ${error.data}`);
				} else {
					toast.error('An unexpected error occurred while creating the group');
				}
				console.error('Group creation error:', error);
			}
		},
		[createGroup, form]
	);

	return (
		<Dialog>
			<Tooltip>
				<TooltipTrigger asChild>
					<DialogTrigger asChild>
						<Button size="icon" variant="outline">
							<CirclePlus />
						</Button>
					</DialogTrigger>
				</TooltipTrigger>
				<TooltipContent>
					<p>Crear grupo</p>
				</TooltipContent>
			</Tooltip>

			<DialogContent className='block'>
				<DialogHeader>
					<DialogTitle>Crear grupo</DialogTitle>
					<DialogDescription className='pb-4'>Añade amigos para comenzar!</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-8'>
						<FormField control={form.control} name="name" render={({ field }) => {
							return (
								<FormItem>
									<FormLabel>Nombre del grupo</FormLabel>
									<FormControl><Input placeholder='Nombre...' {...field} /></FormControl>
									<FormMessage />
								</FormItem>
							)
						}} />
						<FormField control={form.control} name="members" render={() => {
							return (
								<FormItem>
									<FormLabel>Amigos</FormLabel>
									<FormControl>
										<DropdownMenu>
											<DropdownMenuTrigger asChild disabled={unselectedFriends.length === 0}>
												<Button className='w-full' variant="outline">Seleccionar</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent className='w-full'>
												{
													unselectedFriends.map(friend => {
														return (
															<DropdownMenuCheckboxItem
																key={friend._id}
																className='flex items-center gap-2 w-full p-2'
																onCheckedChange={checked => {
																	if (checked) {
																		form.setValue("members", [...members, friend._id])
																	}
																}}>
																<Avatar className='w-8 h-8'>
																	<AvatarImage src={friend.imageUrl}></AvatarImage>
																	<AvatarFallback>{friend.username.substring(0, 10)}</AvatarFallback>
																</Avatar>
																<h4 className='truncate'>{friend.username}</h4>
															</DropdownMenuCheckboxItem>
														)
													})
												}
											</DropdownMenuContent>
										</DropdownMenu>
									</FormControl>
									<FormMessage />
								</FormItem>
							)
						}} />{
							members && members.length
								? <Card className='flex items-center gap-3 overflow-x-auto w-full h-24 p-2 no-scrollbar'>
									{friends?.filter(friend => members.includes(friend._id)).map(friend => {
										return (
											<div key={friend._id} className='flex flex-col items-center gap-1'>
												<div className='relative'>
													<Avatar className='w-8 h-8'>
														<AvatarImage src={friend.imageUrl}></AvatarImage>
														<AvatarFallback>{friend.username.substring(0, 10)}</AvatarFallback>
													</Avatar>
													<X
														className='text-muted-foreground w-4 h-4 absolute bottom-8 left-7 bg-muted rounded-full cursor-pointer'
														onClick={() => {
															form.setValue("members", members.filter(id => id !== friend._id))
														}} />
												</div>
												<p className='truncate text-sm'>{friend.username.split(" ")[0]}</p>
											</div>
										)
									})}
								</Card>
								: null
						}
						<DialogFooter>
							<Button disabled={pending} type="submit">Crear</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}

export default CreateGroupDialog