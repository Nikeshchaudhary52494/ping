// "use client";

// import { useCallback } from 'react';
// import { useSocket } from './useSocket';
// // import { useSocket } from '@/providers/SocketProvider';
// // import { CallData } from '@/types/socket';

// export const useCall = () => {
//     const { socket, currentCall } = useSocket();

//     const initiateCall = useCallback((recipientId: string, type: 'video' | 'voice') => {
//         if (socket) {
//             socket.emit('call:initiate', {
//                 to: recipientId,
//                 type,
//             });
//         }
//     }, [socket]);

//     const endCall = useCallback(() => {
//         if (socket && currentCall) {
//             socket.emit('call:end', currentCall);
//         }
//     }, [socket, currentCall]);

//     return {
//         initiateCall,
//         endCall,
//         currentCall,
//     };
// };