import { Link } from 'react-router-dom';
import { capitalize, stripLeadingSlash } from '../../utils/stringUtils';

export default function LoginRegisterText({ currentView }) {
  const oppositeView = currentView === '/login' ? '/register' : '/login';

  return (
    <div className="form-wrapper">
      <h2>Discover, Connect, Grow with Webchain!</h2>
      <p>Create links to your website, connect with like-minded individuals, and expand your online presence.</p>
      <p>Webrings are at the core of Webchain. Submit your blog or personal site to niche communities who share and exchange links, attracting organic traffic.</p>
      <p>Chain webrings together, manage your own rings, connect with other webring admins, and amplify your reach to unlock new opportunities.</p>
      <p>Register or log in to Webchain now. Connect, flourish online.</p>

      <p>
        <Link to={`${oppositeView}`} className="help-text">
            {capitalize(stripLeadingSlash(oppositeView))}
        </Link>
      </p>
    </div>
  );
}
