import { useState } from 'react';
import PropTypes from 'prop-types';
import BackendSettings from '../../settings/Backend';
import FrontendSettings from '../../settings/Frontend';
import LabeledInputField from '../Fields/LabeledInputField';

export default function LoginForm({ setToken }) {

  const front = FrontendSettings()
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [emailFieldError, setEmailFieldError] = useState('');
  const [passwordFieldError, setPasswordFieldError] = useState('');

  // async function loginUser(credentials) {
  //   const back = BackendSettings()
  //   const endpoint = back.getBaseUrl() + back.login

  //   return fetch(endpoint, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({
  //       email: credentials.email,
  //       password: credentials.password
  //     })
  //   })
  //   .then(response => response.json())
  //   .then(data => {
  //     if (data.hasOwnProperty('key')) {
  //       console.log(data.key)
  //       setToken(data.key)
  //       if (window.location.href.includes(front.verifyEmail)) {
  //         window.location.href = "/";
  //       }
  //     }
  //   })
  //   .catch(error => {
  //     console.error('Error:', error)
  //   })
  // }
  const loginUser = async (credentials) => {
    const settings = BackendSettings()
    const endpoint = settings.getBaseUrl() + settings.login
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          email: credentials.email,
          password: credentials.password
        })
      });

      console.log(response)
      if (response.ok) {
        const data = await response.json()
        if (data.hasOwnProperty('key')) {
          console.log(data.key)
          setToken(data.key)
          if (window.location.href.includes(front.verifyEmail)) {
            window.location.href = "/";
          }
        }
      } else {
        const data = await response.json()
        console.log(data)
        
        let emailError = ""
        if (data.hasOwnProperty("email")) {
          for (let error of data.email) {
            console.log(error)
            if (typeof error !== undefined) emailError += error
          }
        }
        console.log(emailError)
        setEmailFieldError(emailError)

        let passwordError = ""
        if (data.hasOwnProperty("password")) {
          for (let error of data.password) {
            if (error !== undefined) passwordError += error
          }
        }
        setPasswordFieldError(passwordError)

        let nonFieldErrors = ""
        if (data.hasOwnProperty("non_field_errors")) {
          for (let error of data.non_field_errors) {
            if (error !== undefined) nonFieldErrors += error
          }
        }
        setFeedbackMsg(nonFieldErrors)

      }
    } catch (error) {
      setFeedbackMsg("Error Communicating with Server")
    }
  };

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async e => {
      e.preventDefault()
      const token = await loginUser({
          email, password
      })
  }
    
  return(
    <div id="login-form" className="login-register-wrapper">
      <h2>Please Log In</h2>
      <form onSubmit={handleSubmit}>

        <LabeledInputField type="text" id="login-email" name="Email" 
          onChange={e => setEmail(e.target.value)} error={emailFieldError} 
        />
        <LabeledInputField type="password" id="password" name="Password" 
          onChange={e => setPassword(e.target.value)} error={passwordFieldError}
        />

        <button type="submit">LOGIN</button>
        {feedbackMsg && <p className="error-text" id="login-form-error">{feedbackMsg}</p>}
      </form>
    </div>
  )
}

LoginForm.propTypes = {
  setToken: PropTypes.func.isRequired
}
