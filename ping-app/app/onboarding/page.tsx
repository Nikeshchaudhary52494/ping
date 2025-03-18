import { getUser } from "@/actions/user/getUser";
import AccountProfile from "@/components/account-profile";
import { redirect } from "next/navigation";

export default async function Onboarding() {
    const { user } = await getUser();
    if (!user) redirect("/sign-in");
    if (user.onboarded) redirect("/")

    const userData = {
        userId: user?.id,
        username: user ? user?.username! : "",
        displayName: user ? user?.displayName : "",
        bio: user ? user?.bio : "",
        imageUrl: user ? user?.imageUrl! : "",
    }

    return (
        <main className='bg-[#020817] p-14'>
            <section className="max-w-md mx-auto">
                <h1 className='text-3xl font-extrabold'>Onboarding</h1>
                <p className="text-xs text-slate-400">Complete your profile now, to use Ping.
                </p>
                <AccountProfile user={userData} btnTitle='Continue' />
            </section>
        </main>
    );
}