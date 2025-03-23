import { useSocketContext } from "../providers/socketProvider";
import { UserAvatar } from "../user/UserAvatar";
import { CallType, User } from "@prisma/client";
import CallAlert from "./CallAlert";
import CallActionButton from "./CallActionButtons";

type IncomingCallProps = {
    user: User
    type: CallType
};

export default function IncomingCall({
    user,
    type
}: IncomingCallProps) {

    const {
        currentCall,
        setCurrentCall,
        callState,
        setCallState
    } = useSocketContext();

    if (!currentCall) return null;

    const onReject = () => {
        setCurrentCall(null);
        setCallState("rejected");
    };

    return (
        <div className="flex absolute bottom-0 right-0 w-[300px] bg-secondary p-6 m-4 flex-col items-center gap-4 rounded-xl shadow-lg">
            <CallAlert callState={callState} />
            <p className="text-lg font-semibold text-gray-300">Incoming Call</p>

            <div className="flex flex-col items-center gap-2">
                <UserAvatar
                    imageUrl={user?.imageUrl}
                    size={100}
                />
                <div className="text-center">
                    <h3 className="text-lg font-bold text-white">{user?.displayName}</h3>
                    <p className="text-sm text-gray-400">{user?.username}</p>
                </div>
            </div>
            <CallActionButton
                remoteUserId={currentCall.from}
                incomingUserId={user?.id}
                onReject={onReject}
                type={type}
            />
        </div>
    );
}
