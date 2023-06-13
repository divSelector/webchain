import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BackendSettings from '../settings/Backend';
import LoginForm from '../components/Forms/LoginForm';
import useToken from '../hooks/useToken';

export default function AccountVerification() {
  const { verifyToken } = useParams();
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [isVerified, setIsVerified] = useState(false)

  const { token, setToken } = useToken()  

  useEffect(() => {
    console.log(verifyToken)
    if (!verifyToken) {
      setFeedbackMsg('Check your email to confirm your account.');
      return;
    }
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
            key: verifyToken
           })
        });

        console.log(response)
        if (response.ok) {
          setIsVerified(true)
        } else {
          const errorText = await response.statusText;
          setFeedbackMsg(`Token ${errorText.toLowerCase()}`)
        }
      } catch (error) {
        setFeedbackMsg("Error Communicating with Server")
      }
    };

    verifyAccount();
  }, [verifyToken]);

  return (
    <>
      <h2>Account Verification</h2>
      {isVerified && <>
        <h3 id="verify-success-message">Account verified. You may now login.</h3>
        <LoginForm setToken={setToken} />
      </>}
      {feedbackMsg && <p id="verify-error-message">{feedbackMsg}</p>}
    </>
  );
}