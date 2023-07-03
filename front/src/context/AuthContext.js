import React, { useContext } from "react";
import useToken from "../hooks/useToken";

export const AuthContext = React.createContext()

export function AuthProvider({ children }) {

    const tokenState = useToken()

    return (
        <AuthContext.Provider value={tokenState}>
            {children}
        </AuthContext.Provider>

    )
}

export const useAuth = () => useContext(AuthContext)