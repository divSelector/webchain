import React from 'react';
import back from '../../settings/Backend';
import { useAuth } from '../../context/AuthContext';
import nicerFetch from '../../utils/requestUtils';

export default function LogoutButton() {

  const { token, setToken } = useAuth()

  async function logoutUser() {
    const endpoint = back.getBaseUrl() + back.logout
    try {
      const data = await nicerFetch({
        endpoint: endpoint,
        method: 'POST',
        token: token 
      });

      if (data.detail.includes("Success")) {
        setToken(null)
        localStorage.clear()
      }

    } catch (error) {
      console.log(error)
    }
  }

  const handleClick = async e => {
    e.preventDefault()
    await logoutUser()
  }

  return (
    <a href="#" onClick={handleClick}>Log Out</a>
  )
}
