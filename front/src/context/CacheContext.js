import { createContext, useContext } from 'react';

const CacheContext = createContext();

export function CacheProvider({ children }) {
  const responseCache = new Map();

  return (
    <CacheContext.Provider value={responseCache}>
      {children}
    </CacheContext.Provider>
  );
}

export function useCache() {
  return useContext(CacheContext);
}
