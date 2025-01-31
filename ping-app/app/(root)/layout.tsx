import { getUser } from '@/actions/user/getUser';
import Bottombar from '@/components/navigation/Bottombar';
import Sidebar from '@/components/navigation/Sidebar';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

export default async function MainLayout({
    children,
}: {
    children: ReactNode;
}) {

    const { user } = await getUser();
    if (!user) redirect("/sign-in")
    if (!user?.onboarded) redirect("/onboarding");

    return (
        <div className="flex flex-col h-full sm:flex-row min-w-[300px] min-h-[300px] overflow-clip">
            <aside className="self-start hidden h-full sm:block">
                <Sidebar />
            </aside>
            <main className="flex-1">
                {children}
            </main>
            <div className="w-full sm:hidden">
                <Bottombar />
            </div>
        </div>
    );
};