import { React, useState } from 'react';
import PropTypes from 'prop-types';
import BackendSettings from '../../settings/Backend';
import './Login.css';
import FrontendSettings from '../../settings/Frontend';

export default function LoginForm({ setToken }) {

  const front = FrontendSettings()

  async function loginUser(credentials) {
    const back = BackendSettings()
    const endpoint = back.getBaseUrl() + back.login
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
        console.log(data.key)
        setToken(data.key)
        if (window.location.href.includes(front.verifyEmail)) {
          window.location.href = "/";
        }
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

        <label htmlFor="email">Email</label>
        <input type="text" id="email" onChange={e => setEmail(e.target.value)} />

        <label htmlFor="password">Password</label>
        <input type="password" id="password" onChange={e => setPassword(e.target.value)} />

        <button type="submit">Submit</button>

      </form>
    </div>
  )
}

LoginForm.propTypes = {
  setToken: PropTypes.func.isRequired
}
