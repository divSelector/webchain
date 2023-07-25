import { Link } from 'react-router-dom';
import front from '../../settings/Frontend';
import LogoutButton from '../Buttons/LogoutButton';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
    const { token } = useAuth()

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleToggleMenu = () => {
      setIsMenuOpen(!isMenuOpen);
    };

    return (
        <>
            <button 
                id="menu-toggle-button"
                onClick={handleToggleMenu}>
                Menu
            </button>
            <nav>
                <ul className={isMenuOpen ? 'menu open' : 'menu'}>
                    <li><Link to={front.webrings}>Rings</Link></li>
                    <li><Link to={front.pages}>Pages</Link></li>
                    <li className="seperator"><span> | </span></li>
                    { !token ? <>
                        <li><Link to={front.login}>Login</Link></li>
                        <li><Link to={front.register}>Register</Link></li>
                    </> : <>
                        <li><Link to={front.account}>Account</Link></li>
                        <li><Link to="/page/add">Add Page</Link></li>
                        <li><Link to="/webring/add">Add Ring</Link></li>
                        <li><LogoutButton /></li>
                    </>}
                </ul>
            </nav>
        </>
    )
}