import { Link } from 'react-router-dom';

export default function LockedOutText() {

  return (
    <div className="login-register-wrapper">
        <h2>Need help?</h2>
        <p>Enter your email and we can send you a verification code that will allow you to log in with your password.</p>
        <p>...or we can change your password if you don't know what it is.</p>
        <Link to={`/login`} className="help-text">
            Take me back.
        </Link>
    </div>
  );
}