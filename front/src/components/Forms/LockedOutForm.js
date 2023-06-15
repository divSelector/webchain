import { useState } from 'react';
import BackendSettings from '../../settings/Backend';
import FrontendSettings from '../../settings/Frontend';
import LabeledInputField from '../Fields/LabeledInputField';
import { handleSubmit, renderErrorMessage } from '../../utils/formsUtils';
import PropTypes from 'prop-types';

export default function LockedOutForm({ toggleCantLogin, emailState }) {

  const [email, setEmail] = emailState;
  const frontend = FrontendSettings();

  const resendConfirmEmail = () => {
    console.log("resendConfirmEmail")
  }

  const resetPassword = () => {
    console.log("resendConfirmEmail")
  }

  return(
    <div id="locked-out-form" className="login-register-wrapper">
      <h2>Hi, I'm a Locksmith.</h2>
      <form onSubmit={(e) => handleSubmit(e, resendConfirmEmail, {email})}>

        <LabeledInputField type="text" id="locked-out-email" name="Email" pattern={frontend.emailRegex}
          onChange={e => setEmail(e.target.value)}
        />


        <button type="button" onClick={resendConfirmEmail}>Verify Email</button>
        <button type="button" onClick={resetPassword}>Reset Password</button>

      </form>
      
    </div>
  )
}

LockedOutForm.propTypes = {
  toggleCantLogin: PropTypes.func.isRequired,
  emailState: PropTypes.array.isRequired
}
