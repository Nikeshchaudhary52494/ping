"use server";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { registerUserSchema } from "@/lib/validationSchemas";
import { generateToken, setAuthCookie } from "@/lib/jwtUtils";
import { encryptPrivateKey } from "@/lib/crypto";

export const registerUser = async (formData: FormData, publicKey: string, privateKey: string) => {
    try {
        const parsedData = registerUserSchema.safeParse({
            displayName: formData.get("displayName"),
            email: formData.get("email"),
            password: formData.get("password"),
        });

        if (!parsedData.success) {
            return { success: false, errors: parsedData.error.flatten() };
        }

        const { displayName, email, password } = parsedData.data;

        const existingUser = await db.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return { success: false, message: "Email already in use." };
        }

        const encryptedPrivateKey = await encryptPrivateKey(privateKey, password);

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await db.user.create({
            data: {
                displayName,
                email,
                password: hashedPassword,
                publicKey,
                encryptedPrivateKey: encryptedPrivateKey.encryptedKey,
                salt: encryptedPrivateKey.nonce,
                settings: {
                    create: {

                    }
                }
            },
        });

        const token = generateToken(newUser.id, newUser.email);
        setAuthCookie(token);
        return { success: true, message: "User registered successfully", token };

    } catch (error) {
        console.error("Error registering user:", error);
        return { success: false, message: "An error occurred during registration." };
    }
};
