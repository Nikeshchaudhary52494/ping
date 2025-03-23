import {
    Ban,
    Lock,
    MessageCircle,
    Palette,
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
        icon: Palette,
        label: "Theme",
        route: "/theme"
    },
    {
        icon: Lock,
        label: "Privacy and Security",
        route: "/security"
    },
    {
        icon: Ban,
        label: "Blocked User",
        route: "/blocked-user"
    },
]