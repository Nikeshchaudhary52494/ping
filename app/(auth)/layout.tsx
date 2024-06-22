import type { Metadata } from "next";


export const metadata: Metadata = {
    title: "Auth page",
    description: "Ping authentication",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="h-full flex justify-center items-center">
            {children}
        </div>
    );
}