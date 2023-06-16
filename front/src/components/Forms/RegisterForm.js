import { useState } from 'react';
import BackendSettings from '../../settings/Backend';
import FrontendSettings from '../../settings/Frontend';
import LabeledInputField from '../Fields/LabeledInputField';
import { handleSubmit, renderErrorMessage } from '../../utils/formsUtils';

export default function RegisterForm() {

  const [email, setEmail] = useState();
  const [password1, setPassword1] = useState();
  const [password2, setPassword2] = useState();

  const [emailFieldError, setEmailFieldError] = useState('');
  const [password1FieldError, setPassword1FieldError] = useState('');
  const [password2FieldError, setPassword2FieldError] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const frontend = FrontendSettings()

  const registerUser = async (credentials) => {
    const settings = BackendSettings()
    const endpoint = settings.getBaseUrl() + settings.register
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          email: credentials.email,
          password1: credentials.password1,
          password2: credentials.password2
        })
      });
      if (response.ok) {
        const data = await response.json()
        if (data.hasOwnProperty('detail') && 
            data.detail == "Verification e-mail sent.") {
          
          window.location.replace(frontend.verifyEmail)
        } else {
          console.log("Doesn't have detail key")
        }
      } else {
        const data = await response.json()

        const errorMappings = [
          { key: "email", setter: setEmailFieldError },
          { key: "password1", setter: setPassword1FieldError },
          { key: "password2", setter: setPassword2FieldError },
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
    <div id="register-form" className="login-register-wrapper">
      <h2>Register New Account</h2>
      <form onSubmit={(e) => handleSubmit(e, registerUser, {
        email, password1, password2
      })}>

        <LabeledInputField type="text" id="register-email" name="Email" pattern={frontend.emailRegex}
          onChange={e => setEmail(e.target.value)} error={emailFieldError}
        />
        <LabeledInputField type="password" id="register-password1" name="Password" 
          onChange={e => setPassword1(e.target.value)} error={password1FieldError}
        />
        <LabeledInputField type="password" id="register-password2" name="Password Again" 
          onChange={e => setPassword2(e.target.value)} error={password2FieldError}
        />

        <button type="submit">REGISTER</button>
        {feedbackMsg && <p className="error-text" id="register-form-error">{feedbackMsg}</p>}

      </form>
    </div>
  )
}
