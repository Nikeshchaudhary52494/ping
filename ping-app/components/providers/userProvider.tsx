"use client"

import { getUser } from '@/actions/user/getUser';
import { MyUser } from '@/types/prisma';
import { User as PrismaUser } from '@prisma/client';
import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';

export const UserProvider = ({ children }: { children: ReactNode }) => {
    return (
        <MyUserContextProvider>
            {children}
        </MyUserContextProvider>
    )
}

export default UserProvider;

interface UserContextType {
    user: MyUser | null;
    loading: boolean;
    updateUser: (updatedUser: Partial<PrismaUser>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export type Props = {
    [propName: string]: any;
}

const MyUserContextProvider = (props: Props) => {
    const [user, setUser] = useState<MyUser | null>(null);

    const [loading, setLoading] = useState(true);

    const fetchUser = useCallback(async () => {
        setLoading(true);
        const { user, success } = await getUser();
        if (success) {
            setUser(user!);
        } else {
            setUser(null);
        }
        setLoading(false);
    }, []);

    const updateUser = useCallback((updatedUser: Partial<PrismaUser>) => {
        setUser((prevUser) => {
            if (!prevUser) return null;
            return { ...prevUser, ...updatedUser };
        });
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    return (
        <UserContext.Provider value={{ user, loading, updateUser }} {...props} />
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a MyUserContextProvider');
    }
    return context;
};