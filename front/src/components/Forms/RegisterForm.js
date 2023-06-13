import { useState } from 'react';
import BackendSettings from '../../settings/Backend';
import FrontendSettings from '../../settings/Frontend';
import LabeledInputField from '../Fields/LabeledInputField';

export default function RegisterForm() {

  async function registerUser(credentials) {
    const backend = BackendSettings()
    const endpoint = backend.getBaseUrl() + backend.register
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
      if (data.hasOwnProperty('detail') && data.detail == "Verification e-mail sent.") {
        const frontend = FrontendSettings()
        window.location.replace(frontend.verifyEmail)
      }
      Object.entries(data).forEach(([key, value]) => {
        console.log(key + " : " + value)
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
    <div id="register-form" className="login-register-wrapper">
      <h2>or Register</h2>
      <form onSubmit={handleSubmit}>

        <LabeledInputField type="text" id="register-email" name="Email" 
          onChange={e => setEmail(e.target.value)} 
        />
        <LabeledInputField type="password" id="password1" name="Password" 
          onChange={e => setPassword1(e.target.value)} 
        />
        <LabeledInputField type="password" id="password2" name="Password Again" 
          onChange={e => setPassword2(e.target.value)} 
        />

        <button type="submit">REGISTER</button>

        <p id="register-form-error"></p>

      </form>
    </div>
  )
}
