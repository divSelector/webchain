import { React, useState } from 'react';
import back from '../../settings/Backend';
import { useAuth } from '../../context/AuthContext';


export default function LogoutButton() {

  const { token, setToken } = useAuth()

    async function logoutUser(credentials) {
      const endpoint = back.getBaseUrl() + back.logout
      return fetch(endpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          }
      })
      .then(response => response.json())
      .then(data => {
        if (data.detail.includes("Success")) {
            setToken(null)
            sessionStorage.clear()
          }
          
      })
      .catch(error => {
          console.error('Error:', error)
      })
  }

    const handleClick = async e => {
        e.preventDefault()
        await logoutUser({
            token
        })
    }
    
  return(
      <a href="#" onClick={handleClick}>Log Out</a>
  )
}
