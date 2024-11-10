import { sign, verify } from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const generateToken = (userId: string, email: string): string => {
    console.log(JWT_SECRET);
    return sign({ userId, email }, JWT_SECRET, {
        expiresIn: "1h",
    });
};

export const setAuthCookie = (token: string): void => {
    const cookieStore = cookies();
    cookieStore.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600,
        path: "/",
    });
};

export const verifyToken = (): { userId: string; email: string } | null => {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        return null;
    }

    try {
        const decoded = verify(token, JWT_SECRET) as { userId: string; email: string };
        return decoded;
    } catch (error) {
        console.error("Invalid token", error);
        return null;
    }
};
