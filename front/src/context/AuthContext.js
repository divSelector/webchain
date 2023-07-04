import React, { useContext, useState } from "react";
import front from '../settings/Frontend';

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
