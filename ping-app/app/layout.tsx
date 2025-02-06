import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { SocketProvider } from "@/components/providers/socketProvider";
import UserProvider from "@/components/providers/userProvider";
import { MessageProvider } from "@/components/providers/messageProvider";
import CurrentCallHandler from "@/components/providers/CurrentCallHandler";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import ThemeDataProvider from "@/components/providers/theme-data-provider";

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
      <body className={cn(font.className, "bg-background")}>
        <NextThemesProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <UserProvider>
            <SocketProvider>
              <MessageProvider>
                <ThemeDataProvider>{children}</ThemeDataProvider>
                <CurrentCallHandler />
              </MessageProvider>
            </SocketProvider>
          </UserProvider>
        </NextThemesProvider>
        <Toaster />
      </body>
    </html>
  );
}
