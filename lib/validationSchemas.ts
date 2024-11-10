import { z } from "zod";

export const registerUserSchema = z.object({
    displayName: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export const signInUserSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});


export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type SignInUserInput = z.infer<typeof signInUserSchema>;