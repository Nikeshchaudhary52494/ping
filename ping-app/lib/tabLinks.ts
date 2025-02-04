import {
    Copy,
    Edit,
    Forward,
    Lock,
    MessageCircle,
    Phone,
    Settings,
    Star,
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