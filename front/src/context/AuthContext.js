import React, { useContext, useState, useEffect } from "react";
import front from '../settings/Frontend';
import back from "../settings/Backend";
import { useNavigate } from "react-router-dom";

export const AuthContext = React.createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const storageKey = front.storageKeyName;
  const expiresIn = 35100 * 1000; // 9.5 hours

  const navigate = useNavigate()

  const expireToken = () => {
    sessionStorage.removeItem(storageKey);
    window.location.href = front.host

  }

  const getToken = () => {
    const tokenData = JSON.parse(sessionStorage.getItem(storageKey));
    if (!tokenData) return null;

    const { t, e } = tokenData;
    if (Date.now() >= e) {
      expireToken()
      return null;
    }
    return t;
  };

  const [token, setToken] = useState(getToken());
  const [authAccount, setAuthAccount] = useState();


  const updateToken = (t) => {
    const e = Date.now() + expiresIn;
    const tokenData = { t, e };
    sessionStorage.setItem(storageKey, JSON.stringify(tokenData));
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
        expireToken()
      }

      const data = await response.json();
      setAuthAccount(data.account);
    } catch (error) {
      throw new Error(error);
    }
  };

  useEffect(() => {
    if (token) getUser()
  }, [token])

  useEffect(() => {
    if (token) {
      const tokenData = JSON.parse(sessionStorage.getItem(storageKey));
      if (tokenData) {
        const { e } = tokenData;
        if (Date.now() >= e) {
          expireToken();
        }
      }
    }
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ token, setToken: updateToken, authAccount }}>
      {children}
    </AuthContext.Provider>
  );
}
