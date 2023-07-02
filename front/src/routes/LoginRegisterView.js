import { React, useState, useEffect } from "react";
import LoginForm from "../components/Forms/LoginForm";
import RegisterForm from "../components/Forms/RegisterForm";
import LoginRegisterText from "../components/Cards/LoginRegisterText";
import LockedOutText from "../components/Cards/LockedOutText";
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import LockedOutForm from "../components/Forms/LockedOutForm";
import FrontendSettings from "../settings/Frontend";


export default function LoginRegisterView({ token, setToken }) {

    const emailState = useState();
    const location = useLocation();
    const currentView = location.pathname
    const navigate = useNavigate();

    const front = FrontendSettings()
  
    useEffect(() => {
      if (location.pathname !== '/' && location.pathname.endsWith('/')) {
        const newPathname = location.pathname.slice(0, -1);
        navigate(newPathname, {replace: true})
      }
    }, [location]);

    useEffect(() => {
        if (token && !location.pathname.startsWith(front.verifyEmail)) navigate('/')
    }, [token])

    function renderLeft() {
        if (currentView === front.loginHelp) {
            return <LockedOutForm emailState={emailState }/>
        } else {
            return <LoginRegisterText currentView={currentView} />
        }
    }

    function renderRight() {
        if (currentView === front.register) {
            return <RegisterForm setToken={setToken} emailState={emailState} />;
        } else if (currentView === front.loginHelp) {
            return <LockedOutText />
        } else {
            return <LoginForm setToken={setToken} emailState={emailState} />;
        }
    }

    return (
        <div className="view-wrapper">
            {renderLeft()}
            {renderRight()}
        </div>
    )
}

LoginRegisterView.propTypes = {
    setToken: PropTypes.func.isRequired
}
  