import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

interface CallData {
    from: string;
    to: string;
    type: 'video' | 'voice';
    roomId?: string;
}

type UserSocketMap = Record<string, string>;

export class CallService {
    private activeRooms: Map<string, CallData>;
    private io: Server;
    private userSocketMap: UserSocketMap;

    constructor(io: Server, userSocketMap: UserSocketMap) {
        this.io = io;
        this.activeRooms = new Map();
        this.userSocketMap = userSocketMap;
    }

    /**
     * Initiates a call and notifies the receiver.
     */
    public initiateCall(socket: Socket, data: CallData) {
        const receiverSocketId = this.getUserSocketId(data.to);

        if (!receiverSocketId) {
            this.sendToClient(socket, 'call:userOffline', {
                ...data,
                reason: 'User is offline',
            });
            return;
        }

        const roomId = uuidv4();
        const callData = { ...data, roomId };

        this.activeRooms.set(roomId, callData);
        this.sendToSocket(receiverSocketId, 'call:incoming', callData);

        this.log('Call initiated', { roomId, callData });
    }

    /**
     * Handles when a receiver accepts the call.
     */
    public acceptCall(socket: Socket, data: CallData) {
        const callerSocketId = this.getUserSocketId(data.from);

        if (!callerSocketId) {
            this.sendToClient(socket, 'call:ended', {
                ...data,
                reason: 'Caller disconnected',
            });
            return;
        }

        const roomId = data.roomId;
        if (roomId && this.activeRooms.has(roomId)) {
            socket.join(roomId);
            this.sendToSocket(callerSocketId, 'call:accepted', data);

            this.log('Call accepted', { roomId, data });
        } else {
            this.sendToClient(socket, 'call:error', {
                ...data,
                reason: 'Invalid room ID',
            });
        }
    }

    /**
     * Handles call rejection by the receiver.
     */
    public rejectCall(socket: Socket, data: CallData) {
        const callerSocketId = this.getUserSocketId(data.from);

        if (callerSocketId) {
            this.sendToSocket(callerSocketId, 'call:rejected', data);
        }

        if (data.roomId) {
            this.activeRooms.delete(data.roomId);
        }

        this.log('Call rejected', { roomId: data.roomId, data });
    }

    /**
     * Handles when a call ends.
     */
    public endCall(socket: Socket, data: CallData) {
        const { roomId, from, to } = data;
        const callerSocketId = this.getUserSocketId(from);
        const receiverSocketId = this.getUserSocketId(to);
        if (roomId) {
            this.sendToSocket(callerSocketId!, 'call:ended', data);
            this.sendToSocket(receiverSocketId!, 'call:ended', data);

            this.activeRooms.delete(roomId);

            this.log('Call ended', { roomId, data });
        }
    }


    /**
     * Handles call cancellation by the caller.
     */
    public dropCall(socket: Socket, data: CallData) {
        const receiverSocketId = this.getUserSocketId(data.to);

        if (receiverSocketId) {
            this.sendToSocket(receiverSocketId, 'call:dropped', data);
        }

        if (data.roomId) {
            this.activeRooms.delete(data.roomId);
        }

        this.log('Call dropped', { roomId: data.roomId, data });
    }

    /**
     * Retrieves the socket ID of a user by their ID.
     */
    private getUserSocketId(userId: string): string | undefined {
        return this.userSocketMap[userId];
    }

    /**
     * Sends a message to a specific client.
     */
    private sendToClient(socket: Socket, event: string, payload: any) {
        socket.emit(event, payload);
    }

    /**
     * Sends a message to a specific socket ID.
     */
    private sendToSocket(socketId: string, event: string, payload: any) {
        this.io.to(socketId).emit(event, payload);
    }

    /**
     * Logs activity for debugging and monitoring.
     */
    private log(message: string, details: object) {
        console.log(`[CallService] ${message}`, details);
    }
}
