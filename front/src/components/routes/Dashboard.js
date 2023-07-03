import { React, useEffect } from "react";
import AuthenticatedView from "../../views/AuthenticatedView";
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";
import FrontendSettings from "../../settings/Frontend";

export default function Dashboard({ token, setToken }) {

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

Dashboard.propTypes = {
    setToken: PropTypes.func.isRequired
}