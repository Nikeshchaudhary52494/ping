"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CreateGroupInput, createGroupSchema } from "@/lib/validationSchemas";
import { Camera } from "lucide-react";
import Image from "next/image";
import { useUploadThing } from "@/lib/uploadthing";
import { createGroup } from "@/actions/chat/groupChat/createGroup";
import { useUser } from "@/components/providers/userProvider";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/app/hooks/use-toast";

interface CreateGroupFormProps {
    setIsOpen: (value: boolean) => void;
}

export default function CreateGroupForm({
    setIsOpen
}: CreateGroupFormProps) {

    const [files, setFiles] = useState<File[]>([]);
    const { startUpload } = useUploadThing("UserImage");
    const { user } = useUser();

    const form = useForm({
        resolver: zodResolver(createGroupSchema),
        defaultValues: {
            name: "",
            imageUrl: "",
            about: "New ping Group"
        },
    });

    const [isPending, startTransition] = useTransition();

    const onSubmit = (values: CreateGroupInput) => {
        startTransition(async () => {
            try {
                const blob = values.imageUrl;
                if (blob) {
                    const imgRes = await startUpload(files);

                    if (imgRes && imgRes[0].url) {
                        values.imageUrl = imgRes[0].url;
                    }
                }
                await createGroup({
                    ownerId: user?.id!,
                    about: values.about,
                    imageUrl: values.imageUrl,
                    name: values.name
                })
                toast({
                    description: "Group created"
                })
            }
            catch (error) {
                console.error("Error creating form:", error);
                toast({
                    description: "Error creating Group",
                    variant: "destructive"
                })
            } finally {
                setIsOpen(false)
            }
        })
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
        <div className="w-full space-y-4">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="flex items-center justify-between gap-12">
                        <FormField
                            control={form.control}
                            name='imageUrl'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        <div className="relative flex items-center justify-center w-20 h-20 overflow-hidden rounded-full bg-secondary">
                                            {field.value ? (
                                                <Image
                                                    fill
                                                    priority
                                                    className="object-cover"
                                                    src={field.value}
                                                    alt='profile_icon'
                                                />
                                            ) : (
                                                <Camera size={40} />
                                            )}
                                        </div>
                                    </FormLabel>
                                    <div className="flex flex-col space-y-2">
                                        <FormControl className='flex-1'>
                                            <Input
                                                type='file'
                                                accept='image/*'
                                                className="hidden"
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
                            name="name"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Group name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Friends"
                                            {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name='about'
                        render={({ field }) => (
                            <FormItem className='flex flex-col w-full gap-3'>
                                <FormLabel>About</FormLabel>
                                <FormControl>
                                    <Textarea rows={5} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button
                        className="w-full p-6 font-bold bg-primary"
                        type="submit"
                        disabled={isPending}>
                        {isPending ? "Creating.." : "Create group"}
                    </Button>
                </form>
            </Form>
        </div>
    );
}