import {
    Camera,
    Copy,
    Edit,
    Forward,
    Lock,
    MessageCircle,
    Phone,
    Settings,
    UserRoundCog,
    UsersRound
} from "lucide-react";

export const navigationTabs = [
    {
        icon: MessageCircle,
        label: "Chats",
        route: "/privateChat"
    },
    {
        icon: UsersRound,
        label: "Groups",
        route: "/groupChat"
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

export const settingsTabs = [
    {
        icon: UserRoundCog,
        label: "Profile",
        route: "/profile"
    },
    {
        icon: Lock,
        label: "Security",
        route: "/security"
    },
]

export const actionButtons = [
    { label: "Copy", Icon: Copy },
    { label: "Edit", Icon: Edit },
    { label: "Forward", Icon: Forward },
];