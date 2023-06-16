import { React, useState } from "react";
import LoginForm from "../components/Forms/LoginForm";
import RegisterForm from "../components/Forms/RegisterForm";
import PropTypes from 'prop-types';
import LockedOutForm from "../components/Forms/LockedOutForm";
import { toggle } from "../utils/formsUtils";

export default function UnauthenticatedView({ setToken }) {

    const emailState = useState();
    const [isShowingLogin, setIsShowingLogin] = useState(false)
    const [userCantLogin, setUserCantLogin] = useState(false);

    const toggleCantLogin = () => setUserCantLogin(!userCantLogin)
    const toggleRegister = () => setIsShowingLogin(!isShowingLogin)

    let visibleContent;
    if (!userCantLogin) {
        visibleContent = (
            <>
            <div className="login-register-wrapper">
                <h2>Webrings</h2>
                <p>Make Them.</p>
                <p>Join them.</p>
                <p>Be Them.</p>
                <p>
                <a href={void 0} onClick={toggleRegister} className="help-text">
                    {isShowingLogin ? "Login" : "Register"}
                </a>
                </p>
            </div>
            {!isShowingLogin ? (
                <LoginForm
                    setToken={setToken}
                    toggleCantLogin={toggleCantLogin}
                    emailState={emailState}
                />
            ) : (
                <RegisterForm />
            )}
            </>
        );
    } else {
        visibleContent = (
            <>
            <div className="login-register-wrapper">
                <h2>Need help?</h2>
                <p>Enter your email and we can send you a verification code that will allow you to log in with your password.</p>
                <p>...or we can change your password if you don't know what it is.</p>
                <a href={void 0} onClick={toggleCantLogin} className="help-text">Take me back.</a>
            </div>
            <LockedOutForm toggleCantLogin={toggleCantLogin} emailState={emailState} />
            </>
        );
    }

    return <div className="auth-form-group">{visibleContent}</div>
}

UnauthenticatedView.propTypes = {
    setToken: PropTypes.func.isRequired
}
  