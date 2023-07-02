import { React, useState } from 'react';
import PropTypes from 'prop-types';
import BackendSettings from '../../settings/Backend';


export default function LogoutButton({ token, setToken }) {

    console.log(token)

    async function logoutUser(credentials) {
      const settings = BackendSettings()
      const endpoint = settings.getBaseUrl() + settings.logout
      console.log(endpoint)
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
            console.log(data.detail);
            setToken(null)
            sessionStorage.clear()
          } else {
            console.log(data.detail);
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

LogoutButton.propTypes = {
  token: PropTypes.string.isRequired,
  setToken: PropTypes.func.isRequired
}
