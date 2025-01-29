# PING

## webRTC flow

- 1️⃣ Caller (User 1) initiates a call
Gets media stream (getUserMedia)
Notifies User 2 via WebSocket (webrtc:incoming-call)
Does NOT create an offer yet! (Wait for User 2 to accept)
- 2️⃣ Receiver (User 2) accepts the call
Initializes RTCPeerConnection
Creates an offer (createOffer())
Sets local description (setLocalDescription(offer))
Sends SDP offer to User 1 via WebSocket (webrtc:offer)
- 3️⃣ Caller (User 1) receives the offer
Initializes RTCPeerConnection
Sets remote description (setRemoteDescription(offer))
Creates an answer (createAnswer())
Sets local description (setLocalDescription(answer))
Sends SDP answer to User 2 via WebSocket (webrtc:answer)
- 4️⃣ Receiver (User 2) receives the answer
Sets remote description (setRemoteDescription(answer))
🎯 Once set, both peers should see each other's video
(assuming getUserMedia() and tracks are correctly handled)
- 5️⃣ ICE Candidate Exchange (Handles NAT traversal)
Both peers send their ICE candidates via WebSocket (webrtc:candidate)
Each peer receives and adds the ICE candidate (addIceCandidate())  give react full code for webtrc.ts