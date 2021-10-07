import React, { createContext, ReactNode, useContext } from 'react';

interface AuthProviderProps{
    children: ReactNode;
}

interface User {
    id: string;
    name: string;
    email: string;
    photo?: string;
}

interface AuthContextData {
    user: User;
}

const AuthContext = createContext({} as AuthContextData);

function AuthProvider({ children }: AuthProviderProps) {
    const user = {
        id: '1',
        name: 'Michel Maia',
        email: 'dimermichel@gmail.com',
        photo: 'https://avatars.githubusercontent.com/u/32581187?v=4'
    };

    async function signInWithGoogle() {
        try {
            
        } catch (error) {
            
        }
    }

    return (
    <AuthContext.Provider value={{ user }}>
       { children }
    </AuthContext.Provider>
    )
};

function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export { AuthProvider, useAuth };