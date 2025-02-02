import { api } from "@/convex/_generated/api"
import { useQuery } from "convex/react"
import { MessageSquare, Users } from "lucide-react"
import { usePathname } from "next/navigation"
import { useMemo } from "react"

export const useNavigation = () => {
    const pathname = usePathname()

    const requestsCount = useQuery(api.requests.count)

    const conversations = useQuery(api.conversations.get)

    const unseenMessagesCount = useMemo(() => {
        return conversations?.reduce((accumulator, current) => {
            return accumulator + current.unseenCount
        }, 0)
    }, [conversations])

    const paths = useMemo(() =>
        [
            {
                name: "Conversaciones",
                href: "/conversations",
                icon: <MessageSquare />,
                active: pathname.startsWith("/conversations"),
                count: unseenMessagesCount,

            },
            {
                name: "Amigos",
                href: "/friends",
                icon: <Users />,
                active: pathname === "/friends",
                count: requestsCount,
            },
        ],
        [pathname, requestsCount, unseenMessagesCount]
    )

    return paths
}