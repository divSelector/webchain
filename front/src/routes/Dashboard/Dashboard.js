import { React } from "react";
import useToken from "../../hooks/useToken";
import AuthenticatedView from "../../views/AuthenticatedView/AuthenticatedView";
import UnauthenticatedView from "../../views/UnauthenticatedView/UnauthenticatedView";

export default function Dashboard() {

    const { token, setToken } = useToken()

    return (
        <>
        <h2>Dashboard</h2>
        {token 
            ? <AuthenticatedView token={token} setToken={setToken} /> 
            : <UnauthenticatedView setToken={setToken} />}
        </>
    )
}