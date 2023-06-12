import { React } from "react";
import Login from "../../components/Login/Login";
import useToken from "../../hooks/useToken";

export default function Dashboard() {

    const { token, setToken } = useToken()

    return (
        <>
        <h2>Dashboard</h2>
        {token ? null : <Login setToken={setToken} />}
        </>
    )
}