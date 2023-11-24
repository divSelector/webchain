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
      <h2>Modern Webrings</h2>
      <p>Neorings is the dedicated platform for webmasters of the oldweb to host and connect their pages to webrings. Join vibrant niche communities, submit your pages to attract organic traffic, and amplify the reach of your web projects.</p>
      <p>Manage your rings and connect with other webring admins to unlock new connections. Neorings is the perfect space to collaborate and expand your reach within the oldweb community.</p>
      <p>Register or log in and elevate your oldweb experience with Neorings!</p>
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
