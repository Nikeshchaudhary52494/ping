"use client";

import { useState, useEffect, useTransition } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "@/app/hooks/use-toast";
import { getUserSettings } from "@/actions/user/getUserSettings";
import { updateUserSettings } from "@/actions/user/updateUserSettings";
import { useUser } from "../providers/userProvider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { updatePassword } from "@/actions/auth/updatePassword";
import Privacy from "../skeletons/privacy";

export default function ManagePrivacy() {
    const [showProfileImage, setShowProfileImage] = useState(true);
    const [restrictMessagesFromUnknown, setRestrictMessagesFromUnknown] = useState(false);
    const [hideProfile, setHideProfile] = useState(false);
    const [hideOnlineStatus, setHideOnlineStatus] = useState(false);

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const { user } = useUser();

    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        const fetchSettings = async () => {
            setIsLoading(true);
            try {
                if (!user) return;
                const settings = await getUserSettings(user?.id!); // Fetch settings from the server
                if (settings) {
                    setShowProfileImage(settings.showProfileImage);
                    setRestrictMessagesFromUnknown(settings.restrictMessagesFromUnknown);
                    setHideProfile(settings.hideProfile);
                    setHideOnlineStatus(settings.hideOnlineStatus);
                }
            } catch (error) {
                console.error("Failed to fetch settings:", error);
                toast({
                    title: "Error",
                    description: "Failed to fetch privacy settings.",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchSettings();
    }, [user]);

    function handleUpdatePassword() {
        startTransition(async () => {
            try {
                await updatePassword(currentPassword, newPassword);
                setIsEditingPassword(false);
            } catch (error) {
                console.error("Error updating password:", error);
            }
        });
    }

    const handleSaveSettings = async () => {
        setIsSaving(true);
        try {
            const updatedSettings = {
                showProfileImage,
                restrictMessagesFromUnknown,
                hideProfile,
                hideOnlineStatus,
            };

            await updateUserSettings(updatedSettings, user?.id!);
        } catch (error) {
            console.error("Failed to save settings:", error);
            toast({
                title: "Error",
                description: "Failed to update privacy settings.",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex flex-col items-start p-10 mx-auto space-y-6">
            <h2 className="text-3xl font-bold">Manage Privacy Settings</h2>
            <Dialog open={isEditingPassword} onOpenChange={setIsEditingPassword}>
                <DialogTrigger asChild>
                    <Button >Change Password</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Password</DialogTitle>
                    </DialogHeader>
                    <Input
                        type="password"
                        placeholder="Current Password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <Input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <Button onClick={handleUpdatePassword} disabled={isPending}>
                        {isPending ? "Updating..." : "Save Changes"}
                    </Button>
                </DialogContent>
            </Dialog>

            {isLoading ? (
                <div className="w-full text-center"><Privacy /></div>
            ) : (
                <div className="w-full space-y-4">
                    {[
                        { label: "Show Profile Image", state: showProfileImage, setState: setShowProfileImage },
                        { label: "Restrict Messages from Unknown Users", state: restrictMessagesFromUnknown, setState: setRestrictMessagesFromUnknown },
                        { label: "Hide Profile", state: hideProfile, setState: setHideProfile },
                        { label: "Hide Online Status", state: hideOnlineStatus, setState: setHideOnlineStatus },
                    ].map(({ label, state, setState }, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between w-full px-6 py-4 border-b"
                        >
                            <span>{label}</span>
                            <Switch checked={state} onCheckedChange={() => setState(!state)} />
                        </div>
                    ))}
                </div>
            )}

            <div className="flex justify-end w-full">
                <Button onClick={handleSaveSettings} disabled={isSaving || isLoading} className="px-6 py-2">
                    {isSaving ? "Saving..." : "Save Settings"}
                </Button>
            </div>
        </div>
    );
}