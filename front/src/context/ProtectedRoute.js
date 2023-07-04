import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import back from "../settings/Backend";
import front from "../settings/Frontend";
import { useAuth } from "./AuthContext";

export function ProtectedRoute({ children, requireAuth, onlyResourcesOwnedByAuthUser }) {
    const { token } = useAuth();
    const location = useLocation();
  
    const [account, setAccount] = useState();
    const [resource, setResource] = useState();
    const [resourceOwnedByUser, setResourceOwnedByUser] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
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
          setAccount(data.account);
        } catch (error) {
          console.error(error);
        }
      };
  
      const getResource = async () => {
        // I have no excuse for this part.
        const endpoint = back.getNonAuthBaseUrl() 
          + location.pathname.replace(
            '/' + location.pathname.split('/')[2] + '/', '/'
          ).substring(1);
        try {
          const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
  
          if (response.ok) {
            const data = await response.json();
            const resourceType = location.pathname.split('/')[1];
            setResource(data[resourceType]);
          } else {
            console.log("Failure to Get Pages");
          }
        } catch (error) {
          console.log("Error Communicating with Server");
        }
      };
  
      const fetchData = async () => {
        await Promise.all([getUser(), getResource()]);
        setLoading(false);
      };
  
      if (onlyResourcesOwnedByAuthUser) {
        fetchData();
      } else {
        setLoading(false)
      }
    }, [location.pathname, onlyResourcesOwnedByAuthUser, token]);
  
    useEffect(() => {
      if (account && resource) {
        if (account.name === resource.account.name) {
          setResourceOwnedByUser(true);
        } else {
          setResourceOwnedByUser(false);
        }
      }
    }, [account, resource]);
  
    if (loading) {
      return <></>
    }
  
    if (onlyResourcesOwnedByAuthUser && resourceOwnedByUser === false) {
      return (
        <Navigate
          to={location.pathname.replace('/update/', '/')}
          replace
        />
      );
    } else if (requireAuth && !token) {
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
  