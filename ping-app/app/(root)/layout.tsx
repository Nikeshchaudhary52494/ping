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
        <div className="h-full">
            <div className="hidden md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0">
                <NavigationSidebar />
            </div>
            <main className="md:pl-[72px] h-full">
                {children}
            </main>
        </div>
    );
};