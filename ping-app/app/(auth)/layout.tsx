import type { Metadata } from "next";
import Image from "next/image";


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
        <div className="flex bg-[#020817] h-full">
            <div className="relative w-1/3">
                <Image
                    fill
                    src={"/Messages-cuate.svg"}
                    alt="image"
                    className="object-contain"
                />
            </div>
            <div className="flex items-center justify-center w-2/3">
                {children}
            </div>
        </div>

    );
}