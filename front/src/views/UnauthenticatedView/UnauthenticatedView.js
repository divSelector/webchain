import { React } from "react";
import LoginForm from "../../components/Login/LoginForm";
import RegisterForm from "../../components/Register/RegisterForm";
import PropTypes from 'prop-types';

export default function UnauthenticatedView({ token, setToken }) {

    return (
        <>
        <LoginForm token={token} setToken={setToken} /> 
        <RegisterForm />
        </>
    )
}

UnauthenticatedView.propTypes = {
    setToken: PropTypes.func.isRequired
  }
  