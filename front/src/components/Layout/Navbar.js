import { Link } from 'react-router-dom';
import FrontendSettings from '../../settings/Frontend';
import LogoutButton from '../Buttons/LogoutButton';

const front = FrontendSettings()

export default function Navbar({ token, setToken }) {
    console.log(token)
    return (
        <nav>
            <ul>
                <li><Link to={front.webrings}>Rings</Link></li>
                <li><Link to={front.pages}>Pages</Link></li>
                <li><span> | </span></li>
                { !token ? <>
                    <li><Link to={front.login}>Login</Link></li>
                    <li><Link to={front.register}>Register</Link></li>
                </> : <>
                    <li><Link to={front.account}>Account</Link></li>
                    <li><Link to="/page/add">Add Page</Link></li>
                    <li><LogoutButton token={token} setToken={setToken} /></li>
                </>}
            </ul>
        </nav>
    )
}