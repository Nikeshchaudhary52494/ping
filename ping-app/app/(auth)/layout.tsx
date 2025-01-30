import { getUser } from "@/actions/user/getUser";
import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";


export const metadata: Metadata = {
    title: "Auth page",
    description: "Ping authentication",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const { user } = await getUser();
    if (user) redirect("/")

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