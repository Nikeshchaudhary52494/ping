import { getUser } from "@/actions/user/getUser";
import { db } from "@/lib/db";
import { UserAvatar } from "../user/UserAvatar";

export default async function BlockedUsers() {
    const { user } = await getUser();

    if (!user) return <p className="text-center text-red-500">User not found.</p>;

    const blockedUsers = await db.user.findUnique({
        where: { id: user.id },
        select: {
            blockedContacts: {
                select: {
                    blocked: {
                        select: {
                            displayName: true,
                            id: true,
                            username: true,
                            imageUrl: true
                        }
                    }
                }
            }
        }
    });

    return (
        <div className="flex flex-col items-start p-10 space-y-6">
            <h2 className="text-3xl font-bold">Manage Blocked Users</h2>

            {blockedUsers?.blockedContacts.length === 0 ? (
                <p className="text-muted-foreground">No blocked users.</p>
            ) : (
                <div className="space-y-4">
                    {blockedUsers?.blockedContacts.map(({ blocked }) => (
                        <div key={blocked.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-4">
                                <UserAvatar imageUrl={blocked.imageUrl} />
                                <div>
                                    <p className="font-medium">{blocked.displayName}</p>
                                    <p className="text-sm text-muted-foreground">@{blocked.username}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
