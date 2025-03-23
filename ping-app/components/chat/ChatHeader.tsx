"use client";

import { useState } from "react";
import { UserAvatar } from "@/components/user/UserAvatar";
import { HeaderProfile } from "./HeaderProfile";
import { ActionButtons } from "./ActionButtons";
import { MyUser, UserTab } from "@/types/prisma";
import { Link2, UserPlus } from "lucide-react";
import ActionTooltip from "../action-tooltip";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/app/hooks/use-toast";
import { addMembersToGroup, searchUsers } from "@/actions/chat/groupChat/addMembers";

interface ChatHeaderProps {
    name?: string;
    imageUrl?: string;
    receiver?: MyUser;
    currentUser?: MyUser;
    isGroupChat?: boolean;
    groupId?: string;
    isAdmin?: boolean;
    setShowDetails: (value: boolean) => void;
    showDetails: boolean;
}

export default function ChatHeader({
    name,
    imageUrl,
    receiver,
    currentUser,
    isGroupChat = false,
    groupId,
    isAdmin = true,
    showDetails,
    setShowDetails
}: ChatHeaderProps) {
    const inviteLink = `https://ping-messenger.vercel.app/invite/${groupId}`;
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState<UserTab[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<UserTab[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleCopyInviteLink = () => {
        navigator.clipboard.writeText(inviteLink);
        toast({ description: "Invitation link copied!" });
    };

    const handleSearch = async () => {
        if (!search.trim()) return;
        const results = await searchUsers(search);
        setSearchResults(results);
    };

    const handleSelectUser = (user: UserTab) => {
        if (!selectedUsers.some((u) => u.id === user.id)) {
            setSelectedUsers([...selectedUsers, user]);
        }
    };

    const handleRemoveUser = (userId: string) => {
        setSelectedUsers(selectedUsers.filter((user) => user.id !== userId));
    };

    const handleAddMembers = async () => {
        if (selectedUsers.length === 0) return;
        setIsLoading(true);
        await addMembersToGroup(groupId!, selectedUsers.map((user) => user.id));
        toast({ description: "Members added successfully!" });
        setSelectedUsers([]);
        setIsLoading(false);
    };

    return (
        <div className="flex items-center justify-between w-full h-full px-4 bg-secondary">
            {isGroupChat ? (
                <div onClick={() => setShowDetails(!showDetails)} className="flex items-center gap-2 cursor-pointer">
                    <UserAvatar imageUrl={imageUrl || ""} isGroupAvatar={true} />
                    <span className="font-bold">{name}</span>
                </div>
            ) : (
                <>
                    <HeaderProfile user={receiver || currentUser!} isCurrentUser={!receiver} setShowDetails={setShowDetails} showDetails={showDetails} />
                    < ActionButtons currentUserId={currentUser?.id!} recipientId={receiver?.id!} />
                </>
            )}
            {isAdmin && isGroupChat && (
                <div className="flex justify-between gap-5 mr-5">

                    <Dialog>
                        <DialogTrigger>
                            <ActionTooltip label="Add member">
                                <Button variant="ghost" size="icon">
                                    <UserPlus className="w-5 h-5" />
                                </Button>
                            </ActionTooltip>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Members</DialogTitle>
                            </DialogHeader>
                            <Input
                                placeholder="Search users..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            />
                            <div className="mt-2 overflow-y-auto max-h-40">
                                {searchResults.map((user) => (
                                    <div key={user.id} className="flex items-center justify-between p-2 border-b">
                                        <div className="flex items-center gap-2">
                                            <UserAvatar imageUrl={user.imageUrl} />
                                            <span>{user.displayName} (@{user.username})</span>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleSelectUser(user)}
                                        >
                                            Add
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            {selectedUsers.length > 0 && (
                                <div className="mt-4">
                                    <h3 className="font-semibold">Selected Members:</h3>
                                    {selectedUsers.map((user) => (
                                        <div key={user.id} className="flex items-center justify-between p-2 border-b">
                                            <div className="flex items-center gap-2">
                                                <UserAvatar imageUrl={user.imageUrl} />
                                                <span>{user.displayName} (@{user.username})</span>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => handleRemoveUser(user.id)}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <Button className="w-full mt-2" onClick={handleAddMembers} disabled={isLoading}>
                                {isLoading ? "Adding..." : "Add Members"}
                            </Button>
                        </DialogContent>
                    </Dialog>

                    {/* Copy Invite Link */}
                    <ActionTooltip label="Invitation link">
                        <Button variant="ghost" size="icon" onClick={handleCopyInviteLink}>
                            <Link2 className="w-5 h-5" />
                        </Button>
                    </ActionTooltip>
                </div>
            )}
        </div>


    );
}
