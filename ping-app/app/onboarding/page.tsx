import { getUser } from "@/actions/user/getUser";
import AccountProfile from "@/components/account-profile";
import { redirect } from "next/navigation";

export default async function Onboarding() {
    const { user } = await getUser();

    if (!user) redirect("/sign-in");
    if (user.onboarded) redirect("/")

    return (
        <main className='bg-background p-14'>
            <section className="max-w-md mx-auto">
                <h1 className='text-3xl font-extrabold'>Onboarding</h1>
                <p className="text-xs text-secondary-foreground/40">Complete your profile now, to use Ping.
                </p>
                <AccountProfile user={user!} btnTitle='Continue' />
            </section>
        </main>
    );
}