"use client"

import { MdCall, MdCallEnd } from "react-icons/md";
import { FaVideo } from "react-icons/fa";
import { useSocketContext } from "../providers/socketProvider";
import { useRouter } from "next/navigation";
import { handleCallAccepted } from "@/lib/webrtc";


interface CallActionButtonProps {
    type: "voice" | "video";
    incomingUserId: string;
    onReject: () => void;
    remoteUserId: string;
};

export default function CallActionButton({
    type,
    onReject,
    incomingUserId,
    remoteUserId
}: CallActionButtonProps) {

    const {
        socket,
        currentCall,
        localStreamRef,
        setCallState,
        remoteStreamRef,
        peerConnectionRef,
    } = useSocketContext();

    const router = useRouter();
    const onAccept = () => {
        socket?.emit("call:accept", {
            ...currentCall
        })

        handleCallAccepted({
            localStream: localStreamRef,
            socket,
            remoteUserId,
            remoteStreamRef,
            pc: peerConnectionRef
        }
        );
        setCallState("accepted")
        router.push("/calls")
    }

    return (
        <div className="flex justify-center w-full gap-6 mt-4">
            {type == "voice" ? (
                <button
                    onClick={onAccept}
                    className="flex items-center justify-center text-white transition-transform rounded-full shadow-lg w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 hover:scale-110"
                    aria-label="Accept Call"
                >
                    <MdCall size={28} />
                </button>
            ) : (
                <button
                    onClick={onAccept}
                    className="flex items-center justify-center text-white transition-transform rounded-full shadow-lg w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 hover:scale-110"
                    aria-label="Accept Call"
                >
                    <FaVideo size={28} />
                </button>
            )}
            <button
                onClick={() => {
                    onReject();
                    socket?.emit('call:reject', {
                        from: incomingUserId
                    })
                }}
                className="flex items-center justify-center text-white transition-transform rounded-full shadow-lg w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 hover:scale-110"
                aria-label="Reject Call"
            >
                <MdCallEnd size={28} />
            </button>
        </div>
    )
}