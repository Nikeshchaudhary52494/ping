import { MutableRefObject } from "react";
import { Socket } from "socket.io-client";

interface InitializePeerConnectionProps {
    stream: MediaStream | null;
    remoteUserId: string;
    socket: Socket | null;
    setRemoteStream: (stream: MediaStream) => void;
}

// Initialize a new RTCPeerConnection
export const initializePeerConnection = ({
    stream,
    remoteUserId,
    socket,
    setRemoteStream
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
            console.log("Sending ICE candidate:", event.candidate);
            socket?.emit("webrtc:candidate", {
                candidate: event.candidate,
                to: remoteUserId,
            });
        }
    };

    // Handle remote tracks
    pc.ontrack = (event) => {
        console.log("Remote track received:", event.streams[0]);
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
    localStream: MutableRefObject<MediaStream | null>;
    socket: Socket | null;
    remoteUserId: string;
    setRemoteStream: (stream: MediaStream) => void;
    pc: MutableRefObject<RTCPeerConnection | null>;
}): Promise<void> => {
    try {
        console.log("Initiating call to:", remoteUserId);

        if (!pc.current) {
            pc.current = initializePeerConnection({
                stream: localStream.current,
                remoteUserId,
                socket,
                setRemoteStream
            });
        }

        // Create and send an offer
        const offer = await pc.current.createOffer();
        await pc.current.setLocalDescription(offer);

        socket?.emit("webrtc:offer", { sdp: offer, to: remoteUserId });
        console.log("Offer sent to receiver");
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
    localStream: MutableRefObject<MediaStream | null>;
    setRemoteStream: (stream: MediaStream) => void;
}): Promise<void> => {
    try {
        console.log("Received offer from caller:", data);
        console.log("this is local stram from offer", localStream)
        if (!pc.current) {
            pc.current = initializePeerConnection({
                stream: localStream.current,
                remoteUserId: data.from,
                socket,
                setRemoteStream
            });
        }

        // Set remote description first
        await pc.current.setRemoteDescription(new RTCSessionDescription(data.sdp));

        // Create and send answer
        const answer = await pc.current.createAnswer();
        await pc.current.setLocalDescription(answer);

        socket?.emit("webrtc:answer", { sdp: answer, to: data.from });
        console.log("Answer sent to caller");
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
    setRemoteStream: (stream: MediaStream) => void
}): Promise<void> => {
    try {
        console.log("Received answer from receiver:", data);

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
        console.log("Remote description set successfully.");
        pc.current.ontrack = (event) => {
            console.log("Remote track received:", event.streams[0]);
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
        console.log("Received ICE candidate:", data.candidate);

        if (!pc.current) {
            console.warn("Peer connection is null!");
            return;
        }

        // Add the ICE candidate
        await pc.current.addIceCandidate(new RTCIceCandidate(data.candidate));
        console.log("ICE candidate added successfully.");
    } catch (error) {
        console.error("Error in handleCandidate:", error);
    }
};