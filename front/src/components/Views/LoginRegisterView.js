import { React, useState, useEffect } from "react";
import LoginForm from "../Forms/LoginForm";
import RegisterForm from "../Forms/RegisterForm";
import LoginRegisterText from "../Cards/LoginRegisterText";
import LockedOutText from "../Cards/LockedOutText";
import { useLocation, useNavigate } from 'react-router-dom';
import LockedOutForm from "../Forms/LockedOutForm";
import FrontendSettings from "../../settings/Frontend";
import { useAuth } from "../../context/AuthContext";

export default function LoginRegisterView() {
    const { token, setToken } = useAuth()

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