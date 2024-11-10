"use server";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { generateToken, setAuthCookie } from "@/lib/jwtUtils";
import { signInUserSchema } from "@/lib/validationSchemas";

export const signInUser = async (formData: FormData) => {
    const parsedData = signInUserSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    });

    if (!parsedData.success) {
        return { success: false, errors: parsedData.error.flatten() };
    }

    const { email, password } = parsedData.data;

    const existingUser = await db.user.findUnique({
        where: { email },
    });

    if (!existingUser) {
        return { success: false, message: "Invalid email or password." };
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);

    if (!isPasswordValid) {
        return { success: false, message: "Invalid email or password." };
    }

    const token = generateToken(existingUser.id, existingUser.email);
    setAuthCookie(token);

    return { success: true, message: "Signed in successfully", token };
};