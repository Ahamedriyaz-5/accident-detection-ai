import React, { createContext, useContext, useState, useCallback } from "react";

export interface UserProfile {
    name: string;
    phone: string;
    alternatePhone: string;
    email: string;
    bloodType: string;
    allergies: string;
    familyContacts: { name: string; phone: string }[];
    permissions: {
        gps: boolean;
        microphone: boolean;
        notifications: boolean;
        camera: boolean;
    };
}

interface UserContextType {
    user: UserProfile | null;
    isAuthenticated: boolean;
    login: (phone: string) => boolean;
    register: (profile: UserProfile) => void;
    logout: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

// Profile data — persisted forever
const PROFILE_KEY = "guardian_angel_user";
// Session flag — cleared only on explicit logout
const SESSION_KEY = "guardian_angel_session";

const hasActiveSession = () => !!localStorage.getItem(SESSION_KEY);

const loadProfile = (): UserProfile | null => {
    try {
        const stored = localStorage.getItem(PROFILE_KEY);
        return stored ? JSON.parse(stored) : null;
    } catch {
        return null;
    }
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    // On mount: if there is both a stored profile AND an active session, auto-login
    const [user, setUser] = useState<UserProfile | null>(() => {
        if (hasActiveSession()) return loadProfile();
        return null;
    });

    const isAuthenticated = !!user;

    /** Called after signup wizard completes */
    const register = useCallback((profile: UserProfile) => {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
        localStorage.setItem(SESSION_KEY, "1");   // start session
        setUser(profile);
    }, []);

    /** Called from login screen — matches phone against stored profile */
    const login = useCallback((phone: string): boolean => {
        const profile = loadProfile();
        if (profile && profile.phone === phone) {
            localStorage.setItem(SESSION_KEY, "1"); // persist session
            setUser(profile);
            return true;
        }
        return false;
    }, []);

    /** Called from logout button — clears session but keeps profile for next login */
    const logout = useCallback(() => {
        localStorage.removeItem(SESSION_KEY);     // end session only
        setUser(null);
    }, []);

    return (
        <UserContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error("useUser must be used within UserProvider");
    return ctx;
};
