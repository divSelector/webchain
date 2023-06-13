import { React, useState } from 'react';
import PropTypes from 'prop-types';
import BackendSettings from '../../settings/Backend';
import './RegisterForm.css';


export default function RegisterForm() {

    async function registerUser(credentials) {
      const settings = BackendSettings()
      const endpoint = settings.getBaseUrl() + settings.register
      console.log(endpoint)
      return fetch(endpoint, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              email: credentials.email,
              password1: credentials.password1,
              password2: credentials.password2
          })
      })
      .then(response => response.json())
      .then(data => {
        Object.entries(data).forEach(([key, values]) => {
          console.log(key + " : " + values.forEach(
            value => console.log(value)
          ))
        })
      })
      .catch(error => {
          console.error('Error:', error)
      })
  }

    const [email, setEmail] = useState();
    const [password1, setPassword1] = useState();
    const [password2, setPassword2] = useState();

    const handleSubmit = async e => {
        e.preventDefault()
        const token = await registerUser({
            email, password1, password2
        })
    }
    
  return(
    <div className="login-wrapper">
      <h1>Or Register Account</h1>
      <form onSubmit={handleSubmit}>

        <label htmlFor="email">Email</label>
        <input type="text" id="email" onChange={e => setEmail(e.target.value)} />

        <label htmlFor="password1">Password</label>
        <input type="password" id="password1" onChange={e => setPassword1(e.target.value)} />

        <label htmlFor="password2">Password Again</label>
        <input type="password" id="password2" onChange={e => setPassword2(e.target.value)} />

        <button type="submit">Submit</button>

      </form>
    </div>
  )
}
