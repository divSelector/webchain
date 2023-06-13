import { useState } from 'react';
import SessionSettings from '../settings/Session';

export default function useToken() {

  const storageKey = SessionSettings().storageKeyName

  const getToken = () => {
    const tokenString = sessionStorage.getItem(storageKey);
    const userToken = JSON.parse(tokenString);
    return userToken
  }

  const [token, setToken] = useState(getToken());

  return {
    token,
    setToken: t => {
      sessionStorage.setItem(storageKey, JSON.stringify(t));
      setToken(t)
    }
  }
}
