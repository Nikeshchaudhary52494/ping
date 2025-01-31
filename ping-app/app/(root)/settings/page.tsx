import { MdSettings } from "react-icons/md";

export default function Settings() {
    return (
        <div className="flex flex-col items-center justify-center h-full gap-2 ">
            <MdSettings
                size={100}
                className="duration-2000 animate-spin"
            />
            <p className="text-2xl font-bold">Manage Settings</p>
        </div>
    )
}