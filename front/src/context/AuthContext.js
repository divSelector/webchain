import React, { useContext, useState } from "react";
import front from '../settings/Frontend';
import { Navigate, useLocation } from "react-router-dom";


const AuthContext = React.createContext();
export const useAuth = () => useContext(AuthContext);


export function AuthProvider({ children }) {
  const storageKey = front.storageKeyName;

  const getToken = () => {
    const t = sessionStorage.getItem(storageKey);
    return JSON.parse(t);
  };

  const [token, setToken] = useState(getToken());

  const updateToken = (t) => {
    sessionStorage.setItem(storageKey, JSON.stringify(t));
    setToken(t);
  };

  return (
    <AuthContext.Provider value={{ token, setToken: updateToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function ProtectedRoute({ children, requireAuth }) {
    const { token } = useAuth();
    const location = useLocation();
  
    if (requireAuth && !token) {
      return (
        <Navigate
          to={front.login}
          replace
          state={{ path: location.pathname }}
        />
      );
    } else if (!requireAuth && token) {
      return (
        <Navigate
          to="/"
          replace
        />
      );
    }
  
    return children;
  }
  