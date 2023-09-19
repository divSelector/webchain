import { React, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import front from "../../settings/Frontend";
import { useAuth } from "../../context/AuthContext";
import AccountDetails from "./AccountDetails";

export default function Dashboard() {

    const { token, setToken } = useAuth()

    const navigate = useNavigate()
    

    useEffect(() => {
        if (!token) {
          navigate(front.login);
        }
      }, [token]);
    
    return (
        <div className="view-wrapper">
            <div>
                {token && 
                    <AccountDetails /> 
                }
            </div>
        </div>
    )
}
