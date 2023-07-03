import { useState } from 'react';
import FrontendSettings from '../settings/Frontend';

export default function useToken() {

  const storageKey = FrontendSettings().storageKeyName

  const getToken = () => {
    const t = sessionStorage.getItem(storageKey);
    return JSON.parse(t);
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
