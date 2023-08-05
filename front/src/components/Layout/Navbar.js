import { Link } from 'react-router-dom';
import front from '../../settings/Frontend';
import LogoutButton from '../Buttons/LogoutButton';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import HamburgerIconSVG from '../Brand/HamburgerIconSVG';

export default function Navbar() {
    const { token } = useAuth()

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const closeMenu = () => setIsMenuOpen(false)
    const handleToggleMenu = () => {
      setIsMenuOpen(!isMenuOpen);
    };

    return (
        <>
            <button 
                id="menu-toggle-button"
                onClick={handleToggleMenu}>
                <HamburgerIconSVG />
            </button>
            <nav>
                <ul className={isMenuOpen ? 'menu open' : 'menu'}>
                    <li><Link onClick={closeMenu} to={front.webrings}>Rings</Link></li>
                    <li><Link onClick={closeMenu} to={front.pages}>Pages</Link></li>
                    <li className="seperator"><span> | </span></li>
                    { !token ? <>
                        <li><Link onClick={closeMenu} to={front.login}>Login</Link></li>
                        <li><Link onClick={closeMenu} to={front.register}>Register</Link></li>
                    </> : <>
                        <li><Link onClick={closeMenu} to={front.account}>Account</Link></li>
                        <li><Link onClick={closeMenu} to="/page/add">Add Page</Link></li>
                        <li><Link onClick={closeMenu} to="/webring/add">Add Ring</Link></li>
                        <li><LogoutButton /></li>
                    </>}
                </ul>
            </nav>
        </>
    )
}