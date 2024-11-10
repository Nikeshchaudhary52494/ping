"use server"


import { cookies } from 'next/headers';

export const logoutUser = async () => {
    try {
        const cookieStore = cookies();

        cookieStore.set('token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 0,
            path: '/',
        });

        return { success: true, message: 'Logged out successfully' };
    } catch (error) {
        return { success: false, message: 'Error logging out' };
    }
};