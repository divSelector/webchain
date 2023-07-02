import FrontendSettings from '../../settings/Frontend';
import LabeledInputField from '../Fields/LabeledInputField';
import { handleSubmit, renderErrorMessage } from '../../utils/formsUtils';
import PropTypes from 'prop-types';
import { useState } from 'react';
import BackendSettings from '../../settings/Backend';

export default function LockedOutForm({ emailState }) {

  const [email, setEmail] = emailState
  const [feedbackMsg, setFeedbackMsg] = useState('')

  const front = FrontendSettings()
  const back = BackendSettings()

  const resendConfirmEmail = async ( credentials ) => {
    const endpoint = back.getBaseUrl() + back.resendEmail
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          email: credentials.email
        })
      });

      if (response.ok) {
        const data = await response.json()
        if (data.hasOwnProperty('message') && 
          data.message == "Email confirmation sent") {
          window.location.replace(front.verifyEmail)
        }
      } else {
        const data = await response.json()
        
        const errorMappings = [
          { key: "message", setter: setFeedbackMsg },
          { key: "detail", setter: setFeedbackMsg }
        ];
        
        errorMappings.forEach(({ key, setter }) => {
          renderErrorMessage(data, key, setter);
        });
      }
    } catch (error) {
      setFeedbackMsg("Error Communicating with Server")
    }
  }

  const resetPassword = async ( credentials ) => {
    const endpoint = back.getBaseUrl() + back.resetPassword
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          email: credentials.email
        })
      });

      if (response.ok) {
        const data = await response.json()
        if (data.hasOwnProperty('detail') && 
          data.detail == "Password reset e-mail has been sent.") {
          window.location.replace(front.verifyEmail)
        }
      } else {
        const data = await response.json()
        
        const errorMappings = [
          { key: "message", setter: setFeedbackMsg },
          { key: "detail", setter: setFeedbackMsg }
        ];
        
        errorMappings.forEach(({ key, setter }) => {
          renderErrorMessage(data, key, setter);
        });
      }
    } catch (error) {
      setFeedbackMsg("Error Communicating with Server")
    }
  }

  return(
    <div id="locked-out-form" className="form-wrapper">
      <h2>Hi, I'm a Locksmith.</h2>
      <form onSubmit={(e) => handleSubmit(e, resendConfirmEmail, {email})}>

        <LabeledInputField type="text" id="locked-out-email" name="Email" pattern={front.emailRegex}
          onChange={e => setEmail(e.target.value)}
        />

        {feedbackMsg && <p className="error-text" id="locked-out-form-error">{feedbackMsg}</p>}

        <button type="button" onClick={() => resendConfirmEmail({email})}>Verify Email</button>
        <button type="button" onClick={() => resetPassword({email})}>Reset Password</button>

      </form>
      
    </div>
  )
}

LockedOutForm.propTypes = {
  emailState: PropTypes.array.isRequired
}
