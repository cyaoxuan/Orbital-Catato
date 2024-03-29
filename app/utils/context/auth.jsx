import { createContext, useState, useEffect, useContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { createUser, authGetUserByID } from "../db/user";
import { authState } from "../../config/firebase";

const AuthContext = createContext({});
export const auth = authState;

export function useAuth() {
    return useContext(AuthContext);
}

// Authentication provider component
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        // Subscribe to auth state changes
        const unsubscribeFromAuthStatusChanged = onAuthStateChanged(
            auth,
            async (authUser) => {
                setUser(authUser);

                if (!authUser) {
                    // Logged out
                    setUserRole(null);
                    return;
                }

                if (authUser.isAnonymous) {
                    // Guest, don't add into DB
                    setUserRole({
                        isGuest: true,
                        isUser: false,
                        isCaretaker: false,
                        isAdmin: false,
                    });
                    return;
                }

                // New / existing cat lover and above
                const userData = await authGetUserByID(authUser.uid);
                if (userData) {
                    // Existing user
                    setUserRole(userData.role);
                } else {
                    // New user
                    await createUser(authUser.uid, authUser.email);
                    setUserRole({
                        isGuest: true,
                        isUser: true,
                        isCaretaker: false,
                        isAdmin: false,
                    });
                }
            }
        );
        // Unsubscribe from auth state changes when component unmounts
        return unsubscribeFromAuthStatusChanged;
    }, []);

    return (
        <AuthContext.Provider value={{ user, userRole }}>
            {children}
        </AuthContext.Provider>
    );
}
