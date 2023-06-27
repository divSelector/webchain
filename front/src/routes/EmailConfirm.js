import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BackendSettings from '../settings/Backend';
import LoginRegisterView from './LoginRegisterView';
import { Link } from 'react-router-dom';
import FrontendSettings from '../settings/Frontend';

export default function EmailConfirm({ token, setToken }) {
  const front = FrontendSettings()

  const { verifyToken } = useParams();
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [isVerified, setIsVerified] = useState(false)

  useEffect(() => {
    console.log(verifyToken)
    if (!verifyToken) {
      setFeedbackMsg('We sent you an email with instructions to get you logged in.');
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
      <h2>Check your email!</h2>
      {isVerified && <>
        <h3 id="verify-success-message">Account verified. You may now <Link to={front.login}>Login</Link>.</h3>
        <LoginRegisterView token={token} setToken={setToken} /> 
      </>}
     
      {feedbackMsg && <p id="verify-error-message">{feedbackMsg}</p>}
    </>
  );
}