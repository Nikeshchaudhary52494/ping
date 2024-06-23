import { fetchUser } from "@/actions/user.actions";
import AccountProfile from "@/components/account-profile";
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from "next/navigation";

export default async function Onboarding() {
    const user = await currentUser();
    if (!user) return null;
    const userInfo = await fetchUser(user.id);
    if (userInfo?.onboarded) redirect("/");

    const userData = {
        userId: user?.id,
        username: userInfo ? userInfo?.username : "",
        name: userInfo ? userInfo?.name : user.firstName ?? "",
        bio: userInfo ? userInfo?.bio : "",
        imageUrl: userInfo ? userInfo?.imageUrl : user.imageUrl,
    }

    return (
        <main className='mx-auto flex max-w-3xl bg-[#0E0E10] flex-col justify-start px-10 py-20'>
            <h1 className='text-3xl'>Onboarding</h1>
            <p className='mt-3 text-base-regular text-light-2'>
                Complete your profile now, to use Threds.
            </p>

            <section className='mt-9 bg-[#1D1D21] p-10'>
                <AccountProfile user={userData} btnTitle='Continue' />
            </section>
        </main>
    );
}