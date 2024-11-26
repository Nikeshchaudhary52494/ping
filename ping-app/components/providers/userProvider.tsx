"use client"

import { getUser } from '@/actions/user/getUser';
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
    user: PrismaUser | null;
    loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export type Props = {
    [propName: string]: any;
}

const MyUserContextProvider = (props: Props) => {
    const [user, setUser] = useState<PrismaUser | null>(null);
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

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    return (
        <UserContext.Provider value={{ user, loading }} {...props} />
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a MyUserContextProvider');
    }
    return context;
};