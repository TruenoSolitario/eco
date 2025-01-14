"use client"

import React from 'react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form';
import { Form, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { DialogHeader } from '@/components/ui/dialog';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useMutationState } from '@/hooks/useMutationState';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';
import { ConvexError } from 'convex/values';

const addFriendFormSchema = z.object({
	email: z
		.string()
		.min(1, { message: "This field can't be empty" })
		.email("Please enter a valid email")
});

const AddFriendDialog = () => {

	const { mutate: createRequest, pending } = useMutationState(api.request.create)

	const form = useForm<z.infer<typeof addFriendFormSchema>>({
		resolver: zodResolver(addFriendFormSchema),
		defaultValues: {
			email: "",
		}
	})

	const handleSubmit = async (values: z.infer<typeof addFriendFormSchema>) => {
		await createRequest({ email: values.email })
			.then(() => {
				form.reset();
				toast.success("Friend request sent!");
			})
			.catch(error => {
				toast.error(error instanceof ConvexError ? error.data : "Unexpected error occurred");
			})
	}

	return (
		<Dialog>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button size="icon" variant="outline" asChild>
						<DialogTrigger>
							<UserPlus />
						</DialogTrigger>
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					<p>Añadir amigo</p>
				</TooltipContent>
			</Tooltip>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>
					Añadir amigo
					</DialogTitle>
					<DialogDescription>
						Envía una petición para conectar con tus amigos!
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)}
						className='space-y-8'>
						<FormField control={form.control} name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input placeholder='Email...' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter>
							<Button disabled={pending} type="submit">Enviar</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}

export default AddFriendDialog