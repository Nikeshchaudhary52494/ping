import { CallScreen } from "@/components/call/CallScreen";
import { MessageSquare } from "lucide-react";

export default async function Home() {
  return (
    // <div className="flex flex-col items-center justify-center h-full">
    //   <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 animate-bounce">
    //     <MessageSquare size={50} className="text-primary" />
    //   </div>
    //   <h2 className="text-2xl font-bold">Welcome to ping</h2>
    //   <p className="text-base-content/60">
    //     Select a conversation from the sidebar to start chatting
    //   </p>
    // </div>
    <CallScreen callType="video" remoteParticipantName="nikesh" />
  )
}