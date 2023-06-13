import { React } from "react";
import LoginForm from "../../components/Login/LoginForm";
import RegisterForm from "../../components/Register/RegisterForm";
import PropTypes from 'prop-types';

export default function UnauthenticatedView({ setToken }) {

    return (
        <>
        <LoginForm setToken={setToken} /> 
        <RegisterForm />
        </>
    )
}

UnauthenticatedView.propTypes = {
    setToken: PropTypes.func.isRequired
  }
  