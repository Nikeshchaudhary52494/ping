import {
    Camera,
    MessageCircle,
    Phone,
    Settings,
    UsersRound
} from "lucide-react";

export const navigationLinks = [
    {
        icon: MessageCircle,
        label: "Chats",
        route: "/chats"
    },
    {
        icon: UsersRound,
        label: "Groups",
        route: "/groups"
    },
    {
        icon: Phone,
        label: "Calls",
        route: "/calls"
    },
    {
        icon: Camera,
        label: "Video calls",
        route: "/video-calls"
    },
    {
        icon: Settings,
        label: "Settings",
        route: "/settings"
    },
]