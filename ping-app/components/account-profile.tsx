"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { useUploadThing } from "@/lib/uploadthing";
import { isBase64Image } from "@/lib/utils";
import { OnBoardingUserSchema, onBoardingUserSchema } from "@/lib/validationSchemas";
import { onboardUser } from "@/actions/user/onboardUser";
import { User } from "lucide-react";
import { User as UserType } from "@prisma/client";
import { useUser } from "./providers/userProvider";

interface Props {
    user: UserType;
    btnTitle: string;
}

const AccountProfile = ({ user, btnTitle }: Props) => {
    const router = useRouter();
    const pathname = usePathname();
    const { startUpload } = useUploadThing("UserImage");
    const [loading, setLoading] = useState(false);

    const [files, setFiles] = useState<File[]>([]);

    const form = useForm({
        resolver: zodResolver(onBoardingUserSchema),
        defaultValues: {
            displayName: user.displayName || "",
            imageUrl: user.imageUrl || "",
            username: user.username || "",
            bio: user.bio || "",
        },
    });

    const { updateUser } = useUser();

    const onSubmit = async (values: OnBoardingUserSchema) => {
        try {
            setLoading(true);
            const blob = values.imageUrl;
            if (blob) {
                const hasImageChanged = isBase64Image(blob);
                if (hasImageChanged) {
                    const imgRes = await startUpload(files);

                    if (imgRes && imgRes[0].url) {
                        values.imageUrl = imgRes[0].url;
                    }
                }
            }
            const onboardedUser = await onboardUser({
                userId: user.id,
                displayName: values.displayName,
                imageUrl: values.imageUrl,
                username: values.username,
                bio: values.bio
            });
            setLoading(false);
            updateUser({ ...onboardedUser })
            if (pathname === "/onboarding") {
                router.push("/");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    const handleImage = (
        e: ChangeEvent<HTMLInputElement>,
        fieldChange: (value: string) => void
    ) => {
        e.preventDefault();

        const fileReader = new FileReader();

        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setFiles(Array.from(e.target.files));

            if (!file.type.includes("image")) return;

            fileReader.onload = async (event) => {
                const imageDataUrl = event.target?.result?.toString() || "";
                fieldChange(imageDataUrl);
            };

            fileReader.readAsDataURL(file);
        }
    };

    return (
        <Form {...form}>
            <form
                className='flex flex-col justify-start mt-4 space-y-4'
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <FormField
                    control={form.control}
                    name='imageUrl'
                    render={({ field }) => (
                        <FormItem className='relative flex items-center gap-4 mt-10'>
                            <FormLabel className="space-y-2">
                                <p className="absolute full -top-4"> Profile Image (optional)</p>
                                <div className="relative flex items-center justify-center w-20 h-20 mx-3 overflow-hidden rounded-full bg-secondary">
                                    {field.value ? (
                                        <Image
                                            fill
                                            priority
                                            className="object-cover"
                                            src={field.value}
                                            alt='profile_icon'
                                        />
                                    ) : (
                                        <User size={40} className="text-slate-400" />
                                    )}
                                </div>

                            </FormLabel>
                            <div className="flex flex-col space-y-2">
                                <FormControl className='flex-1 text-gray-200'>
                                    <Input
                                        type='file'
                                        accept='image/*'
                                        placeholder='Add profile photo'
                                        onChange={(e) => handleImage(e, field.onChange)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </div>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='displayName'
                    render={({ field }) => (
                        <FormItem className='flex flex-col w-full gap-3'>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input type='text' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='username'
                    render={({ field }) => (
                        <FormItem className='flex flex-col w-full gap-3'>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input type='text' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='bio'
                    render={({ field }) => (
                        <FormItem className='flex flex-col w-full gap-3'>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                                <Textarea rows={10} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type='submit' disabled={loading}>
                    {loading ? "saving..." : btnTitle}
                </Button>
            </form>
        </Form>
    );
};

export default AccountProfile;
