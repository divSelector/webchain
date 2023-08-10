import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import back from '../../settings/Backend';
import { handleSubmit } from '../../utils/formsUtils';
import LabeledInputField from '../Fields/LabeledInputField';
import { renderErrorMessage } from '../../utils/formsUtils';
import front from '../../settings/Frontend';
import { useAuth } from '../../context/AuthContext';

export default function PasswordReset() {
  const { token } = useAuth()
  const { userId, resetToken } = useParams();
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const [password1, setPassword1] = useState();
  const [password2, setPassword2] = useState();

  const [password1FieldError, setPassword1FieldError] = useState('');
  const [password2FieldError, setPassword2FieldError] = useState('');

  

  const navigate = useNavigate()

  useEffect(() => {
    if (token) navigate('/')
  }, [token])

  const resetPassword = async () => {
    if (password1 != password2) {
      setFeedbackMsg("Passwords do not match")
      return
    }
    const endpoint = back.getBaseUrl() + back.resetPasswordConfirm
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uid: userId,
          token: resetToken,
          new_password1: password1,
          new_password2: password2
         })
      });
      if (response.ok) {
        window.location.replace(front.host)
      } else {
        const errorText = await response.statusText;
        const data = await response.json();
        const errorMappings = [
          { key: "new_password1", setter: setPassword1FieldError },
          { key: "new_password2", setter: setPassword2FieldError },
          { key: "non_field_errors", setter: setFeedbackMsg },
          { key: "token", setter: setFeedbackMsg },
        ];
        
        errorMappings.forEach(({ key, setter }) => {
          renderErrorMessage(data, key, setter);
        });
        setFeedbackMsg(`Token ${errorText.toLowerCase()}`)
      }
    } catch (error) {
      setFeedbackMsg("Error Communicating with Server")
    }
  };

  return (
    <> 
      <div id="reset-form" className="form-wrapper" style={{flexDirection: 'column'}}>
        <h2>Password Reset</h2>
        <form onSubmit={(e) => handleSubmit(e, resetPassword, {
          password1, password2
        })}>
          <LabeledInputField type="password" id="reset-password1" name="Password" 
            onChange={e => setPassword1(e.target.value)} error={password1FieldError}
          />
          <LabeledInputField type="password" id="reset-password2" name="Password Again" 
            onChange={e => setPassword2(e.target.value)} error={password2FieldError}
          />

          <button type="submit">RESET</button>
          {feedbackMsg && <p className="error-text" id="reset-form-error">{feedbackMsg}</p>}

        </form>
      </div>
    </>
  );
}