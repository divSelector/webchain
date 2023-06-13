import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BackendSettings from '../../settings/Backend';
import LoginForm from '../../components/Login/LoginForm';

export default function AccountVerification() {
  const { token } = useParams();
  const [errorMessage, setErrorMessage] = useState('');
  const [isVerified, setIsVerified] = useState(false)

  useEffect(() => {
    const verifyAccount = async () => {
      const settings = BackendSettings()
      const endpoint = settings.getBaseUrl() + settings.verifyEmail
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            key: token
           })
        });

        console.log(response)
        if (response.ok) {
          setIsVerified(true)
        } else {
          const errorText = await response.statusText;
          setErrorMessage(`Token ${errorText.toLowerCase()}`)
        }
      } catch (error) {
        setErrorMessage("Error Communicating with Server")
      }
    };

    verifyAccount();
  }, [token]);

  return (
    <div>
      <h2>Account Verification</h2>
      {isVerified && <>
        <h3 id="verify-success-message">Account verified. You may now login.</h3>
        <LoginForm />
      </>}
      {errorMessage && <p id="verify-error-message">{errorMessage}</p>}
    </div>
  );
}