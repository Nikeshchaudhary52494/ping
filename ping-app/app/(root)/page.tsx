import { MessageSquare } from "lucide-react";

export default async function Home() {
  return (
    <div className="flex flex-col text-center items-center justify-center h-full">
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 animate-bounce">
        <MessageSquare size={50} className="text-primary" />
      </div>
      <h2 className="text-3xl font-extrabold">Welcome to ping</h2>
      <p className="text-base-content/60">
        Select a conversation from the sidebar to start chatting
      </p>
    </div>
  )
}