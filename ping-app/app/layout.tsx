import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { SocketProvider } from "@/components/providers/socketProvider";
import UserProvider from "@/components/providers/userProvider";
import { MessageProvider } from "@/components/providers/messageProvider";
import CurrentCallHandler from "@/components/providers/CurrentCallHandler";

const font = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ping",
  description: "Connecting friends",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(font.className, "bg-white dark:bg-[#0D0D0E]")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          storageKey="discord-theme"
        >
          <UserProvider>
            <SocketProvider>
              <MessageProvider>
                {children}
                <CurrentCallHandler />
              </MessageProvider>
            </SocketProvider>
          </UserProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}