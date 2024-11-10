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

export const onBoardingUserSchema = z.object({
    displayName: z.string().min(2, { message: "Name must be at least 2 characters." }),
    imageUrl: z.string().url().optional(),
    username: z
        .string()
        .min(3, { message: "Username must be at least 3 characters." })
        .max(20, { message: "Username must be at most 20 characters." })
        .regex(/^[a-zA-Z0-9_]+$/, {
            message: "Username can only contain letters, numbers, and underscores.",
        })
        .trim(),
    bio: z.string().optional().default("hey there new to ping"),
});



export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type SignInUserInput = z.infer<typeof signInUserSchema>;
export type OnBoardingUserSchema = z.infer<typeof onBoardingUserSchema>;