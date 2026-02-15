import { useState, useEffect } from "react";

// Mock User Interface
export interface User {
    id: string;
    email: string;
    name: string;
}

export interface Session {
    user: User;
    session: {
        id: string;
        userId: string;
        expiresAt: Date;
    };
}

// Helper to get session from localStorage
const getSession = (): Session | null => {
    const sessionStr = localStorage.getItem("sokrate-session");
    if (!sessionStr) return null;
    try {
        const session = JSON.parse(sessionStr);
        // Convert string dates back to Date objects
        session.session.expiresAt = new Date(session.session.expiresAt);
        return session;
    } catch (e) {
        return null;
    }
};

const setSession = (session: Session) => {
    localStorage.setItem("sokrate-session", JSON.stringify(session));
    // Dispatch event to update other components
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("sokrate-auth-change"));
};

const clearSession = () => {
    localStorage.removeItem("sokrate-session");
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("sokrate-auth-change"));
};

// Mock Auth Client
export const authClient = {
    signIn: {
        email: async (data: { email: string; password?: string }) => {
            // Simulate network delay
            await new Promise((resolve) => setTimeout(resolve, 500));

            // Allow any email/password for demo purposes
            const user: User = {
                id: "user-123",
                email: data.email,
                name: data.email.split("@")[0], // Default name from email
            };

            const session: Session = {
                user,
                session: {
                    id: "session-123",
                    userId: user.id,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
                },
            };

            setSession(session);
            return { data: session, error: null };
        },
    },
    signUp: {
        email: async (data: { email: string; password?: string; name?: string }) => {
            // Simulate network delay
            await new Promise((resolve) => setTimeout(resolve, 500));

            const user: User = {
                id: "user-123",
                email: data.email,
                name: data.name || data.email.split("@")[0],
            };

            const session: Session = {
                user,
                session: {
                    id: "session-123",
                    userId: user.id,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
                },
            };

            setSession(session);
            return { data: session, error: null };
        },
    },
    signOut: async () => {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 200));
        clearSession();
        return { data: { success: true }, error: null };
    },
    useSession: () => {
        const [session, setSessionState] = useState<Session | null>(getSession());
        const [isPending, setIsPending] = useState(true); // Start as pending to prevent flash

        useEffect(() => {
            // Initial check
            setSessionState(getSession());
            setIsPending(false);

            // Listen for changes
            const handleStorageChange = () => {
                setSessionState(getSession());
            };

            window.addEventListener("storage", handleStorageChange);
            window.addEventListener("sokrate-auth-change", handleStorageChange);

            return () => {
                window.removeEventListener("storage", handleStorageChange);
                window.removeEventListener("sokrate-auth-change", handleStorageChange);
            };
        }, []);

        return { data: session, isPending, error: null };
    }
};

export const { signIn, signUp, signOut, useSession } = authClient;
