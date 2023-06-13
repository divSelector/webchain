import { useState } from 'react';
import PropTypes from 'prop-types';
import BackendSettings from '../../settings/Backend';
import FrontendSettings from '../../settings/Frontend';
import LabeledInputField from '../Fields/LabeledInputField';
import { handleSubmit, renderErrorMessage } from '../../utils/formsUtils';

export default function LoginForm({ setToken }) {

  const front = FrontendSettings()

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const [emailFieldError, setEmailFieldError] = useState('');
  const [passwordFieldError, setPasswordFieldError] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');

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

  return(
    <div id="login-form" className="login-register-wrapper">
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
      </form>
    </div>
  )
}

LoginForm.propTypes = {
  setToken: PropTypes.func.isRequired
}
