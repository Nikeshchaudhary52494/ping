# **PING - A Real-time E2EE Chat Application**  

![Preview Image](./preview.png)  

**PING** is a secure and feature-rich chat application offering **end-to-end encrypted (E2EE) private messaging, video calls, voice calls, and group chats**. Built with **Next.js** for both the frontend and backend, it ensures a seamless and modern user experience. Real-time communication is powered by an **Express-based socket server**, delivering fast and reliable messaging.  

![GitHub contributors](https://img.shields.io/github/contributors/Nikeshchaudhary52494/PING?style=for-the-badge&color=48bf21)  
![GitHub Repo stars](https://img.shields.io/github/stars/Nikeshchaudhary52494/PING?style=for-the-badge)  
![GitHub issues](https://img.shields.io/github/issues/Nikeshchaudhary52494/PING?style=for-the-badge&color=d7af2d)  
![GitHub pull requests](https://img.shields.io/github/issues-pr/Nikeshchaudhary52494/PING?style=for-the-badge&color=f47373)  
![GitHub License](https://img.shields.io/github/license/Nikeshchaudhary52494/PING?style=for-the-badge&color=e67234)  

---

## 🔮 **Features**  

- 💬 Real-time messaging with other users  
- 🔒 End-to-end encrypted (E2EE) private messaging  
- 🔍 Advanced search functionality for finding users easily  
- 🎨 Customizable themes  
- 📱 Fully responsive design, accessible on any device  
- 😍 Group chat support  
- 🤖 Privacy settings for user control  
- 👤 User profile management  
- 🔐 Secure authentication and authorization system  

---

## 🚀 **Live Preview**  

🔗 **[Try PING Live](https://ping-messenger.vercel.app/)**  

---

## 💻 **Tech Stack**  

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)  
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)  
![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)  
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)  
![Node.js](https://img.shields.io/badge/Node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)  
![Express.js](https://img.shields.io/badge/Express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)  
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)  
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=Socket.io&logoColor=white)  
![WebRTC](https://img.shields.io/badge/WebRTC-0101?style=for-the-badge&logo=WebRTC&logoColor=white)  
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)  

---

## ⚙️ **Installation**  

### **1️⃣ Clone the repository:**  

### **2️⃣ Set up environment variables**  

#### **Frontend `.env` (ping-app)**

- `NEXT_PUBLIC_BACKEND_URL=your_backend_url`
- `NEXT_PUBLIC_UPLOADTHING_SECRET=your_secret_key`
- `NEXT_PUBLIC_UPLOADTHING_APP_ID=your_app_id`
- `NEXT_PUBLIC_JWT_SECRET=your_jwt_secret`

#### **Backend `.env` (websocket-server)**

- `DATABASE_URL=your_database_url`
- `PORT=your_backend_port`
- `JWT_SECRET=your_jwt_secret`

### **3️⃣ Install dependencies:**  

Navigate to both `frontend` and `backend` folders and run:

### **4️⃣ Start the development server:**  

### **5️⃣ Access the application:**  

---

## 📡 **WebRTC Flow**  

![WebRTC flow](./webrtc.png)  

### **1️⃣ Caller (User 1) initiates a call**  
- Gets media stream (`getUserMedia`)  
- Notifies User 2 via WebSocket (`webrtc:incoming-call`)  
- Does NOT create an offer yet (Waits for User 2 to accept)  

### **2️⃣ Receiver (User 2) accepts the call**  
- Initializes `RTCPeerConnection`  
- Creates an offer (`createOffer()`)  
- Sets local description (`setLocalDescription(offer)`)  
- Sends SDP offer to User 1 via WebSocket (`webrtc:offer`)  

### **3️⃣ Caller (User 1) receives the offer**  
- Initializes `RTCPeerConnection`  
- Sets remote description (`setRemoteDescription(offer)`)  
- Creates an answer (`createAnswer()`)  
- Sets local description (`setLocalDescription(answer)`)  
- Sends SDP answer to User 2 via WebSocket (`webrtc:answer`)  

### **4️⃣ Receiver (User 2) receives the answer**  
- Sets remote description (`setRemoteDescription(answer)`)  
- 🎯 Once set, both peers should see each other's video  

### **5️⃣ ICE Candidate Exchange (Handles NAT traversal)**  
- Both peers send their ICE candidates via WebSocket (`webrtc:candidate`)  
- Each peer receives and adds the ICE candidate (`addIceCandidate()`)  

---

## 🌟 **Support Us**  

If you find **PING** helpful, please consider **starring ⭐ the repository**. Your support helps us grow and improve this project!  

---