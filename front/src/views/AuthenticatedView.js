import { React } from "react";
import PropTypes from 'prop-types';
import FrontendSettings from "../settings/Frontend";

export default function AuthenticatedView({ token, setToken }) {

    const front = FrontendSettings()

    return (
        <>
        <h3>Hello, you are logged in.</h3>
        </> 
    )
}

AuthenticatedView.propTypes = {
    setToken: PropTypes.func.isRequired
  }
  