import { useState, useEffect } from "react";
import LoginForm from "../Forms/LoginForm";
import RegisterForm from "../Forms/RegisterForm";
import LoginRegisterText from "../Cards/LoginRegisterText";
import LockedOutText from "../Cards/LockedOutText";
import { useLocation, useNavigate } from 'react-router-dom';
import LockedOutForm from "../Forms/LockedOutForm";
import front from "../../settings/Frontend";
import { useAuth } from "../../context/AuthContext";
import React from 'react';

export default function LoginRegisterView() {
    const { token, setToken } = useAuth()

    const emailState = useState();
    const location = useLocation();
    const currentView = location.pathname
    const navigate = useNavigate();


    useEffect(() => {
      if (location.pathname !== '/' && location.pathname.endsWith('/')) {
        const newPathname = location.pathname.slice(0, -1);
        navigate(newPathname, {replace: true})
      }
    }, [location]);

    useEffect(() => {
        if (token && !location.pathname.startsWith(front.verifyEmail)) {
            navigate(location.state?.path || '/')
        };
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