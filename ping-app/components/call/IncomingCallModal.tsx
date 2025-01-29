import { useSocketContext } from "../providers/socketProvider";
import { UserAvatar } from "../user/UserAvatar";
import ActionButton from "./ActionButtons";
import { User } from "@prisma/client";

type IncomingTabProps = {
    user: User
    type: "voice" | "video"
};

export default function IncomingCallModal({
    user,
    type
}: IncomingTabProps) {

    const { currentCall, setCurrentCall } = useSocketContext();
    console.log(currentCall);
    if (!currentCall) return null;

    const onReject = () => { setCurrentCall(null) };

    return (
        <div className="flex absolute bottom-0 right-0 w-[300px] bg-secondary p-6 m-4 flex-col items-center gap-4 rounded-xl shadow-lg">
            <p className="text-lg font-semibold text-gray-300">Incoming Call</p>

            <div className="flex flex-col items-center gap-2">
                <UserAvatar
                    displayName={user?.displayName}
                    imageUrl={user?.imageUrl}
                    size={100}
                />
                <div className="text-center">
                    <h3 className="text-lg font-bold text-white">{user?.displayName}</h3>
                    <p className="text-sm text-gray-400">{user?.username}</p>
                </div>
            </div>
            <ActionButton
                remoteUserId={currentCall.from}
                incomingUserId={user?.id}
                onReject={onReject}
                type={type}
            />
        </div>
    );
}
