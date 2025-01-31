import { MutableRefObject } from "react";
import { Socket } from "socket.io-client";

interface InitializePeerConnectionProps {
    stream: MediaStream | null;
    remoteUserId: string;
    socket: Socket | null;
    setRemoteStream: (stream: MediaStream | null) => void,
}

// Initialize a new RTCPeerConnection
export const initializePeerConnection = ({
    stream,
    remoteUserId,
    socket,
    setRemoteStream,
}: InitializePeerConnectionProps): RTCPeerConnection => {
    const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    // Add local tracks to the peer connection if available
    if (stream) {
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));
    }

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
        if (event.candidate) {
            socket?.emit("webrtc:candidate", {
                candidate: event.candidate,
                to: remoteUserId,
            });
        }
    };

    // Handle remote tracks
    pc.ontrack = (event) => {
        if (event.streams[0]) {
            setRemoteStream(event.streams[0]);
        }
    };

    return pc;
};

// Step 1: Caller initiates the call
export const handleCallAccepted = async ({
    localStream,
    socket,
    remoteUserId,
    setRemoteStream,
    pc,
}: {
    localStream: MediaStream | null;
    socket: Socket | null;
    remoteUserId: string;
    setRemoteStream: (stream: MediaStream | null) => void,
    pc: MutableRefObject<RTCPeerConnection | null>;
}): Promise<void> => {
    try {
        if (!pc.current) {
            pc.current = initializePeerConnection({
                stream: localStream,
                remoteUserId,
                socket,
                setRemoteStream
            });
        }

        // Create and send an offer
        const offer = await pc.current.createOffer();
        await pc.current.setLocalDescription(offer);

        socket?.emit("webrtc:offer", { sdp: offer, to: remoteUserId });
    } catch (error) {
        console.error("Error in handleCallAccepted:", error);
    }
};

// Step 2: Receiver handles the offer
export const handleOffer = async ({
    data,
    pc,
    socket,
    localStream,
    setRemoteStream,
}: {
    data: { sdp: RTCSessionDescriptionInit; from: string };
    pc: MutableRefObject<RTCPeerConnection | null>;
    socket: Socket | null;
    localStream: MediaStream | null;
    setRemoteStream: (stream: MediaStream | null) => void,
}): Promise<void> => {
    try {
        if (!pc.current) {
            pc.current = initializePeerConnection({
                stream: localStream,
                remoteUserId: data.from,
                socket,
                setRemoteStream,
            });
        }

        // Set remote description first
        await pc.current.setRemoteDescription(new RTCSessionDescription(data.sdp));

        // Create and send answer
        const answer = await pc.current.createAnswer();
        await pc.current.setLocalDescription(answer);

        socket?.emit("webrtc:answer", { sdp: answer, to: data.from });
    } catch (error) {
        console.error("Error in handleOffer:", error);
    }
};

// Step 3: Caller handles the answer
export const handleAnswer = async ({
    data,
    pc,
    setRemoteStream
}: {
    data: { sdp: RTCSessionDescriptionInit };
    pc: MutableRefObject<RTCPeerConnection>;
    setRemoteStream: (stream: MediaStream | null) => void,
}): Promise<void> => {
    try {
        if (!pc.current) {
            console.error("Peer connection is null!");
            return;
        }

        if (!data.sdp) {
            console.error("Invalid SDP answer!");
            return;
        }

        // Set remote description
        await pc.current.setRemoteDescription(new RTCSessionDescription(data.sdp));
        pc.current.ontrack = (event) => {
            if (event.streams[0]) {
                setRemoteStream(event.streams[0]);
            }
        };
    } catch (error) {
        console.error("Error in handleAnswer:", error);
    }
};

// Step 4: Handle ICE candidates
export const handleCandidate = async ({
    data,
    pc,
}: {
    data: { candidate: RTCIceCandidateInit };
    pc: MutableRefObject<RTCPeerConnection>;
}): Promise<void> => {
    try {
        if (!pc.current) {
            console.warn("Peer connection is null!");
            return;
        }

        // Add the ICE candidate
        await pc.current.addIceCandidate(new RTCIceCandidate(data.candidate));
    } catch (error) {
        console.error("Error in handleCandidate:", error);
    }
};