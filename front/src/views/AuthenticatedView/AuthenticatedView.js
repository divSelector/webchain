import { React } from "react";
import LogoutButton from "../../components/Logout/LogoutButton";
import PropTypes from 'prop-types';

export default function AuthenticatedView({ token, setToken }) {

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
  