import { getUser } from "@/actions/user/getUser"
import { redirect } from "next/navigation";

export default async function Home() {
  const { user } = await getUser();
  if (!user?.onboarded) redirect("/onboarding");
  return (
    <div>
      Home
    </div>
  )
}