import { React } from "react";
import AuthenticatedView from "../views/AuthenticatedView";
import UnauthenticatedView from "../views/UnauthenticatedView";
import PropTypes from 'prop-types';

export default function Dashboard({ token, setToken }) {

    return (
        <>
        <h2>Dashboard</h2>
        {token 
            ? <AuthenticatedView token={token} setToken={setToken} /> 
            : <UnauthenticatedView setToken={setToken} />}
        </>
    )
}

Dashboard.propTypes = {
    setToken: PropTypes.func.isRequired
}