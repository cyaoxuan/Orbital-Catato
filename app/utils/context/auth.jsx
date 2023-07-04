import { createContext, useState, useEffect, useContext } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { createUser, getUser } from "../db/user";

const AuthContext = createContext({});
export const auth = getAuth();

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
                if (authUser) {
                    // Logged in
                    setUser(authUser);
                    const userData = await getUser(authUser.uid);

                    if (userData) {
                        // Existing user
                        setUserRole(userData.role);
                    } else {
                        // New user
                        await createUser(authUser.uid, authUser.isAnonymous);
                        setUserRole({
                            isGuest: true,
                            isUser: !authUser.isAnonymous,
                            isCaretaker: false,
                            isAdmin: false,
                        });
                    }
                } else {
                    // Logged out
                    setUser(null);
                    setUserRole(null);
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
