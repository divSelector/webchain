import React, { useContext, useState, useEffect } from "react";
import front from '../settings/Frontend';
import back from "../settings/Backend";
export const AuthContext = React.createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const storageKey = front.storageKeyName;

  const getToken = () => {
    const t = sessionStorage.getItem(storageKey);
    return JSON.parse(t);
  };

  const [token, setToken] = useState(getToken());
  const [authAccount, setAuthAccount] = useState();

  const updateToken = (t) => {
    sessionStorage.setItem(storageKey, JSON.stringify(t));
    setToken(t);
  };

  const getUser = async () => {
    try {
      const endpoint = back.getNonAuthBaseUrl() + 'user/';
      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch account details');
      }

      const data = await response.json();
      setAuthAccount(data.account);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (token) getUser()
  }, [token])

  return (
    <AuthContext.Provider value={{ token, setToken: updateToken, authAccount }}>
      {children}
    </AuthContext.Provider>
  );
}
