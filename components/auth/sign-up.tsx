"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { RegisterUserInput, registerUserSchema } from "@/lib/validationSchemas";
import { registerUser } from "@/actions/user/registerUser";
import { toast } from "@/app/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function SignUp() {
    const router = useRouter();
    const form = useForm({
        resolver: zodResolver(registerUserSchema),
        defaultValues: {
            displayName: "",
            email: "",
            password: "",
        },
    });

    const [isPending, startTransition] = useTransition();

    const onSubmit = (data: RegisterUserInput) => {
        startTransition(async () => {
            const formData = new FormData();
            formData.append("displayName", data.displayName);
            formData.append("email", data.email);
            formData.append("password", data.password);

            const result = await registerUser(formData);

            if (result.success) {
                toast({
                    description: "User registered succesfully",
                })
                router.push("/");
            } else {
                toast({
                    variant: "destructive",
                    description: result.message,
                })
            }
        });
    };

    return (
        <div className="w-full max-w-sm space-y-2">
            <h1 className="text-3xl font-bold">Ping</h1>
            <p className="text-xs text-slate-400">Connecting friends</p>
            <h2 className="text-3xl">Create account</h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="displayName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="John Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
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
                                <FormDescription>
                                    Your password must be at least 6 characters.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Signing up..." : "Sign up"}
                    </Button>
                </form>
            </Form>
            <p className="pt-2 text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link className="font-semibold underline text-primary" href={"/sign-in"}>
                    Sign-in
                </Link>
            </p>
        </div>
    );
}