import { UserRound } from "lucide-react";
import { MdCallEnd } from "react-icons/md";
import Image from "next/image";
import { User } from "@prisma/client";
import { useSocketContext } from "../providers/socketProvider";

type OutgoingCallProps = {
    user?: User
};

export default function OutgoingCall({
    user,
}: OutgoingCallProps) {

    const { socket, setCallState } = useSocketContext();
    const onEnd = () => {
        socket?.emit('call:drop', {
            to: user?.id,
        });
        setCallState("dropped");
    };

    return (
        <div className="flex absolute bottom-0 right-0 w-[300px] bg-secondary p-6 m-4 flex-col items-center gap-4 rounded-xl shadow-lg">
            <p className="text-lg font-semibold text-gray-300">Calling</p>

            <div className="flex flex-col items-center gap-2">
                <div className="relative flex items-center justify-center w-24 h-24 overflow-hidden rounded-full shadow-md bg-neutral-600">
                    {user?.imageUrl ? (
                        <Image
                            src={user.imageUrl}
                            alt={`${user.displayName}'s profile`}
                            className="object-cover"
                            fill
                        />
                    ) : (
                        <UserRound className="text-gray-400" size={48} />
                    )}
                </div>
                <div className="text-center">
                    <h3 className="text-lg font-bold text-white">{user?.displayName}</h3>
                    <p className="text-sm text-gray-400">{user?.username}</p>
                </div>
            </div>

            <div className="flex justify-center w-full gap-6 mt-4">
                <button
                    onClick={onEnd}
                    className="flex items-center justify-center text-white transition-transform rounded-full shadow-lg w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 hover:scale-110"
                    aria-label="Reject Call"
                >
                    <MdCallEnd size={28} />
                </button>
            </div>
        </div>
    );
}
