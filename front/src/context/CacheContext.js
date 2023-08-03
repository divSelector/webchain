import { createContext, useContext, useEffect } from 'react';

const CacheContext = createContext();

export function CacheProvider({ children }) {
  const storedCache = localStorage.getItem('responseCache');
  const initialCache = storedCache ? new Map(JSON.parse(storedCache)) : new Map();

  const [responseCache, setResponseCache] = useState(initialCache);

  useEffect(() => {
    localStorage.setItem(
      'responseCache', 
      JSON.stringify(
        Array.from(responseCache.entries())
      )
    );
  }, [responseCache]);

  return (
    <CacheContext.Provider value={responseCache}>
      {children}
    </CacheContext.Provider>
  );
}

export function useCache() {
  return useContext(CacheContext);
}