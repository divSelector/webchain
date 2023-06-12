import { React, useState } from 'react';
import PropTypes from 'prop-types';
import BackendSettings from '../../settings/Backend';
import './Login.css';


export default function Login({ setToken }) {

    async function loginUser(credentials) {
      const backend = BackendSettings()
      const backendHost = backend.host
      const backendAPI = backend.api
      const endpoint = backendHost + backendAPI + "/login/"
      console.log(endpoint)
      return fetch(endpoint, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              email: credentials.email,
              password: credentials.password
          })
      })
      .then(response => response.json())
      .then(data => {
        if (data.hasOwnProperty('key')) {
          setToken(data.key)
        }
      })
      .catch(error => {
          console.error('Error:', error)
      })
  }

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const handleSubmit = async e => {
        e.preventDefault()
        const token = await loginUser({
            email, password
        })
    }
    
  return(
    <div className="login-wrapper">
      <h1>Please Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <p>Username</p>
          <input type="text" onChange={e => setEmail(e.target.value)} />
        </label>
        <label>
          <p>Password</p>
          <input type="password" onChange={e => setPassword(e.target.value)} />
        </label>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  )
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired
}
