import React, { useContext } from "react";
import useToken from "../hooks/useToken";
import { useState, useEffect } from 'react';
import BackendSettings from "../settings/Backend";
import FrontendSettings from '../settings/Frontend';
import LabeledInputField from "../components/Fields/LabeledInputField";
import { handleSubmit, renderErrorMessage } from '../utils/formsUtils';
import { Link } from 'react-router-dom';


export const AuthContext = React.createContext()

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
    const tokenState = useToken()
    return (
        <AuthContext.Provider value={tokenState}>
            {children}
        </AuthContext.Provider>

    )
}

export default function AuthConsumer() {
    <AuthContext.Consumer>
        {tokenState => tokenState}
  </AuthContext.Consumer>
  }

export function AuthContextTestComponent() {

  const { token, setToken } = useAuth()
  console.log(token)

  const front = FrontendSettings()
  const back = BackendSettings()

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const [emailFieldError, setEmailFieldError] = useState('');
  const [passwordFieldError, setPasswordFieldError] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');


  useEffect(() => {
    if (feedbackMsg === back.errors.emailNotVerified) {
      resendVerificationEmail();
    }
  }, [feedbackMsg]);

  const loginUser = async (credentials) => {
   
    const endpoint = back.getBaseUrl() + back.login
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

      if (response.ok) {
        const data = await response.json()
        if (data.hasOwnProperty('key')) {
          setToken(data.key)
          if (window.location.href.includes(front.verifyEmail)) {
            window.location.href = "/";
          }
        }
      } else {
        const data = await response.json()
        
        const errorMappings = [
          { key: "email", setter: setEmailFieldError },
          { key: "password", setter: setPasswordFieldError },
          { key: "non_field_errors", setter: setFeedbackMsg }
        ];
        
        errorMappings.forEach(({ key, setter }) => {
          renderErrorMessage(data, key, setter);
        });

      }
    } catch (error) {
      setFeedbackMsg("Error Communicating with Server")
    }
  };

  const resendVerificationEmail = async () => {
    const endpoint = back.getBaseUrl() + back.resendEmail
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({email})
      });

      if (response.ok) {
        const data = await response.json()
        if (data.hasOwnProperty('message')) {
          setFeedbackMsg(back.errors.emailNotVerified + " Resending Verification.")
        }
      }
    } catch (error) {
      setFeedbackMsg("Error Communicating with Server")
    }
  };

  return(

        <div id="login-form" className="form-wrapper">
            <h2>Please Log In</h2>
            <form onSubmit={(e) => handleSubmit(e, loginUser, {
                email, password
            })}>

                <LabeledInputField type="text" id="login-email" name="Email" 
                onChange={e => setEmail(e.target.value)} error={emailFieldError} 
                />
                <LabeledInputField type="password" id="login-password" name="Password" 
                onChange={e => setPassword(e.target.value)} error={passwordFieldError}
                />

                <button type="submit">LOGIN</button>
                {feedbackMsg && <p className="error-text" id="login-form-error">{feedbackMsg}</p>}
                <Link to={`/login/help`} className="help-text">
                I can't get in.
                </Link>
            </form>
        </div>

  )
}
