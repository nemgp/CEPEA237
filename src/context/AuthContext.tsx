import { createContext, useContext, useState, type ReactNode } from 'react';

// Types
interface User {
    id: string;
    name: string;
    role: 'member' | 'admin';
}

interface AuthContextType {
    user: User | null;
    login: (name: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    const login = (name: string) => {
        // Simulation simple pour le MVP
        setUser({
            id: '1',
            name: name,
            role: 'member'
        });
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
