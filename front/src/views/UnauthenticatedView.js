import { React } from "react";
import LoginForm from "../components/Forms/LoginForm";
import RegisterForm from "../components/Forms/RegisterForm";
import PropTypes from 'prop-types';

export default function UnauthenticatedView({ setToken }) {

    return (
        <div className="auth-form-group">
            <LoginForm setToken={setToken} /> 
            <RegisterForm />
        </div>
    )
}

UnauthenticatedView.propTypes = {
    setToken: PropTypes.func.isRequired
  }
  