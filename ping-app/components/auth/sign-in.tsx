"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTransition } from "react";

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
import { ShieldQuestion } from "lucide-react";
import { useRouter } from "next/navigation";
import { SignInUserInput, signInUserSchema } from "@/lib/validationSchemas";
import { signInUser } from "@/actions/auth/signInUser";
import { toast } from "@/app/hooks/use-toast";
import Link from "next/link";
import { decryptPrivateKey } from "@/lib/crypto";

export default function SignIn() {
    const router = useRouter();
    const form = useForm({
        resolver: zodResolver(signInUserSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const [isPending, startTransition] = useTransition();

    const onSubmit = (data: SignInUserInput) => {
        startTransition(async () => {
            const formData = new FormData();
            formData.append("email", data.email);
            formData.append("password", data.password);

            const result = await signInUser(formData);
            if (result.success) {
                toast({
                    description: "User signed in successfully",
                });
                localStorage.setItem("pingPublicKey", result.user?.publicKey!);
                const privateKey = await decryptPrivateKey(result.user?.encryptedPrivateKey!, data.password, result.user?.salt!)
                localStorage.setItem("pingPrivateKey", privateKey);
                router.push("/");
            } else {
                toast({
                    variant: "destructive",
                    description: result.message,
                });
            }
        });
    };

    const handleGuestLogin = () => {
        startTransition(async () => {
            const formData = new FormData();
            formData.append("email", "guestuser@gmail.com");
            formData.append("password", "guestPassword123");

            const result = await signInUser(formData);
            if (result.success) {
                toast({
                    description: "Guest user signed in successfully",
                });
                localStorage.setItem("pingPublicKey", result.user?.publicKey!);
                const privateKey = await decryptPrivateKey(result.user?.encryptedPrivateKey!, result.user?.salt!, "guestPassword123")
                localStorage.setItem("pingPrivateKey", privateKey);
                router.push("/");
            } else {
                toast({
                    variant: "destructive",
                    description: result.message,
                });
            }
        });
    };

    return (
        <div className="w-full max-w-sm space-y-4">
            <div className="space-y-2">
                <h1 className="text-3xl text-primary font-bold">Ping</h1>
                <p className="text-xs text-secondary-foreground/40">Connecting friends</p>
                <h2 className="text-3xl">Sign in</h2>
                <div
                    className="flex w-full gap-2 p-2 font-bold text-yellow-400 duration-200 rounded-lg cursor-pointer bg-yellow-950/50"
                    onClick={handleGuestLogin}
                >
                    <ShieldQuestion />
                    <p>Guest Mode</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="example@mail.com" type="email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="••••••••" type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Signing in..." : "Sign in"}
                        </Button>
                    </form>
                </Form>
            </div>
            <p className="text-sm text-muted-foreground">
                New to Ping{" "}
                <Link className="font-semibold underline text-primary" href={"/sign-up"}>
                    Sign-up
                </Link>
            </p>
        </div>
    );
}