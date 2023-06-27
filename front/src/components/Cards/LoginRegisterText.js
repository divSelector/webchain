import { Link } from 'react-router-dom';
import { capitalize, stripLeadingSlash } from '../../utils/stringUtils';

export default function LoginRegisterText({ currentView }) {
  const oppositeView = currentView === '/login' ? '/register' : '/login';

  return (
    <div className="login-register-wrapper">
      <h2>Webrings</h2>
      <p>Make Them.</p>
      <p>Join them.</p>
      <p>Be Them.</p>
      <p>
        <Link to={`${oppositeView}`} className="help-text">
            {capitalize(stripLeadingSlash(oppositeView))}
        </Link>
      </p>
    </div>
  );
}
