import { getUser } from '@/actions/user/getUser';
import NavigationSidebar from '@/components/navigation/navigation-sidebar';
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
        <div className="h-full flex">
            <aside className="self-start h-full">
                <NavigationSidebar />
            </aside>
            <main className="flex-1">
                {children}
            </main>
        </div>
    );
};