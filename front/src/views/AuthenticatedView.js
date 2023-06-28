import { React } from "react";
import LogoutButton from "../components/Buttons/LogoutButton";
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import FrontendSettings from "../settings/Frontend";

export default function AuthenticatedView({ token, setToken }) {

    const front = FrontendSettings()

    return (
        <>
        <h3>Hello, you are logged in.</h3>
        <LogoutButton token={token} setToken={setToken} />
        </> 
    )
}

AuthenticatedView.propTypes = {
    setToken: PropTypes.func.isRequired
  }
  