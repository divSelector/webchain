import { React, useEffect } from "react";
import AuthenticatedView from "./AuthenticatedView";
import { useNavigate } from "react-router-dom";
import FrontendSettings from "../../settings/Frontend";
import { useAuth } from "../../context/AuthContext";

export default function Dashboard() {

    const { token, setToken } = useAuth()

    const navigate = useNavigate()
    const front = FrontendSettings()

    useEffect(() => {
        if (!token) {
          navigate(front.login);
        }
      }, [token]);
    
    return (
        <div className="view-wrapper">
            <div>
                {token && 
                    <AuthenticatedView token={token} setToken={setToken} /> 
                }
            </div>
        </div>
    )
}
