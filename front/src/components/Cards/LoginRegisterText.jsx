import { Link } from 'react-router-dom';
import { capitalize, stripLeadingSlash } from '../../utils/stringUtils';
import React from 'react';

export default function LoginRegisterText({ currentView }) {
  const oppositeView = currentView === '/login' ? '/register' : '/login';

  const handleToggleLoginRegister = () => {
    window.scrollTo(0, 0);
  };


  return (
    <div className="form-wrapper">
    <h2>Neorings - Connect Your Neocities Webring</h2>
    <p>Neorings is the dedicated platform for neocities.org users to host and connect their webrings. Join vibrant niche communities, submit your Neocities blog or personal site to attract organic traffic, and amplify your online presence.</p>
    <p>Manage your rings and connect with other Neocities webring admins to unlock new opportunities. Neorings is the perfect space for Neocities users to collaborate and expand their reach within the Neocities community.</p>
    <p>Register or log in to Neorings now and connect with like-minded Neocities creators. Elevate your Neocities experience with Neorings!</p>
      <p>
        <Link 
          to={`${oppositeView}`} 
          className="help-text"
          onClick={handleToggleLoginRegister}>
            {capitalize(stripLeadingSlash(oppositeView))}
        </Link>
      </p>
    </div>
  );
}
